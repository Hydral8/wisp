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
from google import genai
from google.genai import types as gtypes
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
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
BROWSER_USE_API_KEY = os.getenv("BROWSER_USE_API_KEY", "")
BROWSER_USE_API = "https://api.browser-use.com/api/v3"

app = FastAPI(title="Wisp Instant", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# --- Models ---

class DAGNode(BaseModel):
    id: str; step: str; server_name: str; tool_name: str
    arguments: dict[str, Any] = {}; depends_on: list[str] = []; output_key: str = ""

class Workflow(BaseModel):
    id: str; name: str; description: str; nodes: list[DAGNode]
    objective: str = ""
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

SYSTEM = """You are an agent for Wisp, a tool gateway with 2000+ MCP tools.
Your job is to iteratively find tools, EXECUTE them live, verify they work, and keep going until the user's task is fully complete. Do NOT just plan — actually do the work.

WORKFLOW:
1. Search for tools using search_tools
2. List server tools with list_server_tools to discover related tools
3. EXECUTE tools with execute_tool to test them and do real work
4. Check results, adjust arguments, retry if needed
5. Keep iterating until the task is FULLY DONE
6. When finished, respond with a summary of what was accomplished

TOOL SEARCH RULES:
- Search for each distinct capability exactly once. Do not rephrase and retry the same search.
- Use list_server_tools after finding a promising tool to discover sibling tools on the same server.

EXECUTE_TOOL:
- Use execute_tool to run MCP tools (non-browser). Do NOT use execute_tool for browser tasks.

BROWSER TASKS — USE browser_use_run DIRECTLY:
- For ANY task requiring a web browser, use the browser_use_run tool directly. Do NOT search for browser_use MCP servers or use execute_tool for browser work.
- browser_use_run launches a cloud browser session. It returns a session_id and liveUrl.
- After calling browser_use_run, call browser_use_status with the session_id. It will automatically poll until the task completes — call it only ONCE.
- NEVER call browser_use_run more than once. You get exactly ONE browser_use_run call. Put ALL browser work into a single detailed prompt.
- NEVER call browser_use_run and browser_use_status in the same tool call batch (parallel). Call browser_use_run FIRST, wait for the result, THEN call browser_use_status in the NEXT turn.
- To reuse an existing session for a follow-up task, pass the session_id from a previous run.
- You MUST rewrite and optimize the user's request into a detailed, step-by-step browser instruction prompt. NEVER pass the user's raw message as the task. Your optimized prompt must include:
  * The exact URL to navigate to first
  * Each UI action in sequence: what to click, what to type, what to select
  * What the page should look like after each step (expected states)
  * Explicit success criteria — how to know the task is done
  * Error recovery: what to do if an element is missing or a page doesn't load
  * Example: Instead of "Create a UML diagram on draw.io", write: "1. Navigate to https://app.diagrams.net 2. Click 'Create New Diagram' 3. Select 'Blank Diagram' 4. Use the UML shape library: drag a Class shape onto the canvas 5. Double-click the class shape and set the name to 'User' 6. Add attributes: id: int, name: string, email: string ..."
- The quality of the browser_use_run prompt directly determines success. Spend effort making it thorough and unambiguous.

DO NOT output a JSON DAG. Just work through the task step by step using the tools available.
When you're done, summarize what was accomplished and whether it succeeded."""

SEARCH_TOOL = {"name": "search_tools", "description": "Search Wisp for MCP tools matching a query.", "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}}
LIST_SERVER_TOOLS = {"name": "list_server_tools", "description": "List ALL tools available on a specific MCP server. Use after search_tools to discover sibling tools on the same server.", "input_schema": {"type": "object", "properties": {"server_name": {"type": "string", "description": "The server name (e.g. 'com.browser-use/mcp')"}}, "required": ["server_name"]}}
SEARCH_SERVERS = {"name": "search_servers", "description": "Search for MCP servers by name or description. Returns server names, descriptions, and tool counts. Use when you want to find which server provides a capability before listing its tools.", "input_schema": {"type": "object", "properties": {"query": {"type": "string", "description": "Search query (e.g. 'github', 'slack', 'browser')"}}, "required": ["query"]}}
EXECUTE_TOOL = {"name": "execute_tool", "description": "Execute an MCP tool and get its result. Use this to actually run tools, test them, and do real work. Returns the tool's output. Do NOT use this for browser tasks — use browser_use_run instead.", "input_schema": {"type": "object", "properties": {"server_name": {"type": "string", "description": "The MCP server name"}, "tool_name": {"type": "string", "description": "The tool to execute"}, "arguments": {"type": "object", "description": "Arguments to pass to the tool"}}, "required": ["server_name", "tool_name"]}}
BROWSER_USE_RUN_TOOL = {"name": "browser_use_run", "description": "Launch a browser automation task. Returns session_id and live_url immediately. Then call browser_use_status with the session_id to poll for completion. Do NOT call this twice for the same task.", "input_schema": {"type": "object", "properties": {"task": {"type": "string", "description": "Detailed step-by-step browser instructions. Must include exact URLs, UI actions, expected states, and success criteria."}, "session_id": {"type": "string", "description": "Optional: reuse an existing idle session instead of creating a new one"}}, "required": ["task"]}}
BROWSER_USE_STATUS_TOOL = {"name": "browser_use_status", "description": "Get the status of a browser_use session. Automatically polls until the task is done — only call ONCE per session. Returns status, output, liveUrl, and cost info.", "input_schema": {"type": "object", "properties": {"session_id": {"type": "string", "description": "The session ID from browser_use_run"}}, "required": ["session_id"]}}
BROWSER_USE_STOP_TOOL = {"name": "browser_use_stop", "description": "Stop a running browser_use session. Use when you want to terminate early.", "input_schema": {"type": "object", "properties": {"session_id": {"type": "string", "description": "The session ID to stop"}}, "required": ["session_id"]}}
AGENT_TOOLS = [SEARCH_TOOL, LIST_SERVER_TOOLS, SEARCH_SERVERS, EXECUTE_TOOL, BROWSER_USE_RUN_TOOL, BROWSER_USE_STATUS_TOOL, BROWSER_USE_STOP_TOOL]

# Gemini-format tool declarations for the agentic planner
def _anthropic_schema_to_gemini(schema: dict) -> dict:
    """Convert Anthropic-style JSON schema to Gemini-compatible schema dict."""
    out: dict[str, Any] = {}
    t = schema.get("type", "STRING")
    out["type"] = t.upper()
    if "description" in schema:
        out["description"] = schema["description"]
    if t == "object":
        props = schema.get("properties", {})
        if props:
            out["properties"] = {k: _anthropic_schema_to_gemini(v) for k, v in props.items()}
        req = schema.get("required")
        if req:
            out["required"] = req
    if t == "array" and "items" in schema:
        out["items"] = _anthropic_schema_to_gemini(schema["items"])
    return out

GEMINI_TOOLS = [gtypes.Tool(function_declarations=[
    gtypes.FunctionDeclaration(
        name=t["name"],
        description=t["description"],
        parameters=_anthropic_schema_to_gemini(t["input_schema"]),
    ) for t in AGENT_TOOLS
])]

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

async def list_server_tools(server_name: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.get(f"{WISP_URL}/servers/{server_name}/tools")
        r.raise_for_status()
        data = r.json()
        tools = data.get("tools", [])
        return [{"server_name": server_name,
                 "tool_name": t.get("tool_name", t.get("name", "")),
                 "description": t.get("description", ""),
                 "input_schema": t.get("input_schema", {})} for t in tools]

async def search_servers(query: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.get(f"{WISP_URL}/servers/search", params={"query": query, "limit": 10})
        r.raise_for_status()
        data = r.json()
        return data.get("servers", [])

MONITOR_POLL_WAIT = 10  # seconds between monitor_task polls (agent-side)
MONITOR_MAX_AGENT_POLLS = 120  # max polls (~20 min)

# Dedup: track launched browser_task by task prompt to prevent re-launching the same task
_browser_task_cache: dict[str, dict] = {}  # key: task prompt hash -> result

_BU_HEADERS = {"X-Browser-Use-API-Key": BROWSER_USE_API_KEY, "Content-Type": "application/json"}

async def browser_use_run(task: str, session_id: str | None = None) -> dict:
    """Launch a browser-use session via the v3 API. Returns immediately with session info."""
    # Dedup
    if task in _browser_task_cache:
        print(f"[browser_use] Dedup hit for task: {task[:80]}...")
        return _browser_task_cache[task]
    payload: dict[str, Any] = {"task": task, "model": "bu-mini"}
    if session_id:
        payload["sessionId"] = session_id
    async with httpx.AsyncClient(timeout=60) as c:
        r = await c.post(f"{BROWSER_USE_API}/sessions", json=payload, headers=_BU_HEADERS)
        r.raise_for_status()
        result = r.json()
    sid = result.get("id", "")
    # Poll briefly for liveUrl (browser-use needs time to provision the sandbox)
    if sid and not result.get("liveUrl"):
        for attempt in range(5):
            await asyncio.sleep(3)
            try:
                async with httpx.AsyncClient(timeout=15) as c:
                    r2 = await c.get(f"{BROWSER_USE_API}/sessions/{sid}", headers=_BU_HEADERS)
                    r2.raise_for_status()
                    details = r2.json()
                    if details.get("liveUrl"):
                        result["liveUrl"] = details["liveUrl"]
                        result["live_url"] = details["liveUrl"]
                        print(f"[browser_use] liveUrl obtained on attempt {attempt+1}: {details['liveUrl']}")
                        break
            except Exception:
                pass
    if result.get("liveUrl"):
        result["live_url"] = result["liveUrl"]
    _browser_task_cache[task] = result
    print(f"[browser_use] Session created: id={sid}, liveUrl={result.get('liveUrl')}")
    return result

async def browser_use_status(session_id: str) -> dict:
    """Poll a browser-use session until it finishes. Returns final status."""
    poll = 0
    last_live_url = None
    while poll < MONITOR_MAX_AGENT_POLLS:
        async with httpx.AsyncClient(timeout=15) as c:
            r = await c.get(f"{BROWSER_USE_API}/sessions/{session_id}", headers=_BU_HEADERS)
            r.raise_for_status()
            result = r.json()
        status = result.get("status", "")
        live_url = result.get("liveUrl")
        if live_url and not last_live_url:
            last_live_url = live_url
            print(f"[browser_use] liveUrl available: {live_url}")
        print(f"[browser_use] Status poll {poll}: status={status}, output={str(result.get('output', ''))[:80]}")
        if status in ("stopped", "error", "timed_out", "idle"):
            if result.get("liveUrl"):
                result["live_url"] = result["liveUrl"]
            return result
        poll += 1
        await asyncio.sleep(MONITOR_POLL_WAIT)
    if result.get("liveUrl"):
        result["live_url"] = result["liveUrl"]
    return result

async def browser_use_stop(session_id: str) -> dict:
    """Stop a browser-use session."""
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(f"{BROWSER_USE_API}/sessions/{session_id}/stop", headers=_BU_HEADERS)
        r.raise_for_status()
        return r.json()

async def _call_router(server_name: str, tool_name: str, arguments: dict, timeout: float = 120) -> dict:
    """Single call to the MCP router, returns normalized result."""
    async with httpx.AsyncClient(timeout=timeout) as c:
        r = await c.post(f"{WISP_URL}/call", json={"server_name": server_name, "tool_name": tool_name, "arguments": arguments})
        r.raise_for_status()
        return _normalize_mcp_result(r.json())

async def execute_tool_call(server_name: str, tool_name: str, arguments: dict) -> dict:
    """Execute an MCP tool via the router and return the normalized result."""
    # Enforce browser_task defaults so the agent never under-provisions
    if tool_name == "browser_task":
        arguments["model"] = "bu-mini"
        if not arguments.get("max_steps") or int(arguments.get("max_steps", 0)) < 200:
            arguments["max_steps"] = 200
        # Dedup: don't launch the same browser_task twice
        task_key = arguments.get("task", "")
        if task_key and task_key in _browser_task_cache:
            print(f"[browser_task] Dedup hit — returning cached result for task: {task_key[:80]}...")
            return _browser_task_cache[task_key]
    is_long_running = tool_name in ("monitor_task", "browser_task")
    timeout = 600 if is_long_running else 120
    result = await _call_router(server_name, tool_name, arguments, timeout)
    # Cache browser_task result for dedup
    if tool_name == "browser_task" and isinstance(result, dict):
        task_key = arguments.get("task", "")
        if task_key:
            _browser_task_cache[task_key] = result

    # Auto-poll monitor_task: the LLM doesn't need to waste turns polling.
    # We block here until is_success is not null, then return the final result.
    if tool_name == "monitor_task" and isinstance(result, dict):
        poll = 0
        while result.get("is_success") is None and poll < MONITOR_MAX_AGENT_POLLS:
            poll += 1
            status = result.get("status", "?")
            steps = result.get("total_steps", "?")
            print(f"[monitor-auto] Poll {poll}: status={status}, steps={steps}, is_success=None — waiting {MONITOR_POLL_WAIT}s...")
            await asyncio.sleep(MONITOR_POLL_WAIT)
            try:
                result = await _call_router(server_name, tool_name, arguments, timeout)
            except Exception as e:
                print(f"[monitor-auto] Poll {poll} error: {e}")
                continue
        print(f"[monitor-auto] Done after {poll} polls. is_success={result.get('is_success')}")

    return result

async def run_planner(messages: list[dict], max_turns: int = 8) -> tuple[Optional[Workflow], list[dict], list[dict]]:
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    chat_msgs: list[dict] = []

    for _ in range(max_turns):
        resp = client.messages.create(model="claude-sonnet-4-20250514", max_tokens=4096, system=SYSTEM, tools=PLANNER_TOOLS, messages=messages)

        if resp.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": resp.content})
            results = []
            # Deduplicate: cache by (tool_name, args_key) so identical calls reuse results
            _call_cache: dict[str, str] = {}
            for b in resp.content:
                if b.type == "tool_use":
                    cache_key = f"{b.name}:{json.dumps(b.input, sort_keys=True)}"
                    if cache_key in _call_cache:
                        results.append({"type": "tool_result", "tool_use_id": b.id, "content": _call_cache[cache_key]})
                        continue
                    if b.name == "list_server_tools":
                        sn = b.input.get("server_name", "")
                        chat_msgs.append({"role": "system", "content": f"Listing tools on: {sn}"})
                        r = await list_server_tools(sn)
                    elif b.name == "search_servers":
                        q = b.input.get("query", "")
                        chat_msgs.append({"role": "system", "content": f"Searching servers: {q}"})
                        r = await search_servers(q)
                    else:
                        q = b.input.get("query", "")
                        chat_msgs.append({"role": "system", "content": f"Searching: {q}"})
                        r = await search_tools(q)
                    content = json.dumps(r)
                    _call_cache[cache_key] = content
                    results.append({"type": "tool_result", "tool_use_id": b.id, "content": content})
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
        objective=obj.get("objective", ""),
        nodes=nodes,
        browser_use_mode=obj.get("browser_use_mode", "local"),
    )


async def run_planner_stream(messages: list[dict], max_turns: int = 30):
    """Agentic loop using Gemini Flash: search, execute tools, iterate until done."""
    print(f"[planner] Starting agentic loop (Gemini Flash), max_turns={max_turns}")
    gclient = genai.Client(api_key=GEMINI_KEY)
    yield {"type": "planning_start", "max_turns": max_turns}
    _call_cache: dict[str, str] = {}
    executed_steps: list[dict] = []

    # Convert initial messages to Gemini contents format
    contents: list[gtypes.Content] = []
    for m in messages:
        role = "model" if m["role"] == "assistant" else "user"
        text = m["content"] if isinstance(m["content"], str) else json.dumps(m["content"])
        contents.append(gtypes.Content(role=role, parts=[gtypes.Part.from_text(text=text)]))

    for turn in range(max_turns):
        print(f"[planner] Turn {turn+1}/{max_turns} — calling Gemini Flash...")
        yield {"type": "llm_call_start", "turn": turn + 1, "max_turns": max_turns}
        resp = gclient.models.generate_content(
            model="gemini-3-flash-preview",
            contents=contents,
            config=gtypes.GenerateContentConfig(
                system_instruction=SYSTEM,
                tools=GEMINI_TOOLS,
                temperature=0.2,
            ),
        )

        candidate = resp.candidates[0] if resp.candidates else None
        if not candidate or not candidate.content or not candidate.content.parts:
            print(f"[planner] No response from model on turn {turn+1}")
            yield {"type": "planning_error", "message": "No response from model."}
            return

        parts = candidate.content.parts
        text = "".join(p.text for p in parts if p.text)
        fn_calls = [p for p in parts if p.function_call]
        has_tool_calls = len(fn_calls) > 0
        finish = candidate.finish_reason if hasattr(candidate, "finish_reason") else "STOP"
        print(f"[planner] Turn {turn+1}: finish={finish}, text_len={len(text)}, tool_calls={len(fn_calls)}")
        yield {"type": "llm_call_complete", "turn": turn + 1, "stop_reason": str(finish),
               "has_tool_calls": has_tool_calls, "text_preview": text[:200]}

        if text.strip():
            yield {"type": "planning_thinking", "text": text}

        if has_tool_calls:
            # Add model response to conversation
            contents.append(candidate.content)
            fn_response_parts: list[gtypes.Part] = []

            for fc in fn_calls:
                name = fc.function_call.name
                inp = dict(fc.function_call.args) if fc.function_call.args else {}
                cache_key = f"{name}:{json.dumps(inp, sort_keys=True)}"
                if cache_key in _call_cache:
                    fn_response_parts.append(gtypes.Part.from_function_response(
                        name=name, response={"result": _call_cache[cache_key]}))
                    continue

                t0 = time.time()
                if name == "execute_tool":
                    sn = inp.get("server_name", "")
                    tn = inp.get("tool_name", "")
                    args = inp.get("arguments") or {}
                    if isinstance(args, str):
                        try: args = json.loads(args)
                        except: args = {}
                    yield {"type": "tool_exec_start", "server_name": sn, "tool_name": tn, "arguments": args}
                    try:
                        r = await execute_tool_call(sn, tn, args)
                        elapsed = round(time.time() - t0, 2)
                        executed_steps.append({"server_name": sn, "tool_name": tn, "arguments": args, "result": r, "elapsed": elapsed})
                        yield {"type": "tool_exec_complete", "server_name": sn, "tool_name": tn,
                               "result": r, "elapsed": elapsed, "success": True}
                    except Exception as e:
                        elapsed = round(time.time() - t0, 2)
                        r = {"error": str(e)}
                        yield {"type": "tool_exec_complete", "server_name": sn, "tool_name": tn,
                               "result": r, "elapsed": elapsed, "success": False}
                elif name == "browser_use_run":
                    task_str = inp.get("task", "")
                    sid = inp.get("session_id") or None
                    yield {"type": "tool_exec_start", "server_name": "browser-use", "tool_name": "run", "arguments": {"task": task_str[:120]}}
                    try:
                        r = await browser_use_run(task_str, sid)
                        elapsed = round(time.time() - t0, 2)
                        executed_steps.append({"server_name": "browser-use", "tool_name": "browser_use_run", "arguments": {"task": task_str}, "result": r, "elapsed": elapsed})
                        yield {"type": "tool_exec_complete", "server_name": "browser-use", "tool_name": "run",
                               "result": r, "elapsed": elapsed, "success": True}
                    except Exception as e:
                        elapsed = round(time.time() - t0, 2)
                        r = {"error": str(e)}
                        yield {"type": "tool_exec_complete", "server_name": "browser-use", "tool_name": "run",
                               "result": r, "elapsed": elapsed, "success": False}
                elif name == "browser_use_status":
                    sid = inp.get("session_id", "")
                    yield {"type": "tool_exec_start", "server_name": "browser-use", "tool_name": "status", "arguments": {"session_id": sid}}
                    try:
                        r = await browser_use_status(sid)
                        elapsed = round(time.time() - t0, 2)
                        yield {"type": "tool_exec_complete", "server_name": "browser-use", "tool_name": "status",
                               "result": r, "elapsed": elapsed, "success": True}
                    except Exception as e:
                        elapsed = round(time.time() - t0, 2)
                        r = {"error": str(e)}
                        yield {"type": "tool_exec_complete", "server_name": "browser-use", "tool_name": "status",
                               "result": r, "elapsed": elapsed, "success": False}
                elif name == "browser_use_stop":
                    sid = inp.get("session_id", "")
                    yield {"type": "tool_exec_start", "server_name": "browser-use", "tool_name": "stop", "arguments": {"session_id": sid}}
                    try:
                        r = await browser_use_stop(sid)
                        elapsed = round(time.time() - t0, 2)
                        yield {"type": "tool_exec_complete", "server_name": "browser-use", "tool_name": "stop",
                               "result": r, "elapsed": elapsed, "success": True}
                    except Exception as e:
                        elapsed = round(time.time() - t0, 2)
                        r = {"error": str(e)}
                        yield {"type": "tool_exec_complete", "server_name": "browser-use", "tool_name": "stop",
                               "result": r, "elapsed": elapsed, "success": False}
                elif name == "list_server_tools":
                    sn = inp.get("server_name", "")
                    yield {"type": "tool_search_start", "query": f"[list] {sn}"}
                    r = await list_server_tools(sn)
                    elapsed = round(time.time() - t0, 2)
                    tool_names = [t.get("tool_name", "") for t in r]
                    yield {"type": "tool_search_complete", "query": f"[list] {sn}", "count": len(r),
                           "tool_names": tool_names, "elapsed": elapsed}
                elif name == "search_servers":
                    q = inp.get("query", "")
                    yield {"type": "tool_search_start", "query": f"[servers] {q}"}
                    r = await search_servers(q)
                    elapsed = round(time.time() - t0, 2)
                    server_names = [s.get("name", "") for s in r]
                    yield {"type": "tool_search_complete", "query": f"[servers] {q}", "count": len(r),
                           "tool_names": server_names, "elapsed": elapsed}
                else:  # search_tools
                    q = inp.get("query", "")
                    yield {"type": "tool_search_start", "query": q}
                    r = await search_tools(q)
                    elapsed = round(time.time() - t0, 2)
                    tool_names = [t.get("tool_name", "") for t in r]
                    yield {"type": "tool_search_complete", "query": q, "count": len(r),
                           "tool_names": tool_names, "elapsed": elapsed}
                content_str = json.dumps(r)
                _call_cache[cache_key] = content_str
                fn_response_parts.append(gtypes.Part.from_function_response(
                    name=name, response={"result": content_str}))

            contents.append(gtypes.Content(role="user", parts=fn_response_parts))
            continue

        # No tool calls — agent is done
        contents.append(candidate.content)
        if text.strip():
            print(f"[planner] Agent done (turn {turn+1}). Steps executed: {len(executed_steps)}. Text: {text[:100]}...")
            yield {"type": "agent_done", "text": text, "executed_steps": executed_steps}
            return

        print(f"[planner] No text response from model on turn {turn+1}")
        yield {"type": "planning_error", "message": "No response from model."}
        return

    print(f"[planner] Reached max iterations ({max_turns})")
    yield {"type": "agent_done", "text": "Reached max iterations.", "executed_steps": executed_steps}


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
    def _resolve_ref(m):
        path = m.group(1)
        parts = path.split(".")
        root = parts[0]
        if root not in outputs:
            return m.group(0)
        obj = outputs[root]
        for part in parts[1:]:
            if isinstance(obj, dict):
                obj = obj.get(part)
            else:
                return m.group(0)
        if isinstance(obj, str):
            return obj
        return json.dumps(obj)
    if isinstance(value, str):
        return re.sub(r"\{\{([\w.]+)\}\}", _resolve_ref, value)
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


def _normalize_mcp_result(result: Any) -> Any:
    """Extract the useful payload from an MCP tool response.

    MCP responses wrap the actual data inside content[0].text as a JSON string.
    This unwraps it so outputs store the parsed payload directly, making
    dot-notation references like {{r1.task_id}} work in resolve().
    """
    if not isinstance(result, dict):
        return result
    content = result.get("content")
    if isinstance(content, list) and len(content) > 0:
        item = content[0]
        if isinstance(item, dict) and item.get("type") == "text":
            text = item.get("text", "")
            try:
                return json.loads(text)
            except (json.JSONDecodeError, TypeError):
                return text
    return result


async def exec_node(node: DAGNode, outputs: dict, on_credential_request=None) -> dict:
    resolved_args = resolve(node.arguments, outputs)
    args = _apply_saved_credentials(node, resolved_args) if isinstance(resolved_args, dict) else resolved_args
    if node.server_name == "__llm__":
        return await exec_llm(args)
    if node.server_name == "__user_input__":
        return await exec_user_input(node, args, on_credential_request)
    # browser-use monitor_task blocks until the agent run completes — needs a long timeout
    is_long_running = node.tool_name in ("monitor_task", "browser_task")
    timeout = 600 if is_long_running else 120
    async with httpx.AsyncClient(timeout=timeout) as c:
        r = await c.post(f"{WISP_URL}/call", json={"server_name": node.server_name, "tool_name": node.tool_name, "arguments": args})
        r.raise_for_status()
        return _normalize_mcp_result(r.json())


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
    gclient = genai.Client(api_key=GEMINI_KEY)
    resp = gclient.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[gtypes.Content(role="user", parts=[gtypes.Part.from_text(text=user_msg)])],
    )
    text = resp.text or ""
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


def _extract_history_result(history: Any) -> dict[str, Any]:
    """Extract structured results from an AgentHistoryList returned by agent.run()."""
    out: dict[str, Any] = {}
    for method, key in [
        ("final_result", "final_result"),
        ("extracted_content", "extracted_content"),
        ("urls", "urls"),
        ("errors", "errors"),
        ("is_done", "is_done"),
        ("is_successful", "is_successful"),
    ]:
        fn = getattr(history, method, None)
        if callable(fn):
            try:
                out[key] = fn()
            except Exception:
                pass
    # Fallback: legacy attribute access
    if "final_result" not in out:
        raw = getattr(history, "result", None)
        out["final_result"] = getattr(raw, "output", None) if raw else None
    return out


# --- Monitor polling ---

MONITOR_POLL_INTERVAL = 3   # seconds between polls
MONITOR_MAX_POLLS = 200     # 3s * 200 = 10 min max


def _is_monitor_node(node: DAGNode) -> bool:
    return node.tool_name in ("monitor_task", "monitor")


def _monitor_is_done(result: Any) -> bool:
    """Return True when monitor_task shows the browser agent has finished."""
    if not isinstance(result, dict):
        return False
    # is_success flips from null → true/false when the agent finishes
    if result.get("is_success") is not None:
        return True
    # task_output present means it's done
    if result.get("task_output") is not None:
        return True
    # status field from some response formats
    status = (result.get("status") or "").lower()
    if status in ("completed", "failed", "error", "stopped", "cancelled", "done", "finished"):
        return True
    return False


def _monitor_step_summary(result: Any, poll_count: int) -> dict:
    """Build a node_step payload the frontend understands from a monitor_task response."""
    if not isinstance(result, dict):
        return {"number": poll_count, "next_goal": "Polling browser agent...", "url": None}
    total_steps = result.get("total_steps", 0)
    steps = result.get("steps") or []
    last_step = steps[-1] if steps else None
    # Build a human-readable goal from the latest step
    if isinstance(last_step, dict):
        goal = last_step.get("step_description") or last_step.get("next_goal") or last_step.get("action") or f"Step {total_steps} in progress"
        url = last_step.get("url")
    else:
        goal = f"Waiting for browser agent... ({total_steps} steps so far)"
        url = result.get("live_url")
    return {"number": poll_count, "next_goal": goal, "url": url}


async def run_workflow(wf: Workflow):
    print(f"[workflow] Starting workflow {wf.id} with {len(wf.nodes)} nodes")
    for n in wf.nodes:
        print(f"[workflow]   node={n.id} server={n.server_name} tool={n.tool_name} depends={n.depends_on}")
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

            history = _extract_history_result(run)
            result = {
                "mode": browser_mode,
                "task": task,
                "steps": step_count,
                "last_url": last_url,
                "session_id": session_meta.get("session_id"),
                "live_url": session_meta.get("live_url"),
                "share_url": session_meta.get("share_url"),
                "output": history.get("final_result"),
                "extracted_content": history.get("extracted_content"),
                "urls": history.get("urls"),
                "is_done": history.get("is_done"),
                "is_successful": history.get("is_successful"),
                "errors": history.get("errors"),
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

                # --- Monitor polling: keep checking until the browser agent finishes ---
                is_mon = _is_monitor_node(node)
                is_done = _monitor_is_done(result)
                print(f"[run] node={node.id} tool={node.tool_name} is_monitor={is_mon} is_done={is_done} result_type={type(result).__name__}")
                if isinstance(result, dict):
                    print(f"[run]   is_success={result.get('is_success')!r} task_output={result.get('task_output')!r} status={result.get('status')!r} keys={list(result.keys())}")
                if is_mon and not is_done:
                    print(f"[monitor] Starting poll loop for node {node.id}, task_id={result.get('task_id') if isinstance(result, dict) else '?'}")
                    poll_count = 0
                    consecutive_errors = 0
                    while poll_count < MONITOR_MAX_POLLS:
                        poll_count += 1
                        step_data = _monitor_step_summary(result, poll_count)
                        await event_queue.put(sse({
                            "type": "node_step",
                            "workflow_id": wf.id,
                            "node_id": node.id,
                            "data": step_data,
                            "timestamp": datetime.utcnow().isoformat(),
                        }))
                        await asyncio.sleep(MONITOR_POLL_INTERVAL)
                        try:
                            result = await exec_node(node, outputs, on_credential_request)
                            consecutive_errors = 0
                            mon_total = result.get("total_steps", "?") if isinstance(result, dict) else "?"
                            done_flag = result.get("is_success") if isinstance(result, dict) else None
                            print(f"[monitor] Poll {poll_count}: steps={mon_total}, is_success={done_flag}")
                        except Exception as poll_err:
                            consecutive_errors += 1
                            print(f"[monitor] Poll {poll_count} error ({consecutive_errors}): {poll_err}")
                            if consecutive_errors >= 5:
                                print(f"[monitor] Too many consecutive errors, stopping poll")
                                break
                            continue
                        if _monitor_is_done(result):
                            print(f"[monitor] Task complete after {poll_count} polls")
                            break

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
        print(f"[workflow] Level {li}: {len(regular_nodes)} regular, {len(browser_nodes)} browser")
        for n in regular_nodes:
            print(f"[workflow]   regular: {n.id} / {n.tool_name}")
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
    print(f"[plan/stream] Received request: prompt={req.prompt[:80]}... session_id={req.session_id}")
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
            print(f"[plan/stream] Starting run_planner_stream for session {sid}")
            gen = run_planner_stream(msgs)
            event_count = 0
            async for event in gen:
                event_count += 1
                etype = event.get("type", "?")
                print(f"[plan/stream] Event #{event_count}: type={etype}")
                yield sse(event)
                if etype == "dag_complete":
                    wf_data = event.get("workflow")
                    if wf_data:
                        wf = workflows.get(wf_data["id"])
            print(f"[plan/stream] Stream ended after {event_count} events")
            sessions[sid] = {"messages": msgs, "workflow": wf}
        except Exception as e:
            print(f"[plan/stream] ERROR: {e}")
            import traceback; traceback.print_exc()
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

class ConvertReq(BaseModel):
    name: str = "Workflow"
    description: str = ""
    objective: str = ""
    executed_steps: list[dict[str, Any]]

@app.post("/convert-to-workflow")
async def convert_to_workflow(req: ConvertReq):
    """Convert executed agent steps into a reusable DAG workflow."""
    nodes: list[DAGNode] = []
    prev_id: str | None = None
    for i, step in enumerate(req.executed_steps):
        node_id = f"n{i+1}"
        output_key = f"r{i+1}"
        nodes.append(DAGNode(
            id=node_id,
            step=f"Step {i+1}: {step.get('tool_name', '')}",
            server_name=step.get("server_name", ""),
            tool_name=step.get("tool_name", ""),
            arguments=step.get("arguments", {}),
            depends_on=[prev_id] if prev_id else [],
            output_key=output_key,
        ))
        prev_id = node_id
    wf_id = uuid.uuid4().hex[:8]
    wf = Workflow(
        id=wf_id,
        name=req.name or "Workflow",
        description=req.description,
        objective=req.objective,
        nodes=nodes,
    )
    workflows[wf_id] = wf
    return wf.model_dump()


if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("[STARTUP] Wisp main server v2 (agentic mode)")
    print(f"[STARTUP] AGENT_TOOLS: {[t['name'] for t in AGENT_TOOLS]}")
    print(f"[STARTUP] SYSTEM prompt starts with: {SYSTEM[:80]}...")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8001)
