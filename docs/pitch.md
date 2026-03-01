# Wisp — The MCP Tool Gateway with Browser Automation

> One prompt. 5,000+ tools. Live browser control. Real-time execution.

---

## What is Wisp?

Wisp is a natural-language automation platform that connects an AI agent to **5,206 MCP tools across 364+ servers** — plus a live browser. Users describe what they want in plain English; Wisp finds the right tools, executes them, and streams results in real time.

Unlike chatbots that just talk, Wisp **actually does the work**: it searches for tools, calls APIs, controls a browser, verifies results, and iterates until the task is complete.

---

## The Problem

Today's AI agents can talk, but they can't act across systems. Automating a real workflow — "scrape this site, check my GitHub stars, save to Notion, message me on Slack" — requires:

- **Finding the right APIs** across dozens of platforms
- **Handling auth** (OAuth, API keys, cookies) for each one
- **Orchestrating execution** in the right order, in parallel where possible
- **Controlling a browser** for sites with no API
- **Monitoring progress** and handling errors in real time

No single tool does all of this. Users end up stitching together Zapier, custom scripts, browser extensions, and manual work.

---

## The Solution

Wisp is a **3-tier system** that turns one prompt into a fully executed workflow:

```
User Prompt
    ↓
┌─────────────────────────────────────────────────────┐
│  Frontend (Next.js :3001)                           │
│  Chat → Agent Panel → Browser Live View → Results   │
└────────────────────┬────────────────────────────────┘
                     ↓ SSE
┌─────────────────────────────────────────────────────┐
│  Orchestrator (FastAPI :8001)                        │
│  Gemini/Claude Agent Loop → DAG Execution → Creds   │
└────────────────────┬────────────────────────────────┘
                     ↓ HTTP
┌─────────────────────────────────────────────────────┐
│  MCP Gateway (FastAPI :8000)                         │
│  5,206 Tools → Semantic Search → Connection Pool     │
└─────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Agentic Tool Discovery & Execution

The AI agent doesn't work from a fixed list — it **searches** for the right tools at runtime.

- **Semantic search** over 5,206 indexed MCP tools (sentence-transformers + sqlite-vec)
- **Server discovery**: find MCP servers by name or description
- **Tool browsing**: list all tools on a discovered server
- **Live execution**: call any tool and get structured results
- **Iterative loop**: search → execute → verify → adjust → repeat until done

The agent has 4 core tools:
| Tool | Purpose |
|------|---------|
| `search_tools` | Semantic search across all 5,206 tools |
| `list_server_tools` | Browse tools on a specific server |
| `search_servers` | Find servers by name/description |
| `execute_tool` | Run any MCP tool with arguments |

### 2. Live Browser Automation (Browser-Use)

For sites with **no API** — food delivery, LinkedIn, competitor pricing pages, event registration — Wisp controls a real browser:

- **Browser-Use Cloud integration**: fire-and-forget `browser_task`, auto-polling `monitor_task`
- **Live streaming iframe**: users watch the browser work in real time
- **Smart lifecycle**: iframe appears when session starts, hides when it ends, reappears on new session
- **Instruction optimization**: agent rewrites raw prompts into step-by-step browser instructions with URLs, UI actions, expected states, and error recovery

**Key insight**: the agent decides when to use an API (fast, reliable) vs. a browser (no API available). This hybrid approach covers the full web.

### 3. Parallel DAG Execution

When the agent plans a multi-step workflow, independent steps run **in parallel**:

- Topological sorting ensures correct dependency order
- Steps at the same level execute concurrently
- Reference binding: `{{node_id.field}}` passes outputs between steps
- Real-time SSE streaming of each step's progress

### 4. Credential Management & Auto-Injection

- **Local profiles**: store username, email, password, API key, token per service
- **Auto-injection**: credentials matched to tool/server and applied automatically
- **OAuth support**: Nango integration for Gmail, Notion, Slack, Stripe, Atlassian, Linear
- **Mid-execution requests**: workflows can pause to ask for 2FA codes or CAPTCHAs

### 5. MCP Connection Pool

The gateway maintains **persistent connections** to MCP servers:

- Stdio processes stay alive between requests (no per-call spawn overhead)
- 5-minute idle TTL with automatic cleanup
- Auto-reconnect on failure
- Supports stdio (npx/uvx/docker), HTTP (streamable), and local processes

### 6. Real-Time Streaming UI

Everything streams via SSE — users see the agent work in real time:

- **Agent thinking**: model reasoning text
- **Tool searches**: which tools were found and selected
- **Tool execution**: start, progress, and completion of each step
- **Browser view**: embedded live browser session
- **Results**: structured output with collapsible details

---

## Architecture

### Frontend (`/src` — Next.js 16 + React 19)

| Component | Purpose |
|-----------|---------|
| **Compose** | Main input — describe your task, pick a preset template |
| **ChatPane** | Two-way conversation for refinement |
| **PlanningFeed** | Live agent progress stream |
| **BrowserLiveView** | Embedded iframe with LIVE indicator, maximize, open-in-tab |
| **WorkflowPane** | DAG visualization with execution monitoring |
| **Credentials** | Manage saved API keys and login profiles |
| **Automations** | View and re-run saved workflows |
| **Marketplace** | Community workflow templates |

### Orchestrator (`/server` — FastAPI)

| Endpoint | Purpose |
|----------|---------|
| `POST /plan/stream` | SSE streaming agentic loop (Gemini Flash) |
| `POST /deploy` | Execute stored workflow with SSE progress |
| `POST /automate` | Plan + execute in one call |
| `POST /chat` | Follow-up refinement |
| `POST /webhooks` | Create webhook trigger for a workflow |
| `POST /convert-to-workflow` | Turn executed agent steps into reusable DAG |

### MCP Gateway (`/router` — FastAPI)

| Endpoint | Purpose |
|----------|---------|
| `GET /search` | Semantic tool search |
| `POST /call` | Execute tool on any MCP server |
| `GET /servers/search` | Find servers |
| `GET /servers/{name}/tools` | List server tools |

---

## Registry Stats

| Metric | Count |
|--------|-------|
| Total MCP Tools | 5,206 |
| Total MCP Servers | 364+ |
| Connection Types | stdio, HTTP, local |
| Auth Integrations | GitHub, Google, Slack, Notion, Stripe, Linear, Atlassian |
| API Keys Configured | 20+ |

---

## Built-in Presets

| Preset | What it does |
|--------|-------------|
| Competitive Analysis | Scrape & compare competitor websites |
| Research Report | Aggregate GitHub trending + multi-source synthesis |
| Job Market Snapshot | Scrape LinkedIn/Indeed, analyze salaries & skills |
| News Digest | Hacker News + TechCrunch + Verge with sentiment analysis |
| UML Diagram | Create architecture diagrams on draw.io via browser |
| GitHub Star Bot | Auto-star trending repos that match criteria |

---

## Why Browser-Use Matters

Most automation tools stop at APIs. But **the majority of the web has no API**:

| Site/Task | Has Public API? | Wisp Solution |
|-----------|:-:|---------------|
| UberEats/DoorDash menu search | No | browser-use |
| Eventbrite/Lu.ma registration | No | browser-use |
| Competitor pricing pages | No | browser-use |
| GitHub Trending page | No | browser-use |
| LinkedIn Easy Apply | No | browser-use |
| GitHub star/unstar | Yes | GitHub MCP |
| Notion read/write | Yes | Notion MCP |
| Slack messages | Yes | Slack MCP |
| Google Calendar | Yes | Calendar MCP |

**Wisp automatically picks the right approach**: API when available (fast, reliable), browser when not (flexible, universal).

---

## Competitive Landscape

| Feature | Zapier | n8n | Wisp |
|---------|:------:|:---:|:----:|
| Natural language input | No | No | Yes |
| AI-powered tool discovery | No | No | Yes |
| 5,000+ MCP tools | No | No | Yes |
| Live browser automation | No | No | Yes |
| Real-time streaming UI | No | Partial | Yes |
| Parallel execution | Limited | Yes | Yes |
| Credential auto-injection | Partial | Partial | Yes |
| Webhook triggers | Yes | Yes | Yes |
| No-code setup | Partial | No | Yes |

**Key differentiator**: Zapier and n8n require users to manually select and configure each step. Wisp's agent **finds and configures tools automatically** from a natural language description.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| Orchestrator | FastAPI, Google GenAI SDK (Gemini), Anthropic SDK (Claude) |
| Gateway | FastAPI, sentence-transformers, sqlite-vec, MCP SDK |
| Database | SQLite (registry + embeddings), Convex (user data + auth) |
| Auth | Convex Auth (GitHub/Google OAuth), Nango (3rd-party OAuth) |
| Browser | Browser-Use Cloud API |
| Infra | uv (Python), npm (Node), Docker support |

---

## Demo Flow (60 seconds)

1. **User types**: "Find today's trending GitHub repos, star the ones about AI, and save them to my Notion database"
2. **Agent searches**: finds GitHub MCP + Notion MCP + browser-use (for Trending page)
3. **Browser opens**: live iframe shows GitHub Trending being scraped
4. **Tools execute**: GitHub MCP checks star status, stars new repos; Notion MCP creates database entries
5. **Results stream**: each step appears in real-time in the agent panel
6. **Done**: agent reports which repos were starred and saved

**Total user effort**: one sentence. **Tools orchestrated**: 3 MCP servers + 1 browser session.

---

## Roadmap

- [ ] Scheduled workflows (cron triggers)
- [ ] Multi-browser parallel sessions
- [ ] Workflow marketplace (share & discover community templates)
- [ ] Mobile companion app (monitor executions on the go)
- [ ] Enterprise SSO + team workspaces
- [ ] Custom MCP server builder (add your own APIs)

---

## Team

Built at the YC Browser-Use Hackathon.

---

## Links

- GitHub: [github.com/Hydral8/wisp](https://github.com/Hydral8/wisp)
- Browser-Use: [browser-use.com](https://browser-use.com)
- MCP Specification: [modelcontextprotocol.io](https://modelcontextprotocol.io)
