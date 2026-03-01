#!/usr/bin/env python3
"""
Continuous HTTP Server for Tool Discovery

Exposes the Retriever functionality via a FastAPI web server.
"""

import json
import os
import asyncio
import time
import logging
from pathlib import Path
from typing import Optional, Dict, Any, List

log = logging.getLogger(__name__)

from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import uvicorn
from dotenv import load_dotenv

# Add data directory to sys.path to allow imports
sys.path.append(str(Path(__file__).parent / "server"))

from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters
from mcp.client.streamable_http import streamable_http_client

# Load environment variables from data/.env
ENV_PATH = Path(__file__).parent / "server" / ".env"
load_dotenv(dotenv_path=ENV_PATH)

try:
    from data.retriever import Retriever
    from data.db import get_connection, DATABASE_PATH
    from data.mcp_client import resolve_env_vars
    from data.nango_auth import maybe_inject_nango_auth_headers
    from data.oauth_tokens import maybe_prepare_oauth_env
except ImportError:
    # Fallback if run from data directory or if PYTHONPATH is set differently
    from retriever import Retriever
    from db import get_connection, DATABASE_PATH
    from mcp_client import resolve_env_vars
    from nango_auth import maybe_inject_nango_auth_headers
    from oauth_tokens import maybe_prepare_oauth_env

from contextlib import asynccontextmanager

# ---------------------------------------------------------------------------
# Persistent MCP connection pool for stdio servers
# ---------------------------------------------------------------------------

POOL_IDLE_TTL = 300        # seconds before an idle stdio session is spun down
POOL_REAP_INTERVAL = 60    # how often the reaper task runs


class _PoolEntry:
    """Holds a live stdio MCP session plus its exit-stack context."""
    def __init__(self, session: ClientSession, stack):
        self.session = session
        self.stack = stack              # AsyncExitStack keeping the process alive
        self.last_used: float = time.monotonic()

    def touch(self):
        self.last_used = time.monotonic()

    @property
    def idle_seconds(self) -> float:
        return time.monotonic() - self.last_used


class McpPool:
    """
    Keeps one persistent stdio MCP session alive per unique server command.
    Sessions are spun up on first use and torn down after POOL_IDLE_TTL seconds
    of inactivity.

    Key is a tuple of (command, frozen-args, frozen-relevant-env-items) so that
    two calls to the same package share one process.
    """

    def __init__(self, idle_ttl: float = POOL_IDLE_TTL):
        self._entries: Dict[tuple, _PoolEntry] = {}
        self._lock = asyncio.Lock()
        self._idle_ttl = idle_ttl
        self._reaper_task: Optional[asyncio.Task] = None

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

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

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

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
            # Session is broken — evict it and retry once with a fresh connection
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

    # ------------------------------------------------------------------
    # Internals
    # ------------------------------------------------------------------

    @staticmethod
    def _make_key(params: StdioServerParameters) -> tuple:
        # Only fingerprint env vars that differ from the base os.environ.
        # Full os.environ is shared by all calls; only server-specific overrides
        # (OAuth tokens, API keys, etc.) should create distinct pool slots.
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
        # create outside the lock — takes a few seconds
        entry = await self._create(params)
        async with self._lock:
            # Double-check: another task may have raced us
            existing = self._entries.get(key)
            if existing is not None:
                # We lost the race — close ours and use theirs
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


