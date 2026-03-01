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

class PlanReq(BaseModel):
    prompt: str

class ChatReq(BaseModel):
    session_id: str; message: str

class DeployReq(BaseModel):
    workflow_id: str

class WebhookReq(BaseModel):
    workflow_id: str

# --- State ---

workflows: dict[str, Workflow] = {}
webhooks: dict[str, str] = {}
sessions: dict[str, dict] = {}

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
- depends_on controls ordering. {{output_key}} references previous results.
- If you CANNOT fulfill part or all of the request, respond in plain text (no JSON) explaining specifically why:
  * "No suitable tool found for X" if search returned nothing relevant
  * "Tool X requires authentication against Y" if the tool needs credentials the user hasn't provided
  * "This task requires capabilities not available in the current tool set" for unsupported operations
  * Suggest alternatives or workarounds when possible
- If only some steps are blocked, build a partial DAG for what IS possible and explain what was skipped and why in a "warnings" field: {"name":"...","description":"...","warnings":["..."],"nodes":[...]}
- When everything is feasible, output ONLY the JSON DAG, no prose."""

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
            wf = Workflow(id=wf_id, name=obj.get("name", "Workflow"), description=obj.get("description", ""), nodes=nodes)
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
    return Workflow(id=wf_id, name=obj.get("name", "Workflow"), description=obj.get("description", ""), nodes=nodes)


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

async def exec_node(node: DAGNode, outputs: dict) -> dict:
    args = resolve(node.arguments, outputs)
    if node.server_name == "__llm__":
        return await exec_llm(args)
    async with httpx.AsyncClient(timeout=120) as c:
        r = await c.post(f"{WISP_URL}/call", json={"server_name": node.server_name, "tool_name": node.tool_name, "arguments": args})
        r.raise_for_status()
        return r.json()


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

async def run_workflow(wf: Workflow):
    outputs, levels = {}, topo_levels(wf.nodes)
    total, done = len(wf.nodes), 0
    yield sse({"type": "workflow_start", "workflow_id": wf.id, "total_nodes": total})

    for li, level in enumerate(levels):
        async def run(node: DAGNode) -> tuple[str, str]:
            nonlocal done
            args = resolve(node.arguments, outputs)
            s = sse({"type": "node_start", "workflow_id": wf.id, "node_id": node.id,
                     "data": {"step": node.step, "server_name": node.server_name, "tool_name": node.tool_name,
                              "arguments": args, "level": li, "progress": done/total},
                     "timestamp": datetime.utcnow().isoformat()})
            t0 = time.time()
            try:
                result = await exec_node(node, outputs)
                if node.output_key: outputs[node.output_key] = result
                done += 1
                rs = json.dumps(result)
                if len(rs) > 8000: result = {"_truncated": True, "preview": rs[:8000]}
                return s, sse({"type": "node_complete", "workflow_id": wf.id, "node_id": node.id,
                               "data": {"result": result, "elapsed": round(time.time()-t0, 2), "progress": done/total},
                               "timestamp": datetime.utcnow().isoformat()})
            except Exception as e:
                done += 1
                return s, sse({"type": "node_error", "workflow_id": wf.id, "node_id": node.id,
                               "data": {"error": str(e), "progress": done/total},
                               "timestamp": datetime.utcnow().isoformat()})

        for s, e in await asyncio.gather(*[run(n) for n in level]):
            yield s; yield e

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

@app.get("/workflows")
async def list_wf():
    return {"workflows": [w.model_dump() for w in workflows.values()]}

@app.get("/workflows/{wid}")
async def get_wf(wid: str):
    wf = workflows.get(wid)
    if not wf: raise HTTPException(404, "Not found")
    return wf.model_dump()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
