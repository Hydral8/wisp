#!/usr/bin/env python3
"""
Wisp Instant — Main Server

Plans DAGs of MCP tool calls via Claude, executes in parallel, streams via SSE.
Calls the MCP router (router/server.py on :8000) for tool search + execution.

Run: python server.py
"""

import asyncio, json, os, re, time, uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import anthropic, httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Load .env from router/server/.env (sibling directory)
_env = Path(__file__).resolve().parent.parent / "router" / "server" / ".env"
if _env.exists():
    load_dotenv(dotenv_path=_env)

WISP_URL = os.getenv("WISP_GATEWAY_URL", "http://localhost:8000")
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")

app = FastAPI(title="Wisp Instant", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# --- Models ---

class DAGNode(BaseModel):
    id: str; step: str; server_name: str; tool_name: str
    arguments: dict[str, Any] = {}; depends_on: list[str] = []; output_key: str = ""

class Workflow(BaseModel):
    id: str; name: str; description: str; nodes: list[DAGNode]
    status: str = "planned"; webhook_id: Optional[str] = None
    browser_use_mode: str = "local"

class PlanReq(BaseModel):
    prompt: str

class ChatReq(BaseModel):
    session_id: str; message: str

class DeployReq(BaseModel):
    workflow_id: str
    browser_use_mode: Optional[str] = None

class WebhookReq(BaseModel):
    workflow_id: str

class CredentialProfile(BaseModel):
    app_id: str
    display_name: str = ""
    username: str = ""
    email: str = ""
    password: str = ""
    api_key: str = ""
    token: str = ""
    notes: str = ""
    updated_at: str = ""

class CredentialUpsertReq(BaseModel):
    display_name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    api_key: Optional[str] = None
    token: Optional[str] = None
    notes: Optional[str] = None

# --- State ---

workflows: dict[str, Workflow] = {}
webhooks: dict[str, str] = {}
sessions: dict[str, dict] = {}
CREDENTIALS_FILE = Path(__file__).resolve().parent / "credentials_profiles.json"
credential_profiles: dict[str, CredentialProfile] = {}


def _normalize_app_id(app_id: str) -> str:
    return app_id.strip().lower()


def load_credential_profiles() -> None:
    global credential_profiles
    if not CREDENTIALS_FILE.exists():
        credential_profiles = {}
        return
    try:
        raw = json.loads(CREDENTIALS_FILE.read_text())
        if not isinstance(raw, dict):
            credential_profiles = {}
            return
        loaded: dict[str, CredentialProfile] = {}
        for app_id, profile_data in raw.items():
            if not isinstance(profile_data, dict):
                continue
            key = _normalize_app_id(app_id)
            normalized = dict(profile_data)
            normalized["app_id"] = key
            loaded[key] = CredentialProfile(**normalized)
        credential_profiles = loaded
    except Exception:
        credential_profiles = {}


def save_credential_profiles() -> None:
    serialized = {app_id: profile.model_dump() for app_id, profile in credential_profiles.items()}
    CREDENTIALS_FILE.write_text(json.dumps(serialized, indent=2, sort_keys=True))


load_credential_profiles()

# For bidirectional credential flow: node_id -> {"event": asyncio.Event, "data": dict}
pending_inputs: dict[str, dict] = {}

# --- JSON extraction (handles LLM prose around JSON) ---

class PlanIncomplete(Exception):
    def __init__(self, msg: str):
        self.message = msg; super().__init__(msg)

def extract_json(text: str) -> Optional[dict]:
    # 1. whole text
    try:
        o = json.loads(text.strip())
        if isinstance(o, dict): return o
    except json.JSONDecodeError: pass
    # 2. markdown fence
    m = re.search(r"```(?:json)?\s*\n?(.*?)```", text, re.DOTALL)
    if m:
        try:
            o = json.loads(m.group(1).strip())
            if isinstance(o, dict): return o
        except json.JSONDecodeError: pass
    # 3. brace match
    s = text.find("{")
    if s == -1: return None
    depth = 0; in_str = False; esc = False
    for i in range(s, len(text)):
        c = text[i]
        if esc: esc = False; continue
        if c == "\\": esc = True; continue
        if c == '"': in_str = not in_str; continue
        if in_str: continue
        if c == "{": depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                try:
                    o = json.loads(text[s:i+1])
                    if isinstance(o, dict): return o
                except json.JSONDecodeError: pass
                break
    return None

def is_dag(obj: dict) -> bool:
    return "nodes" in obj and isinstance(obj["nodes"], list) and len(obj["nodes"]) > 0

# --- Planner ---

SYSTEM = """You are a workflow planner for Wisp, a tool gateway with 2000+ MCP tools.
Search for real tools, then output a JSON DAG:
{"name":"...","description":"...","nodes":[{"id":"n1","step":"...","server_name":"...","tool_name":"...","arguments":{},"depends_on":[],"output_key":"r1"}]}

TOOL SEARCH RULES (critical):
- You may call search_tools multiple times in parallel, but ONLY for genuinely different capabilities.
  GOOD parallel: "GitHub search repositories" + "web page scraper" (different capabilities)
  BAD parallel: "GitHub search trending repos" + "GitHub trending repositories search" (same intent rephrased)
- Each distinct capability needs exactly ONE search. Never rephrase and retry the same search.
- Once you have results, produce the DAG immediately. Do not search again for capabilities you already found tools for.

OTHER RULES:
- For tasks an LLM handles natively (summarizing, formatting, analyzing, translating, classifying, comparing, writing), use server_name "__llm__" with tool_name "generate". Arguments: {"prompt": "your instruction here", "input": "{{previous_output_key}}"}. Do NOT search for tools for these tasks.
- For autonomous browser task execution, you can use server_name "__browser_use__" with tool_name "run_task" and arguments {"task":"..."}. Use this for web navigation/extraction workflows that should stream step-by-step progress.
- depends_on controls ordering. {{output_key}} references previous results.
- If you CANNOT fulfill part or all of the request, respond in plain text (no JSON) explaining specifically why:
  * "No suitable tool found for X" if search returned nothing relevant
  * "Tool X requires authentication against Y" if the tool needs credentials the user hasn't provided
  * "This task requires capabilities not available in the current tool set" for unsupported operations
  * Suggest alternatives or workarounds when possible
- If only some steps are blocked, build a partial DAG for what IS possible and explain what was skipped and why in a "warnings" field: {"name":"...","description":"...","warnings":["..."],"nodes":[...]}
- When everything is feasible, output ONLY the JSON DAG, no prose.

BROWSER FALLBACK:
- If no specific MCP tool is found for a task, fall back to browser-use. Search for "browser use" to find the browser automation MCP tool.
- Browser-use can automate most workflows directly via the browser: navigate pages, fill forms, click buttons, extract data, etc.
- Always prefer a dedicated MCP tool when one is available. Use browser-use ONLY as a last-resort fallback.
- When using browser-use, provide clear step-by-step instructions in the arguments describing what to do in the browser.

CREDENTIAL REQUESTS (bidirectional):
- If any step (especially browser-use) requires user credentials (username, password, API key, OAuth token, etc.), you MUST add a node BEFORE that step with server_name "__user_input__" and tool_name "request_credentials".
- Arguments format: {"fields": [{"name": "username", "label": "GitHub Username"}, {"name": "password", "label": "GitHub Password", "sensitive": true}], "reason": "Login to GitHub to star the repository"}
- Mark any secret field (passwords, tokens, API keys) with "sensitive": true so the UI renders a password input.
- The output_key of the __user_input__ node should be referenced by downstream steps via {{output_key}} to inject the collected values.
- Example: if output_key is "creds", the browser-use step can reference {{creds}} to get {"username": "...", "password": "..."}."""

SEARCH_TOOL = {"name": "search_tools", "description": "Search Wisp for MCP tools matching a query.", "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}}

async def search_tools(query: str, limit: int = 5) -> list[dict]:
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.get(f"{WISP_URL}/search", params={"query": query, "limit": limit})
        r.raise_for_status()
        data = r.json()
        tools = data if isinstance(data, list) else data.get("tools", data.get("results", []))
        return [{"server_name": t.get("server", {}).get("name", t.get("server_name", "")),
                 "tool_name": t.get("name", t.get("tool_name", "")),
                 "description": t.get("description", ""),
                 "input_schema": t.get("input_schema", t.get("inputSchema", {}))} for t in tools]

async def run_planner(messages: list[dict], max_turns: int = 8) -> tuple[Optional[Workflow], list[dict], list[dict]]:
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    chat_msgs: list[dict] = []

    for _ in range(max_turns):
        resp = client.messages.create(model="claude-sonnet-4-20250514", max_tokens=4096, system=SYSTEM, tools=[SEARCH_TOOL], messages=messages)

        if resp.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": resp.content})
            results = []
            for b in resp.content:
                if b.type == "tool_use":
                    q = b.input.get("query", "")
                    chat_msgs.append({"role": "system", "content": f"Searching: {q}"})
                    r = await search_tools(q)
                    results.append({"type": "tool_result", "tool_use_id": b.id, "content": json.dumps(r)})
            messages.append({"role": "user", "content": results})
            continue

        text = "".join(b.text for b in resp.content if hasattr(b, "text"))
        messages.append({"role": "assistant", "content": resp.content})

        obj = extract_json(text)
        if obj and is_dag(obj):
            wf_id = uuid.uuid4().hex[:8]
            nodes = [DAGNode(id=n.get("id", uuid.uuid4().hex[:6]), step=n.get("step", ""),
                             server_name=n.get("server_name", ""), tool_name=n.get("tool_name", ""),
                             arguments=n.get("arguments", {}), depends_on=n.get("depends_on", []),
                             output_key=n.get("output_key", "")) for n in obj["nodes"]]
            wf = Workflow(
                id=wf_id,
                name=obj.get("name", "Workflow"),
                description=obj.get("description", ""),
                nodes=nodes,
                browser_use_mode=obj.get("browser_use_mode", "local"),
            )
            workflows[wf_id] = wf
            return wf, messages, chat_msgs

        chat_msgs.append({"role": "assistant", "content": text})
        raise PlanIncomplete(text)

    raise PlanIncomplete("No DAG produced after max turns.")


def _build_workflow(obj: dict) -> Workflow:
    wf_id = uuid.uuid4().hex[:8]
    nodes = [DAGNode(id=n.get("id", uuid.uuid4().hex[:6]), step=n.get("step", ""),
                     server_name=n.get("server_name", ""), tool_name=n.get("tool_name", ""),
                     arguments=n.get("arguments", {}), depends_on=n.get("depends_on", []),
                     output_key=n.get("output_key", "")) for n in obj["nodes"]]
    return Workflow(
        id=wf_id,
        name=obj.get("name", "Workflow"),
        description=obj.get("description", ""),
        nodes=nodes,
        browser_use_mode=obj.get("browser_use_mode", "local"),
    )


async def run_planner_stream(messages: list[dict], max_turns: int = 8):
    """Async generator that yields SSE-ready dicts at each planning step."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    yield {"type": "planning_start", "max_turns": max_turns}

    for turn in range(max_turns):
        yield {"type": "llm_call_start", "turn": turn + 1, "max_turns": max_turns}
        resp = client.messages.create(model="claude-sonnet-4-20250514", max_tokens=4096, system=SYSTEM, tools=[SEARCH_TOOL], messages=messages)

        text = "".join(b.text for b in resp.content if hasattr(b, "text"))
        yield {"type": "llm_call_complete", "turn": turn + 1, "stop_reason": resp.stop_reason,
               "has_tool_calls": resp.stop_reason == "tool_use", "text_preview": text[:200]}

        if resp.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": resp.content})
            results = []
            for b in resp.content:
                if b.type == "tool_use":
                    q = b.input.get("query", "")
                    yield {"type": "tool_search_start", "query": q}
                    t0 = time.time()
                    r = await search_tools(q)
                    elapsed = round(time.time() - t0, 2)
                    tool_names = [t.get("tool_name", "") for t in r]
                    yield {"type": "tool_search_complete", "query": q, "count": len(r),
                           "tool_names": tool_names, "elapsed": elapsed}
                    results.append({"type": "tool_result", "tool_use_id": b.id, "content": json.dumps(r)})
            messages.append({"role": "user", "content": results})
            continue

        messages.append({"role": "assistant", "content": resp.content})

        obj = extract_json(text)
        if obj and is_dag(obj):
            # Extract warnings if present
            warnings = obj.get("warnings", [])
            if warnings:
                yield {"type": "planning_warnings", "warnings": warnings}
            wf = _build_workflow(obj)
            workflows[wf.id] = wf
            yield {"type": "dag_complete", "workflow": wf.model_dump()}
            return

        # Model responded with text — it's explaining something to the user
        if text.strip():
            yield {"type": "planning_message", "text": text}
            return

        yield {"type": "planning_error", "message": "No response from model."}
        return

    yield {"type": "planning_error", "message": "No DAG produced after max turns."}


class PlanStreamReq(BaseModel):
    prompt: str
    session_id: Optional[str] = None

# --- Executor ---

def topo_levels(nodes: list[DAGNode]) -> list[list[DAGNode]]:
    nmap = {n.id: n for n in nodes}
    deg = {n.id: sum(1 for d in n.depends_on if d in nmap) for n in nodes}
    levels, remaining = [], set(deg)
    while remaining:
        lvl = [nid for nid in remaining if deg[nid] == 0]
        if not lvl: raise ValueError("Cycle in DAG")
        levels.append([nmap[nid] for nid in lvl])
        for nid in lvl:
            remaining.discard(nid)
            for n in nodes:
                if nid in n.depends_on and n.id in remaining:
                    deg[n.id] -= 1
    return levels

def resolve(value: Any, outputs: dict) -> Any:
    if isinstance(value, str):
        return re.sub(r"\{\{(\w+)\}\}", lambda m: (json.dumps(outputs[m.group(1)]) if not isinstance(outputs.get(m.group(1)), str) else outputs.get(m.group(1), m.group(0))) if m.group(1) in outputs else m.group(0), value)
    if isinstance(value, dict): return {k: resolve(v, outputs) for k, v in value.items()}
    if isinstance(value, list): return [resolve(v, outputs) for v in value]
    return value


def _credentials_to_map(profile: CredentialProfile) -> dict[str, str]:
    return {
        "username": profile.username,
        "email": profile.email,
        "password": profile.password,
        "api_key": profile.api_key,
        "token": profile.token,
    }


def _apply_saved_credentials(node: DAGNode, args: dict[str, Any]) -> dict[str, Any]:
    candidate_keys = [
        _normalize_app_id(node.server_name),
        _normalize_app_id(node.tool_name),
        _normalize_app_id(f"{node.server_name}:{node.tool_name}"),
    ]
    profile = next((credential_profiles.get(k) for k in candidate_keys if k in credential_profiles), None)
    if not profile:
        return args

    merged = dict(args)
    cred_values = {k: v for k, v in _credentials_to_map(profile).items() if v}
    if not cred_values:
        return merged

    for key, value in cred_values.items():
        existing = merged.get(key)
        if existing is None or (isinstance(existing, str) and not existing.strip()):
            merged[key] = value

    nested = merged.get("credentials")
    if isinstance(nested, dict):
        nested_copy = dict(nested)
        for key, value in cred_values.items():
            existing = nested_copy.get(key)
            if existing is None or (isinstance(existing, str) and not existing.strip()):
                nested_copy[key] = value
        merged["credentials"] = nested_copy

    return merged


async def exec_node(node: DAGNode, outputs: dict, on_credential_request=None) -> dict:
    resolved_args = resolve(node.arguments, outputs)
    args = _apply_saved_credentials(node, resolved_args) if isinstance(resolved_args, dict) else resolved_args
    if node.server_name == "__llm__":
        return await exec_llm(args)
    if node.server_name == "__user_input__":
        return await exec_user_input(node, args, on_credential_request)
    async with httpx.AsyncClient(timeout=120) as c:
        r = await c.post(f"{WISP_URL}/call", json={"server_name": node.server_name, "tool_name": node.tool_name, "arguments": args})
        r.raise_for_status()
        return r.json()


async def exec_user_input(node: DAGNode, args: dict, on_credential_request=None) -> dict:
    """Pause execution and wait for user to provide credentials via the /input endpoint."""
    fields = args.get("fields", [])
    reason = args.get("reason", "Credentials required")
    event = asyncio.Event()
    pending_inputs[node.id] = {"event": event, "data": None}

    # Notify the SSE stream that we need user input
    if on_credential_request:
        await on_credential_request(node.id, fields, reason)

    # Wait for user to submit credentials (timeout after 5 min)
    try:
        await asyncio.wait_for(event.wait(), timeout=300)
    except asyncio.TimeoutError:
        pending_inputs.pop(node.id, None)
        raise ValueError(f"Credential request for node {node.id} timed out (5 min)")

    data = pending_inputs.pop(node.id, {}).get("data", {})
    return data or {}


async def exec_llm(args: dict) -> dict:
    prompt = args.get("prompt", "")
    input_data = args.get("input", "")
    if isinstance(input_data, (dict, list)):
        input_data = json.dumps(input_data, indent=2)
    user_msg = f"{prompt}\n\nInput:\n{input_data}" if input_data else prompt
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    resp = client.messages.create(
        model="claude-sonnet-4-20250514", max_tokens=4096,
        messages=[{"role": "user", "content": user_msg}],
    )
    text = "".join(b.text for b in resp.content if hasattr(b, "text"))
    return {"result": text}

def sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"

ACTION_REQUIRED_KEYWORDS = [
    "captcha",
    "verify you are human",
    "complete login",
    "sign in",
    "log in",
    "2fa",
    "two-factor",
    "multi-factor",
    "approve in browser",
    "open the browser",
    "manual step",
    "manual intervention",
    "action required",
]

ACTION_REQUIRED_HINTS = [
    "Complete the required step in the browser, then re-run this workflow step.",
]

VIEW_URL_KEYS = {
    "live_url",
    "viewer_url",
    "view_url",
    "browser_url",
    "session_url",
    "url",
}


def _flatten_strings(value: Any) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, dict):
        out = []
        for k, v in value.items():
            out.extend(_flatten_strings(k))
            out.extend(_flatten_strings(v))
        return out
    if isinstance(value, list):
        out = []
        for item in value:
            out.extend(_flatten_strings(item))
        return out
    return []


def _extract_view_url(value: Any) -> Optional[str]:
    if isinstance(value, dict):
        for k, v in value.items():
            if isinstance(k, str) and k.lower() in VIEW_URL_KEYS and isinstance(v, str) and v.startswith(("http://", "https://")):
                return v
            nested = _extract_view_url(v)
            if nested:
                return nested
    elif isinstance(value, list):
        for item in value:
            nested = _extract_view_url(item)
            if nested:
                return nested
    return None


def _detect_action_required(value: Any) -> Optional[dict[str, Any]]:
    # Explicit flags from tools are highest confidence.
    if isinstance(value, dict):
        explicit = value.get("requires_user_action") or value.get("requires_human_input") or value.get("action_required")
        if explicit:
            message = value.get("message") or value.get("error") or ACTION_REQUIRED_HINTS[0]
            return {"action_required": True, "action_message": str(message), "action_url": _extract_view_url(value)}

    combined = " ".join(s.lower() for s in _flatten_strings(value))
    if any(keyword in combined for keyword in ACTION_REQUIRED_KEYWORDS):
        for original in _flatten_strings(value):
            lower = original.lower()
            if any(keyword in lower for keyword in ACTION_REQUIRED_KEYWORDS):
                return {"action_required": True, "action_message": original, "action_url": _extract_view_url(value)}
        return {"action_required": True, "action_message": ACTION_REQUIRED_HINTS[0], "action_url": _extract_view_url(value)}

    return None


def _normalize_browser_use_mode(mode: Optional[str]) -> str:
    if (mode or "").lower() == "remote":
        return "remote"
    return "local"


def _browser_use_task_from_args(node: DAGNode, args: Any) -> str:
    if isinstance(args, str) and args.strip():
        return args.strip()
    if isinstance(args, dict):
        task = args.get("task") or args.get("prompt") or args.get("instruction")
        if isinstance(task, str) and task.strip():
            return task.strip()
    return node.step or "Run browser automation task"


def _serialize_step(step: Any, fallback_number: int) -> dict[str, Any]:
    number = getattr(step, "number", None)
    next_goal = getattr(step, "next_goal", None)
    url = getattr(step, "url", None)
    return {
        "number": int(number) if isinstance(number, int) else fallback_number,
        "next_goal": str(next_goal or "").strip(),
        "url": str(url) if url else None,
    }


def _read_obj_field(obj: Any, *names: str) -> Optional[Any]:
    for name in names:
        if hasattr(obj, name):
            value = getattr(obj, name)
            if value is not None:
                return value
        if isinstance(obj, dict) and name in obj and obj.get(name) is not None:
            return obj.get(name)
    return None


def _env_flag(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


async def _build_browser_use_client(mode: str):
    try:
        from browser_use_sdk import AsyncBrowserUse  # type: ignore
    except Exception as e:
        raise RuntimeError(
            "browser_use_sdk is not installed. Install the Browser Use SDK (for example, `pip install browser-use-sdk`) to use __browser_use__ nodes."
        ) from e

    mode = _normalize_browser_use_mode(mode)
    kwargs: dict[str, Any] = {}
    if mode == "remote":
        base_url = os.getenv("BROWSER_USE_REMOTE_BASE_URL", "").strip()
        api_key = os.getenv("BROWSER_USE_REMOTE_API_KEY", "").strip()
        if base_url:
            kwargs["base_url"] = base_url
        if api_key:
            kwargs["api_key"] = api_key
    else:
        base_url = os.getenv("BROWSER_USE_LOCAL_BASE_URL", "").strip()
        if base_url:
            kwargs["base_url"] = base_url

    try:
        client = AsyncBrowserUse(**kwargs)
    except TypeError:
        # Compatibility fallback for SDK versions with different constructor signatures.
        client = AsyncBrowserUse()

    return client


async def _maybe_create_browser_use_session(client: Any) -> dict[str, Optional[str]]:
    sessions_api = getattr(client, "sessions", None)
    if sessions_api is None or not hasattr(sessions_api, "create"):
        return {"session_id": None, "live_url": None, "share_url": None}

    created = sessions_api.create()
    session = await created if asyncio.iscoroutine(created) else created
    session_id = _read_obj_field(session, "id", "session_id")
    live_url = _read_obj_field(session, "live_url", "liveUrl")

    share_url: Optional[str] = None
    create_share = _env_flag("BROWSER_USE_CREATE_SHARE_LINK", default=True)
    if create_share and session_id and hasattr(sessions_api, "create_share"):
        maybe_share = sessions_api.create_share(session_id)
        share = await maybe_share if asyncio.iscoroutine(maybe_share) else maybe_share
        share_url = _read_obj_field(share, "url", "share_url", "shareUrl")

    return {
        "session_id": str(session_id) if session_id is not None else None,
        "live_url": str(live_url) if live_url else None,
        "share_url": str(share_url) if share_url else None,
    }


async def _start_browser_use_run(client: Any, task: str, run_args: dict[str, Any]):
    maybe_run = client.run(task, **run_args)
    return await maybe_run if asyncio.iscoroutine(maybe_run) else maybe_run


async def run_workflow(wf: Workflow):
    outputs, levels = {}, topo_levels(wf.nodes)
    total, done = len(wf.nodes), 0
    # Event queue: all SSE events (node_start, credential_request, node_complete, etc.)
    # are pushed here so the generator can yield them in real-time — critical for
    # __user_input__ nodes that block until the user submits credentials.
    event_queue: asyncio.Queue = asyncio.Queue()
    _LEVEL_DONE = object()  # sentinel

    async def on_credential_request(node_id: str, fields: list, reason: str):
        await event_queue.put(sse({"type": "credential_request", "workflow_id": wf.id,
                                   "node_id": node_id, "data": {"fields": fields, "reason": reason}}))

    yield sse({"type": "workflow_start", "workflow_id": wf.id, "total_nodes": total})
    browser_mode = _normalize_browser_use_mode(wf.browser_use_mode)

    async def run_regular_node(node: DAGNode, level_index: int) -> list[str]:
        nonlocal done
        args = resolve(node.arguments, outputs)
        events = [sse({"type": "node_start", "workflow_id": wf.id, "node_id": node.id,
                       "data": {"step": node.step, "server_name": node.server_name, "tool_name": node.tool_name,
                                "arguments": args, "level": level_index, "progress": done/total},
                       "timestamp": datetime.utcnow().isoformat()})]
        t0 = time.time()
        try:
            result = await exec_node(node, outputs)
            if node.output_key:
                outputs[node.output_key] = result
            done += 1
            action_info = _detect_action_required(result)
            rs = json.dumps(result)
            if len(rs) > 8000:
                result = {"_truncated": True, "preview": rs[:8000]}
            node_data = {"result": result, "elapsed": round(time.time()-t0, 2), "progress": done/total}
            if action_info:
                node_data.update(action_info)
            events.append(sse({"type": "node_complete", "workflow_id": wf.id, "node_id": node.id,
                               "data": node_data, "timestamp": datetime.utcnow().isoformat()}))
            if action_info:
                events.append(sse({
                    "type": "node_action_required",
                    "workflow_id": wf.id,
                    "node_id": node.id,
                    "data": action_info,
                    "timestamp": datetime.utcnow().isoformat(),
                }))
            return events
        except Exception as e:
            done += 1
            error_text = str(e)
            action_info = _detect_action_required(error_text)
            node_data = {"error": error_text, "progress": done/total}
            if action_info:
                node_data.update(action_info)
            events.append(sse({"type": "node_error", "workflow_id": wf.id, "node_id": node.id,
                               "data": node_data, "timestamp": datetime.utcnow().isoformat()}))
            if action_info:
                events.append(sse({
                    "type": "node_action_required",
                    "workflow_id": wf.id,
                    "node_id": node.id,
                    "data": action_info,
                    "timestamp": datetime.utcnow().isoformat(),
                }))
            return events

    async def run_browser_use_node(node: DAGNode, level_index: int):
        nonlocal done
        raw_args = resolve(node.arguments, outputs)
        args = dict(raw_args) if isinstance(raw_args, dict) else {}
        task = _browser_use_task_from_args(node, raw_args)
        t0 = time.time()
        yield sse({"type": "node_start", "workflow_id": wf.id, "node_id": node.id,
                   "data": {"step": node.step, "server_name": node.server_name, "tool_name": node.tool_name,
                            "arguments": raw_args, "level": level_index, "progress": done/total},
                   "timestamp": datetime.utcnow().isoformat()})
        try:
            client = await _build_browser_use_client(browser_mode)
            session_meta = await _maybe_create_browser_use_session(client)
            if any(session_meta.values()):
                yield sse({
                    "type": "node_browser_session",
                    "workflow_id": wf.id,
                    "node_id": node.id,
                    "data": session_meta,
                    "timestamp": datetime.utcnow().isoformat(),
                })

            run_args: dict[str, Any] = {}
            session_id = session_meta.get("session_id")
            if session_id:
                run_args["session_id"] = session_id
            # Allow explicit run-time options in node arguments.
            if isinstance(args.get("run_options"), dict):
                run_args.update(args["run_options"])

            run = await _start_browser_use_run(client, task, run_args)
            step_count = 0
            last_url: Optional[str] = None
            async for step in run:
                step_count += 1
                payload = _serialize_step(step, step_count)
                if payload.get("url"):
                    last_url = payload["url"]
                yield sse({
                    "type": "node_step",
                    "workflow_id": wf.id,
                    "node_id": node.id,
                    "data": payload,
                    "timestamp": datetime.utcnow().isoformat(),
                })
                action_info = _detect_action_required(payload)
                if action_info:
                    yield sse({
                        "type": "node_action_required",
                        "workflow_id": wf.id,
                        "node_id": node.id,
                        "data": action_info,
                        "timestamp": datetime.utcnow().isoformat(),
                    })

            raw_result = getattr(run, "result", None)
            final_output = getattr(raw_result, "output", None)
            result = {
                "mode": browser_mode,
                "task": task,
                "steps": step_count,
                "last_url": last_url,
                "session_id": session_meta.get("session_id"),
                "live_url": session_meta.get("live_url"),
                "share_url": session_meta.get("share_url"),
                "output": final_output,
            }
            if node.output_key:
                outputs[node.output_key] = result
            done += 1
            yield sse({
                "type": "node_complete",
                "workflow_id": wf.id,
                "node_id": node.id,
                "data": {"result": result, "elapsed": round(time.time()-t0, 2), "progress": done/total},
                "timestamp": datetime.utcnow().isoformat(),
            })
        except Exception as e:
            done += 1
            error_text = str(e)
            node_data = {"error": error_text, "progress": done/total}
            action_info = _detect_action_required(error_text)
            if action_info:
                node_data.update(action_info)
            yield sse({
                "type": "node_error",
                "workflow_id": wf.id,
                "node_id": node.id,
                "data": node_data,
                "timestamp": datetime.utcnow().isoformat(),
            })
            if action_info:
                yield sse({
                    "type": "node_action_required",
                    "workflow_id": wf.id,
                    "node_id": node.id,
                    "data": action_info,
                    "timestamp": datetime.utcnow().isoformat(),
                })

    for li, level in enumerate(levels):
        browser_nodes = [n for n in level if n.server_name == "__browser_use__"]
        regular_nodes = [n for n in level if n.server_name != "__browser_use__"]

        remaining = len(regular_nodes)

        async def run(node: DAGNode):
            nonlocal done, remaining
            args = resolve(node.arguments, outputs)
            await event_queue.put(sse({"type": "node_start", "workflow_id": wf.id, "node_id": node.id,
                     "data": {"step": node.step, "server_name": node.server_name, "tool_name": node.tool_name,
                              "arguments": args, "level": li, "progress": done/total},
                     "timestamp": datetime.utcnow().isoformat()}))
            t0 = time.time()
            try:
                result = await exec_node(node, outputs, on_credential_request)
                if node.output_key: outputs[node.output_key] = result
                done += 1
                action_info = _detect_action_required(result)
                rs = json.dumps(result)
                if len(rs) > 8000: result = {"_truncated": True, "preview": rs[:8000]}
                node_data = {"result": result, "elapsed": round(time.time()-t0, 2), "progress": done/total}
                if action_info:
                    node_data.update(action_info)
                await event_queue.put(sse({"type": "node_complete", "workflow_id": wf.id, "node_id": node.id,
                               "data": node_data, "timestamp": datetime.utcnow().isoformat()}))
                if action_info:
                    await event_queue.put(sse({"type": "node_action_required", "workflow_id": wf.id, "node_id": node.id,
                                   "data": action_info, "timestamp": datetime.utcnow().isoformat()}))
            except Exception as e:
                done += 1
                error_text = str(e)
                node_data = {"error": error_text, "progress": done/total}
                action_info = _detect_action_required(error_text)
                if action_info:
                    node_data.update(action_info)
                await event_queue.put(sse({"type": "node_error", "workflow_id": wf.id, "node_id": node.id,
                               "data": node_data, "timestamp": datetime.utcnow().isoformat()}))
                if action_info:
                    await event_queue.put(sse({"type": "node_action_required", "workflow_id": wf.id, "node_id": node.id,
                                   "data": action_info, "timestamp": datetime.utcnow().isoformat()}))
            finally:
                remaining -= 1
                if remaining == 0:
                    await event_queue.put(_LEVEL_DONE)

        # Launch regular nodes as concurrent tasks
        if regular_nodes:
            for node in regular_nodes:
                asyncio.create_task(run(node))
            while True:
                event = await event_queue.get()
                if event is _LEVEL_DONE:
                    break
                yield event

        # Browser-use nodes run sequentially (they stream steps)
        for node in browser_nodes:
            async for event in run_browser_use_node(node, li):
                yield event

    wf.status = "completed"
    yield sse({"type": "workflow_complete", "workflow_id": wf.id, "data": {"outputs": {k: str(v)[:500] for k, v in outputs.items()}}})

def stream_resp(gen):
    return StreamingResponse(gen, media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"})

# --- Endpoints ---

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/plan")
async def plan(req: PlanReq):
    sid = uuid.uuid4().hex[:8]
    msgs = [{"role": "user", "content": req.prompt}]
    try:
        wf, msgs, chat = await run_planner(msgs)
        sessions[sid] = {"messages": msgs, "workflow": wf}
        return {"workflow": wf.model_dump(), "session_id": sid, "chat_messages": chat}
    except PlanIncomplete as e:
        sessions[sid] = {"messages": msgs, "workflow": None}
        return {"workflow": None, "session_id": sid, "chat_messages": [{"role": "assistant", "content": e.message}], "needs_input": True}

@app.post("/chat")
async def chat(req: ChatReq):
    s = sessions.get(req.session_id)
    if not s: raise HTTPException(404, "Session not found")
    s["messages"].append({"role": "user", "content": req.message})
    try:
        wf, msgs, chat = await run_planner(s["messages"])
        sessions[req.session_id] = {"messages": msgs, "workflow": wf}
        return {"workflow": wf.model_dump(), "session_id": req.session_id, "chat_messages": chat}
    except PlanIncomplete as e:
        return {"workflow": None, "session_id": req.session_id, "chat_messages": [{"role": "assistant", "content": e.message}], "needs_input": True}

@app.post("/plan/stream")
async def plan_stream(req: PlanStreamReq):
    sid = req.session_id or uuid.uuid4().hex[:8]
    s = sessions.get(sid)
    if s and req.session_id:
        messages = s["messages"]
        messages.append({"role": "user", "content": req.prompt})
    else:
        messages = [{"role": "user", "content": req.prompt}]

    async def stream():
        yield sse({"type": "session_init", "session_id": sid})
        wf = None
        msgs = messages
        try:
            gen = run_planner_stream(msgs)
            async for event in gen:
                yield sse(event)
                if event.get("type") == "dag_complete":
                    wf_data = event.get("workflow")
                    if wf_data:
                        wf = workflows.get(wf_data["id"])
            # The generator returns (messages, wf) via StopAsyncIteration value,
            # but we already captured the workflow from the dag_complete event.
            sessions[sid] = {"messages": msgs, "workflow": wf}
        except Exception as e:
            yield sse({"type": "planning_error", "message": str(e)})
            sessions[sid] = {"messages": msgs, "workflow": None}

    return stream_resp(stream())


@app.post("/deploy")
async def deploy(req: DeployReq):
    wf = workflows.get(req.workflow_id)
    if not wf: raise HTTPException(404, "Workflow not found")
    if req.browser_use_mode:
        wf.browser_use_mode = _normalize_browser_use_mode(req.browser_use_mode)
    wf.status = "running"
    return stream_resp(run_workflow(wf))

@app.post("/automate")
async def automate(req: PlanReq):
    async def stream():
        msgs = [{"role": "user", "content": req.prompt}]
        yield sse({"type": "planning_start", "data": {"prompt": req.prompt}})
        try:
            wf, _, chat = await run_planner(msgs)
            for m in chat: yield sse({"type": "chat", "data": m})
            yield sse({"type": "planning_complete", "data": wf.model_dump()})
            async for e in run_workflow(wf): yield e
        except PlanIncomplete as e:
            yield sse({"type": "planning_incomplete", "data": {"message": e.message}})
        except Exception as e:
            yield sse({"type": "error", "data": {"message": str(e)}})
    return stream_resp(stream())

@app.post("/webhooks")
async def create_webhook(req: WebhookReq):
    if req.workflow_id not in workflows: raise HTTPException(404, "Workflow not found")
    wid = uuid.uuid4().hex[:8]
    webhooks[wid] = req.workflow_id
    return {"webhook_id": wid, "url": f"/webhooks/{wid}/trigger"}

@app.post("/webhooks/{wid}/trigger")
async def trigger(wid: str):
    wf_id = webhooks.get(wid)
    if not wf_id or wf_id not in workflows: raise HTTPException(404, "Webhook not found")
    return stream_resp(run_workflow(workflows[wf_id]))

class UserInputReq(BaseModel):
    node_id: str
    data: dict[str, Any]

@app.post("/workflow/{wid}/input")
async def submit_user_input(wid: str, req: UserInputReq):
    """Submit credentials/input for a paused __user_input__ node."""
    if wid not in workflows:
        raise HTTPException(404, "Workflow not found")
    entry = pending_inputs.get(req.node_id)
    if not entry:
        raise HTTPException(404, f"No pending input request for node {req.node_id}")
    entry["data"] = req.data
    entry["event"].set()
    return {"status": "ok", "node_id": req.node_id}

@app.get("/workflows")
async def list_wf():
    return {"workflows": [w.model_dump() for w in workflows.values()]}

@app.get("/workflows/{wid}")
async def get_wf(wid: str):
    wf = workflows.get(wid)
    if not wf: raise HTTPException(404, "Not found")
    return wf.model_dump()


@app.get("/credentials/profiles")
async def list_credential_profiles():
    profiles = sorted(credential_profiles.values(), key=lambda p: p.app_id)
    return {"profiles": [p.model_dump() for p in profiles]}


@app.put("/credentials/profiles/{app_id}")
async def upsert_credential_profile(app_id: str, req: CredentialUpsertReq):
    key = _normalize_app_id(app_id)
    if not key:
        raise HTTPException(400, "app_id is required")

    existing = credential_profiles.get(key)
    profile = CredentialProfile(
        app_id=key,
        display_name=req.display_name if req.display_name is not None else (existing.display_name if existing else ""),
        username=req.username if req.username is not None else (existing.username if existing else ""),
        email=req.email if req.email is not None else (existing.email if existing else ""),
        password=req.password if req.password is not None else (existing.password if existing else ""),
        api_key=req.api_key if req.api_key is not None else (existing.api_key if existing else ""),
        token=req.token if req.token is not None else (existing.token if existing else ""),
        notes=req.notes if req.notes is not None else (existing.notes if existing else ""),
        updated_at=datetime.utcnow().isoformat(),
    )
    credential_profiles[key] = profile
    save_credential_profiles()
    return profile.model_dump()


@app.delete("/credentials/profiles/{app_id}")
async def delete_credential_profile(app_id: str):
    key = _normalize_app_id(app_id)
    if key not in credential_profiles:
        raise HTTPException(404, "Credential profile not found")
    del credential_profiles[key]
    save_credential_profiles()
    return {"deleted": True, "app_id": key}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