# Module-level pool instance (shared across all requests)
_stdio_pool = McpPool(idle_ttl=POOL_IDLE_TTL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("🚀 Pre-loading embedding model...")
    retriever.warmup()
    print("✓ Model loaded and ready.")
    _stdio_pool.start()
    yield
    # Shutdown: close all pooled MCP processes
    await _stdio_pool.stop()

app = FastAPI(
    title="Wisp Tool Discovery API",
    description="Continuously running server for discovering the best MCP servers and tools.",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. Can be restricted to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Retriever
# Note: In a production environment, you might want to handle DB connection pooling
# or use a dependency injection pattern.
retriever = Retriever()

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.get("/keys")
async def list_available_keys():
    """
    Returns a list of API keys/tokens defined in .tokens.
    Useful for agents to know their capabilities.
    """
    tokens_path = Path(__file__).parent / "server" / ".tokens"
    if not tokens_path.exists():
        # Fallback to check server/.tokens if data/.tokens doesn't exist (due to recent path changes)
        tokens_path = Path(__file__).parent / "server" / ".tokens"
        
    if not tokens_path.exists():
        return {"available_keys": []}
    
    with open(tokens_path, "r") as f:
        lines = f.readlines()
    
    # Filter out comments and empty lines
    keys = []
    for line in lines:
        clean = line.strip()
        if clean and not clean.startswith("#"):
            keys.append(clean)
            
    return {"available_keys": keys}

@app.get("/search")
async def search_tools(
    query: str = Query(..., description="The search query for tools or servers"),
    page: int = Query(1, ge=1, description="Page number for results"),
    limit: int = Query(10, ge=1, le=100, description="Number of results per page")
):
    """
    Search for tools matching the query.
    Returns hydrated tool metadata, server information, and relevance scores.
    """
    try:
        results = retriever.retrieve(query, page=page, limit=limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during retrieval: {str(e)}")

@app.get("/servers/search")
async def search_servers(
    query: str = Query(..., description="Search query for server names or descriptions"),
    limit: int = Query(10, ge=1, le=50, description="Max results"),
):
    """Search for MCP servers by name or description."""
    conn = get_connection()
    cursor = conn.cursor()
    q = f"%{query}%"
    cursor.execute("""
        SELECT s.name, s.description,
            (SELECT COUNT(*) FROM tools t WHERE t.server_name = s.name) as tool_count
        FROM servers s
        WHERE s.name LIKE ? OR s.description LIKE ?
        ORDER BY
            CASE WHEN s.name LIKE ? THEN 0 ELSE 1 END,
            tool_count DESC
        LIMIT ?
    """, (q, q, q, limit))
    rows = cursor.fetchall()
    conn.close()
    return {"servers": [{"name": r["name"], "description": r["description"], "tool_count": r["tool_count"]} for r in rows]}

@app.get("/servers/{server_name:path}/tools")
async def list_server_tools(server_name: str):
    """
    List all tools available on a specific server.
    """
    try:
        tools = retriever.get_tools_for_server(server_name)
        return {"server": server_name, "tools": tools}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving tools for server: {str(e)}")

class CallRequest(BaseModel):
    server_name: str
    tool_name: str
    arguments: Dict[str, Any] = {}

async def get_server_connection_info(server_name: str) -> Dict[str, Any]:
    """Fetch connection info for a server from the database."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check for remote HTTP endpoint
    cursor.execute("""
        SELECT transport_type, url, headers_json 
        FROM server_remotes WHERE server_name = ?
    """, (server_name,))
    remote = cursor.fetchone()
    if remote:
        headers_json = remote["headers_json"]
        headers = json.loads(headers_json) if headers_json else None
        if headers:
            headers = resolve_env_vars(headers)
            
        return {
            "method": "remote",
            "url": remote["url"],
            "headers": headers
        }
    
    # Check for stdio package
    cursor.execute("""
        SELECT registry_type, identifier, runtime_hint 
        FROM server_packages WHERE server_name = ? AND transport_type = 'stdio'
    """, (server_name,))
    pkg = cursor.fetchone()
    if pkg:
        return {
            "method": "stdio",
            "registry": pkg["registry_type"],
            "identifier": pkg["identifier"],
            "runtime_hint": pkg["runtime_hint"]
        }
        
    # Check for local source
    cursor.execute("""
        SELECT command, args_json, working_dir, env_json 
        FROM server_local_sources WHERE server_name = ?
    """, (server_name,))
    local = cursor.fetchone()
    if local:
        return {
            "method": "local",
            "command": local["command"],
            "args": json.loads(local["args_json"]) if local["args_json"] else [],
            "cwd": local["working_dir"],
            "env": json.loads(local["env_json"]) if local["env_json"] else {}
        }
        
    conn.close()
    return None

def build_stdio_command(server_info: Dict) -> tuple[str, list[str]]:
    """Build the command and args for a stdio server."""
    registry = server_info.get('registry', '')
    identifier = server_info.get('identifier', '')
    runtime_hint = server_info.get('runtime_hint', '')
    
    if runtime_hint:
        return runtime_hint, [identifier]
    
    if registry == 'npm':
        return 'npx', ['-y', '--quiet', identifier]
    elif registry == 'pypi':
        return 'uvx', ['--quiet', identifier]
    elif registry == 'oci':
        return 'docker', ['run', '--rm', '-i', identifier]
    return 'npx', ['-y', '--quiet', identifier]

@app.post("/call")
async def call_tool(request: CallRequest):
    """
    Execute a tool on an MCP server.
    """
    info = await get_server_connection_info(request.server_name)
    if not info:
        raise HTTPException(status_code=404, detail=f"Connection info for server '{request.server_name}' not found.")

    # browser-use monitor_task blocks until the agent finishes — needs a long timeout
    is_long_running = request.tool_name in ("monitor_task", "browser_task")
    timeout = 600 if is_long_running else 60
    
    try:
        if info["method"] == "remote":
            import httpx
            http_client = None
            headers = await maybe_inject_nango_auth_headers(
                request.server_name,
                info.get("headers"),
            )
            if headers:
                http_client = httpx.AsyncClient(headers=headers)
                
            async with streamable_http_client(info["url"], http_client=http_client) as (read, write, _):
                async with ClientSession(read, write) as session:
                    await asyncio.wait_for(session.initialize(), timeout=timeout)
                    result = await asyncio.wait_for(
                        session.call_tool(request.tool_name, request.arguments), 
                        timeout=timeout
                    )
                    return result.model_dump() if hasattr(result, "model_dump") else result
                    
        elif info["method"] == "stdio" or info["method"] == "local":
            if info["method"] == "stdio":
                command, args = build_stdio_command(info)
                env = os.environ.copy()
                cwd = None
            else:
                command = info["command"]
                args = info["args"]
                env = os.environ.copy()
                env.update(info["env"])
                cwd = info["cwd"]

            env = maybe_prepare_oauth_env(request.server_name, env)

            server_params = StdioServerParameters(
                command=command,
                args=args,
                env=env,
                cwd=cwd
            )

            # Use the persistent pool — no per-call process spawn overhead
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
        
        # Unwrap ExceptionGroup from anyio so we can see the real error
        error_msg = str(e)
        if isinstance(e, ExceptionGroup):
            msgs = []
            for exc in getattr(e, "exceptions", []):
                # If there's nested exception groups, grab the leaf exceptions
                if isinstance(exc, ExceptionGroup):
                    msgs.extend(str(sub) for sub in getattr(exc, "exceptions", []))
                else:
                    msgs.append(str(exc))
            if msgs:
                error_msg = " | ".join(msgs)
                
        raise HTTPException(status_code=500, detail=error_msg)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
