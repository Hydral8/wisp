#!/usr/bin/env python3
"""
Wisp MCP Proxy — Thin tool execution proxy.

Keeps a persistent stdio MCP connection pool and exposes a /call endpoint.
All search/discovery logic has moved to Convex.

Run: python server.py
"""

import json
import os
import asyncio
import time
import logging
from pathlib import Path
from typing import Optional, Dict, Any

log = logging.getLogger(__name__)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters
from mcp.client.streamable_http import streamable_http_client

# Load environment variables
ENV_PATH = Path(__file__).parent / "server" / ".env"
load_dotenv(dotenv_path=ENV_PATH)


# ---------------------------------------------------------------------------
# Persistent MCP connection pool for stdio servers
# ---------------------------------------------------------------------------

POOL_IDLE_TTL = 300
POOL_REAP_INTERVAL = 60


class _PoolEntry:
    """Holds a live stdio MCP session plus its exit-stack context."""
    def __init__(self, session: ClientSession, stack):
        self.session = session
        self.stack = stack
        self.last_used: float = time.monotonic()

    def touch(self):
        self.last_used = time.monotonic()

    @property
    def idle_seconds(self) -> float:
        return time.monotonic() - self.last_used


class McpPool:
    """
    Keeps one persistent stdio MCP session alive per unique server command.
    Sessions are spun up on first use and torn down after idle TTL.
    """

    def __init__(self, idle_ttl: float = POOL_IDLE_TTL):
        self._entries: Dict[tuple, _PoolEntry] = {}
        self._lock = asyncio.Lock()
        self._idle_ttl = idle_ttl
        self._reaper_task: Optional[asyncio.Task] = None

    def start(self):
        self._reaper_task = asyncio.create_task(self._reap_loop())

    async def stop(self):
        if self._reaper_task:
            self._reaper_task.cancel()
            try:
                await self._reaper_task
            except asyncio.CancelledError:
                pass
        async with self._lock:
            keys = list(self._entries.keys())
        for key in keys:
            await self._evict(key)

    async def call_tool(
        self,
        server_params: StdioServerParameters,
        tool_name: str,
        arguments: Dict[str, Any],
        timeout: float = 60,
    ) -> Any:
        """Call a tool, reusing the pooled session or creating a fresh one."""
        key = self._make_key(server_params)
        entry = await self._get_or_create(key, server_params)
        try:
            entry.touch()
            result = await asyncio.wait_for(
                entry.session.call_tool(tool_name, arguments),
                timeout=timeout,
            )
            entry.touch()
            return result
        except Exception as exc:
            log.warning("Pooled session for %s failed (%s); reconnecting.", key, exc)
            await self._evict(key)
            entry = await self._get_or_create(key, server_params)
            entry.touch()
            result = await asyncio.wait_for(
                entry.session.call_tool(tool_name, arguments),
                timeout=timeout,
            )
            entry.touch()
            return result

    @staticmethod
    def _make_key(params: StdioServerParameters) -> tuple:
        base = os.environ
        extra = tuple(sorted(
            (k, v) for k, v in (params.env or {}).items()
            if base.get(k) != v
        ))
        return (params.command, tuple(params.args or []), extra)

    async def _get_or_create(self, key: tuple, params: StdioServerParameters) -> _PoolEntry:
        async with self._lock:
            entry = self._entries.get(key)
            if entry is not None:
                return entry
        entry = await self._create(params)
        async with self._lock:
            existing = self._entries.get(key)
            if existing is not None:
                asyncio.create_task(self._close_entry(entry))
                return existing
            self._entries[key] = entry
            return entry

    async def _create(self, params: StdioServerParameters) -> _PoolEntry:
        from contextlib import AsyncExitStack
        stack = AsyncExitStack()
        read, write = await stack.enter_async_context(stdio_client(params))
        session = await stack.enter_async_context(ClientSession(read, write))
        await asyncio.wait_for(session.initialize(), timeout=30)
        log.info("MCP pool: started %s %s", params.command, " ".join(params.args or []))
        return _PoolEntry(session, stack)

    async def _evict(self, key: tuple):
        async with self._lock:
            entry = self._entries.pop(key, None)
        if entry:
            await self._close_entry(entry)

    @staticmethod
    async def _close_entry(entry: _PoolEntry):
        try:
            await entry.stack.aclose()
        except Exception as exc:
            log.debug("Pool teardown error (ignored): %s", exc)

    async def _reap_loop(self):
        while True:
            await asyncio.sleep(POOL_REAP_INTERVAL)
            async with self._lock:
                idle = [
                    k for k, e in self._entries.items()
                    if e.idle_seconds >= self._idle_ttl
                ]
            for key in idle:
                log.info("MCP pool: idle TTL reached, evicting %s", key)
                await self._evict(key)


_stdio_pool = McpPool(idle_ttl=POOL_IDLE_TTL)


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    _stdio_pool.start()
    yield
    await _stdio_pool.stop()

