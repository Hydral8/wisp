# Wisp

Natural-language workflow automation powered by 2000+ MCP tools. Describe what you want done — Wisp finds the right tools, builds a parallel execution DAG, and runs it live.

## Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│   src/      │  WS    │   Convex Cloud   │  HTTP   │   router/    │
│  Next.js UI │◀──────▶│  (Backend)       │───────▶│  MCP Proxy   │
│  Vercel     │  real- │  Auth, DB, Vector│        │  Railway     │
└─────────────┘  time  │  Search, Actions │        └──────────────┘
                       └──────────────────┘              │
                           │         │                   ▼
                      HTTP │         │ HTTP         MCP Servers
                           ▼         ▼            (stdio + remote)
                  ┌────────────┐ ┌──────────────┐
                  │ HuggingFace│ │  Composio    │
                  │ Inference  │ │  Managed     │
                  │ Embeddings │ │  OAuth+Exec  │
                  └────────────┘ └──────────────┘
```

**Tool execution routing:**
```
Tool call needed
    ├─ Composio connected account exists for this app?
    │   YES → Composio executes (managed OAuth, no API keys needed)
    └─ NO  → MCP Proxy executes (stdio/remote, manual credentials)
```

### `/src` — Frontend (Next.js + Convex)

React UI with real-time subscriptions via Convex. Includes chat-based planning, DAG visualization, and live execution monitoring.

- **Stack**: Next.js 16, React 19, Tailwind CSS 4, TypeScript, Convex
- **Entry**: `src/app/page.tsx` — chat pane + DAG visualization + execution feed
- **Auth**: Google + GitHub OAuth via `@convex-dev/auth`

### `/src/convex` — Backend (Convex)

All orchestration, auth, database, and vector search logic runs in Convex.

- **Auth**: `convex/auth.ts` — Google + GitHub OAuth
- **Planning**: `convex/planning.ts` — Claude-powered agentic loop that searches tools and builds execution DAGs
- **Execution**: `convex/execution.ts` — Topological DAG execution with parallel levels, credential injection, browser automation
- **Registry**: `convex/registry.ts` — Semantic tool search via 768D vector embeddings (HuggingFace)
- **Composio**: `convex/composio.ts` — Managed OAuth connections + tool execution via Composio API
- **Credentials**: `convex/credentials.ts` — User-scoped manual credential storage (fallback)
- **Workflows**: `convex/workflows.ts` — CRUD for saved workflows
- **Webhooks**: `convex/webhooks.ts` — Webhook triggers for workflows
- **Embeddings**: `convex/embeddings.ts` — 768D embeddings via HuggingFace Inference API (`google/embeddinggemma-300m`)

### `/router` — MCP Proxy (FastAPI)

Thin tool execution proxy. Maintains a persistent stdio MCP connection pool and exposes a single `/call` endpoint.

- **Stack**: FastAPI, MCP SDK, uvicorn
- **Entry**: `router/server.py`
- **Endpoints**:
  - `POST /call` — Execute a tool on any registered MCP server (stdio or remote)
  - `GET /health` — Health check

### `/server` — Legacy Orchestrator (archived)

The original Python orchestrator. Its logic has been migrated to Convex actions. Kept for reference.

## How to Run

### Prerequisites

- Node.js 20+
- Python 3.13+ (for MCP proxy only)
- `uv` (Python package manager)
- A Convex account (or local Convex backend for development)

### 1. Convex Backend

```bash
cd src
npm install
npx convex dev
# Local backend runs at http://127.0.0.1:3210
```

Set environment variables in the Convex dashboard (or via `npx convex env set`):

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude (planning) |
| `HUGGINGFACE_API_KEY` | HuggingFace API key — used for tool embeddings via `api-inference.huggingface.co` (`google/embeddinggemma-300m`, 768D) |
| `MCP_PROXY_URL` | URL of the MCP proxy (e.g. `http://localhost:8000`) |
| `BROWSER_USE_API_KEY` | Browser-Use API key (optional, for browser automation) |
| `COMPOSIO_API_KEY` | Composio API key from [app.composio.dev](https://app.composio.dev) (optional, for managed OAuth integrations) |
| `AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `AUTH_GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app secret |

### 2. MCP Proxy

```bash
cd router
uv sync
uv run python server.py
# Running on http://localhost:8000
```

### 3. Frontend

```bash
cd src
npm run dev
# Running on http://localhost:3001
```

### Data Migration (from SQLite)

If migrating from the legacy SQLite-based registry:

```bash
# 1. Export SQLite data to JSON
cd /path/to/wisp
python scripts/export_registry.py

# 2. Import into Convex (with Convex dev running)
node scripts/import_to_convex.mjs
```

This imports ~364 servers, ~5,206 tools, and associated metadata. Tool embeddings are stored as zero vectors and need regeneration via HuggingFace.

### Composio Setup (Optional)

Composio provides managed OAuth for popular apps so users can connect with one click instead of manually entering API keys.

1. Create an account at [app.composio.dev](https://app.composio.dev)
2. Copy your API key from the dashboard
3. Set it in Convex:
   ```bash
   npx convex env set COMPOSIO_API_KEY <your-key>
   ```
4. Users can then click "Connect" in the Credentials tab to OAuth into each app — Composio handles the OAuth flow and token management automatically.

Currently supported Composio apps: GitHub, Gmail, Slack, Notion, Linear, Google Calendar, Google Drive, Google Sheets. The mapping lives in `src/convex/composio.ts` and is easily extensible.

## MCP Registry

Wisp includes a built-in registry of 364 MCP servers and 5,206 tools with semantic search and importance ranking inspired by the PageRank algorithm by Larry Page and Sergey Brin. The registry is stored in Convex with 768-dimensional vector embeddings for tool discovery.

Supported server types:
- **npm** — launched via `npx -y <package>`
- **PyPI** — launched via `uvx <package>`
- **Remote (HTTP/SSE)** — connected via streamable HTTP or SSE
- **Docker** — launched via `docker run`
