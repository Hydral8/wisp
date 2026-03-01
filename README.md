# Wisp Instant

Natural-language workflow automation powered by 2000+ MCP tools. Describe what you want done — Wisp finds the right tools, builds a parallel execution DAG, and runs it live.

## Architecture

```
┌─────────────┐        ┌─────────────┐        ┌──────────────┐
│   src/      │  HTTP  │   server/   │  HTTP   │   router/    │
│  Next.js UI │──────▶ │  Orchestrator│───────▶│  MCP Gateway │
│  :3001      │  SSE   │  :8001      │        │  :8000       │
└─────────────┘◀───────└─────────────┘        └──────────────┘
```

### `/src` — Frontend (Next.js)

React UI for describing workflows, viewing DAG plans, deploying, and monitoring execution in real time via SSE.

- **Stack**: Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Entry**: `src/app/page.tsx` — chat pane + DAG visualization + execution feed
- **Port**: 3001

### `/server` — Orchestrator (FastAPI)

Takes a natural-language prompt, uses Claude to search for MCP tools and build an execution DAG, then runs it with parallel topological execution.

- **Stack**: FastAPI, Anthropic SDK, httpx
- **Entry**: `server/main.py`
- **Port**: 8001
- **Key flows**:
  - `POST /plan` — Claude plans a DAG by searching tools via the router
  - `POST /deploy` — Executes the DAG with SSE streaming of node progress
  - `POST /automate` — Plan + execute in one call
  - `POST /webhooks` — Create reusable webhook triggers for workflows

### `/router` — MCP Gateway (FastAPI)

Tool discovery and execution layer. Embeds tool descriptions for semantic search and proxies calls to MCP servers (stdio, HTTP, local).

- **Stack**: FastAPI, sentence-transformers, sqlite-vec, MCP SDK
- **Entry**: `router/server.py`
- **Port**: 8000
- **Key flows**:
  - `GET /search?query=...` — Semantic search over indexed MCP tools
  - `POST /call` — Execute a tool on any registered MCP server
  - `GET /servers/{name}/tools` — List tools for a specific server

## How to Run

### Prerequisites

- Python 3.13+
- Node.js 20+
- `uv` (Python package manager)

### 1. Router (MCP Gateway)

```bash
cd router
uv sync
uv run python server.py
# Running on http://localhost:8000
```

### 2. Server (Orchestrator)

```bash
cd server
# Ensure ANTHROPIC_API_KEY is set in router/server/.env or environment
uv run python main.py
# Running on http://localhost:8001
```

### 3. Frontend

```bash
cd src
npm install
npm run dev
# Running on http://localhost:3001
```

### Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude (required by server) |
| `WISP_GATEWAY_URL` | Router URL (default: `http://localhost:8000`) |
| `NANGO_BASE_URL` | Nango API base URL (for OAuth token brokering), e.g. `https://api.nango.dev` |
| `NANGO_SECRET_KEY` | Nango secret key used by router/extractor to fetch connection access tokens |
| `NANGO_MCP_CONNECTIONS_JSON` | JSON map of `server_name` to Nango `provider_config_key` + `connection_id` for MCP auth injection |

### Nango Mapping Example

```json
{
  "com.mintmcp/gmail": {
    "provider_config_key": "google-mail",
    "connection_id": "default"
  },
  "com.notion/mcp": {
    "provider_config_key": "notion",
    "connection_id": "workspace_prod"
  },
  "ai.smithery/smithery-ai-slack": {
    "provider_config_key": "slack",
    "connection_id": "team_main"
  }
}
```