app = FastAPI(
    title="Wisp MCP Proxy",
    description="Thin MCP tool execution proxy.",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class CallRequest(BaseModel):
    server_name: str
    tool_name: str
    arguments: Dict[str, Any] = {}
    # Optional: connection info passed by Convex (makes proxy stateless)
    connection_info: Optional[Dict[str, Any]] = None

class EmbedRequest(BaseModel):
    text: str


# ---------------------------------------------------------------------------
# Embedding Support
# ---------------------------------------------------------------------------

_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            log.info("Loading semantic embedding model: google/embeddinggemma-300m...")
            _embedding_model = SentenceTransformer("google/embeddinggemma-300m")
        except ImportError:
            log.warning("sentence-transformers not installed; embeddings endpoint will fail.")
    return _embedding_model


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def resolve_env_vars(headers: dict) -> dict:
    """Replace ${VAR_NAME} placeholders in header values with env vars."""
    resolved = {}
    for k, v in headers.items():
        if isinstance(v, str) and v.startswith("${") and v.endswith("}"):
            var_name = v[2:-1]
            resolved[k] = os.environ.get(var_name, v)
        else:
            resolved[k] = v
    return resolved


def build_stdio_command(server_info: Dict) -> tuple[str, list[str]]:
    """Build the command and args for a stdio server."""
    registry = server_info.get("registry", "")
    identifier = server_info.get("identifier", "")
    runtime_hint = server_info.get("runtime_hint", "")

    if runtime_hint:
        return runtime_hint, [identifier]
    if registry == "npm":
        return "npx", ["-y", "--quiet", identifier]
    elif registry == "pypi":
        return "uvx", ["--quiet", identifier]
    elif registry == "oci":
        return "docker", ["run", "--rm", "-i", identifier]
    return "npx", ["-y", "--quiet", identifier]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/embed")
async def embed_text(req: EmbedRequest):
    """Generate 768-D embeddings for the input text."""
    model = get_embedding_model()
    if not model:
        raise HTTPException(
            status_code=500, detail="SentenceTransformer is not available."
        )
    vec = model.encode(req.text)
    return {"embedding": vec.tolist()}


@app.post("/call")
async def call_tool(request: CallRequest):
    """Execute a tool on an MCP server."""
    info = request.connection_info
    if not info:
        # Fallback: try to read from local SQLite (for backward compatibility)
        try:
            import sys
            sys.path.append(str(Path(__file__).parent / "server"))
            from db import get_connection
            info = await _get_server_connection_info_from_db(request.server_name)
        except Exception:
            pass

    if not info:
        raise HTTPException(
            status_code=404,
            detail=f"Connection info for server '{request.server_name}' not found. "
                   "Pass connection_info in the request body.",
        )

    is_long_running = request.tool_name in ("monitor_task", "browser_task")
    timeout = 600 if is_long_running else 60

    try:
        if info["method"] == "remote":
            import httpx
            headers = info.get("headers")
            if headers:
                headers = resolve_env_vars(headers)
            http_client = httpx.AsyncClient(headers=headers) if headers else None

            async with streamable_http_client(info["url"], http_client=http_client) as (read, write, _):
                async with ClientSession(read, write) as session:
                    await asyncio.wait_for(session.initialize(), timeout=timeout)
                    result = await asyncio.wait_for(
                        session.call_tool(request.tool_name, request.arguments),
                        timeout=timeout,
                    )
                    return result.model_dump() if hasattr(result, "model_dump") else result

        elif info["method"] in ("stdio", "local"):
            if info["method"] == "stdio":
                command, args = build_stdio_command(info)
                env = os.environ.copy()
                cwd = None
            else:
                command = info["command"]
                args = info.get("args", [])
                env = os.environ.copy()
                env.update(info.get("env", {}))
                cwd = info.get("cwd")

            server_params = StdioServerParameters(
                command=command,
                args=args,
                env=env,
                cwd=cwd,
            )

            result = await _stdio_pool.call_tool(
                server_params,
                request.tool_name,
                request.arguments,
                timeout=timeout,
            )
            return result.model_dump() if hasattr(result, "model_dump") else result

    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Tool execution timed out.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        error_msg = str(e)
        if isinstance(e, ExceptionGroup):
            msgs = []
            for exc in getattr(e, "exceptions", []):
                if isinstance(exc, ExceptionGroup):
                    msgs.extend(str(sub) for sub in getattr(exc, "exceptions", []))
                else:
                    msgs.append(str(exc))
            if msgs:
                error_msg = " | ".join(msgs)
        raise HTTPException(status_code=500, detail=error_msg)


async def _get_server_connection_info_from_db(server_name: str) -> Optional[Dict[str, Any]]:
    """Fallback: read connection info from local SQLite."""
    try:
        from db import get_connection
        conn = get_connection()
        cursor = conn.cursor()

        # Check remotes
        cursor.execute(
            "SELECT transport_type, url, headers_json FROM server_remotes WHERE server_name = ?",
            (server_name,),
        )
        remote = cursor.fetchone()
        if remote:
            headers = json.loads(remote["headers_json"]) if remote["headers_json"] else None
            if headers:
                headers = resolve_env_vars(headers)
            conn.close()
            return {"method": "remote", "url": remote["url"], "headers": headers}

        # Check packages
        cursor.execute(
            "SELECT registry_type, identifier, runtime_hint "
            "FROM server_packages WHERE server_name = ? AND transport_type = 'stdio'",
            (server_name,),
        )
        pkg = cursor.fetchone()
        if pkg:
            conn.close()
            return {
                "method": "stdio",
                "registry": pkg["registry_type"],
                "identifier": pkg["identifier"],
                "runtime_hint": pkg["runtime_hint"],
            }

        conn.close()
    except Exception:
        pass
    return None


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
