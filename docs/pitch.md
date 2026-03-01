# Wisp — From Exploration to Reusable Workflows to Marketplace

> Explore tools with AI. Lock them into deterministic workflows. Share and reuse on a marketplace.

---

## The Insight

AI agents are great at **exploring** — finding the right tool, figuring out arguments, handling edge cases. But exploration is expensive: it costs tokens, takes time, and produces inconsistent results.

Once you've explored and found a working sequence of tool calls, you shouldn't have to explore again. That sequence should become a **deterministic, reusable workflow** — no AI needed to re-run it.

And if your workflow solves a common problem, others shouldn't have to explore either. They should be able to **grab it from a marketplace** and run it instantly.

---

## The Three Stages

```
┌─────────────┐      ┌──────────────────────┐      ┌─────────────────┐
│  1. EXPLORE  │ ──→  │  2. LOCK INTO WORKFLOW │ ──→  │  3. MARKETPLACE  │
│              │      │                      │      │                 │
│  AI agent    │      │  Deterministic DAG   │      │  Share & reuse  │
│  searches    │      │  No AI needed        │      │  One-click run  │
│  5,206 tools │      │  Parallel execution  │      │  Community      │
│  + browser   │      │  Webhook triggers    │      │  templates      │
│  Iterates    │      │  Consistent results  │      │  Configurable   │
└─────────────┘      └──────────────────────┘      └─────────────────┘
     Expensive              Cheap & Fast              Zero marginal cost
     Variable               Deterministic             Scalable
     One-time               Repeatable                Community-driven
```

---

## Stage 1: Explore

A user describes what they want in natural language. Wisp's AI agent:

1. **Searches** across 5,206 MCP tools and 364+ servers using semantic search
2. **Discovers** sibling tools on the same server (e.g., finding `monitor_task` after `browser_task`)
3. **Executes** tools to test them with real data
4. **Controls a browser** for sites with no API (food delivery, LinkedIn, event signup, competitor pricing)
5. **Verifies** results and iterates until the task is actually done

This is the expensive part — it uses an LLM (Gemini Flash), costs tokens, and may take multiple turns. But it only needs to happen **once per workflow type**.

**Example exploration:**

```
User: "Compare pad thai delivery prices on UberEats, DoorDash, and Grubhub"

Agent:
  → search_tools("food delivery") → no MCP API exists
  → search_tools("browser_use") → found browser-use MCP
  → browser_task(UberEats, search "pad thai") → $18.99, 35 min
  → browser_task(DoorDash, search "pad thai") → $16.49, 28 min
  → browser_task(Grubhub, search "pad thai") → $19.99, 42 min
  → Done: comparison table generated
```

The agent figured out that no food delivery API exists, fell back to browser automation, and completed the task across 3 platforms. This exploration took ~2 minutes and multiple LLM turns.

---

## Stage 2: Lock Into Workflow

Once the agent completes a task, the user clicks **"Convert to Workflow"**. This captures the executed steps as a **deterministic DAG**:

```json
{
  "name": "Food Delivery Price Comparison",
  "nodes": [
    { "id": "ubereats",  "tool": "browser_task", "server": "com.browser-use/mcp", "args": {"task": "Search UberEats for pad thai..."}, "depends_on": [] },
    { "id": "doordash",  "tool": "browser_task", "server": "com.browser-use/mcp", "args": {"task": "Search DoorDash for pad thai..."}, "depends_on": [] },
    { "id": "grubhub",   "tool": "browser_task", "server": "com.browser-use/mcp", "args": {"task": "Search Grubhub for pad thai..."}, "depends_on": [] },
    { "id": "compare",   "tool": "generate",     "server": "__llm__",              "args": {"prompt": "Compare: {{ubereats}}, {{doordash}}, {{grubhub}}"}, "depends_on": ["ubereats", "doordash", "grubhub"] }
  ]
}
```

Now this workflow:
- **Runs without AI planning** — no LLM needed to figure out which tools to use
- **Executes in parallel** — UberEats, DoorDash, Grubhub scraped simultaneously
- **Produces consistent results** — same steps every time
- **Triggers via webhook** — `POST /webhooks/{id}/trigger` runs it on demand
- **Costs near zero** — only pays for tool execution, not exploration

The user went from a 2-minute AI exploration to a **10-second deterministic execution**.

---

## Stage 3: Marketplace — Reuse & Share

The locked workflow becomes a **template** that anyone can use:

### Publishing
- User clicks **"Publish to Marketplace"** on a saved workflow
- Adds a name, description, and tags
- Marks **configurable parameters** (e.g., "pad thai" → user-provided food item, delivery address)

### Consuming
- Other users browse the marketplace or search by tag/description
- Click **"Use"** → workflow is cloned to their account
- Fill in configurable parameters → run immediately
- **Zero exploration needed** — the original creator already did the hard work

### The Flywheel

```
More users explore → More workflows created → More templates published
    ↑                                                    ↓
    └──── More users attracted by marketplace ←──────────┘
```

Each exploration creates a reusable asset. The platform gets **more valuable with every user** because their explorations become templates for everyone else.

---

## Why This Matters

### The Cost Curve

| Stage | Cost per run | Latency | Reliability |
|-------|:---:|:---:|:---:|
| Explore (AI agent) | High (LLM tokens) | 1-3 min | Variable |
| Workflow (deterministic) | Low (tool calls only) | 5-30 sec | Consistent |
| Marketplace (shared) | Low | 5-30 sec | Consistent |

Exploration is expensive but happens once. Every subsequent run is cheap and fast.

### vs. Zapier / n8n

| | Zapier / n8n | Wisp |
|---|---|---|
| **Building a workflow** | Manual: drag nodes, configure each step, read API docs | AI explores and builds it for you |
| **Tool coverage** | Hundreds of pre-built integrations | 5,206 MCP tools + browser for everything else |
| **No-API sites** | Not supported | Browser-Use handles them |
| **Sharing** | Export/import JSON | One-click marketplace with configurable params |
| **First-time setup** | Hours of manual work | Minutes of conversation |

**Zapier makes you the integrator. Wisp makes the AI the integrator.**

### vs. AI Agents (ChatGPT, Claude, etc.)

| | AI Agents | Wisp |
|---|---|---|
| **Exploration** | Good (but can't execute MCP tools) | Good (5,206 tools + browser) |
| **Reusability** | None — re-explores every time | Lock into deterministic workflow |
| **Sharing** | Copy-paste prompts | Marketplace with one-click use |
| **Execution** | Talks about doing it | Actually does it |
| **Cost per repeat** | Same as first run | Near zero |

**AI agents explore every time. Wisp explores once, then runs deterministically forever.**

---

## The Product

### Compose — Start with a prompt
Type what you want. The AI agent searches tools, executes them, and shows live progress. For web tasks, a live browser iframe appears so you can watch.

### Convert — Lock it in
When the agent finishes, click "Convert to Workflow." The executed steps become a deterministic DAG with parallel execution, reference binding between nodes, and webhook triggers.

### Automations — Run again
Your saved workflows appear in the Automations tab. Re-run with one click or trigger via webhook. No AI needed — same steps, same results, every time.

### Marketplace — Share it
Publish workflows as templates. Other users clone them, fill in their parameters, and run. The community builds a library of proven automations.

### Credentials — Bring your keys
Store API keys and login profiles. Wisp auto-injects them when running workflows that need auth. Supports OAuth (GitHub, Google, Slack, Notion) and manual credentials.

---

## How Browser-Use Fits In

Browser-Use is the **escape hatch** for the 80% of the web that has no API:

| Has API → Use MCP tool | No API → Use browser |
|---|---|
| GitHub star/unstar | GitHub Trending page |
| Notion create page | Eventbrite registration |
| Slack send message | UberEats menu search |
| Google Calendar event | LinkedIn Easy Apply |
| Email send | Competitor pricing pages |

The agent **automatically decides** which to use. When a tool exists, it uses the API (faster, cheaper). When no tool exists, it launches a browser session. Users see a live iframe during browser tasks.

This is critical for the marketplace: workflows that combine **API calls + browser automation** can automate things no pure-API tool can handle.

---

## Architecture

```
Frontend (Next.js :3001)
├── Compose: natural language input + preset templates
├── Agent Panel: live SSE stream of exploration
├── BrowserLiveView: embedded iframe for browser tasks
├── Workflow Editor: DAG visualization + execution monitor
├── Marketplace: browse, search, use community templates
└── Credentials: API key + OAuth management

Orchestrator (FastAPI :8001)
├── Agentic Loop: Gemini Flash iterates over tools
├── DAG Executor: parallel topological execution
├── Workflow Store: save/load/trigger deterministic workflows
├── Convert: agent steps → reusable DAG
└── Webhooks: HTTP triggers for saved workflows

MCP Gateway (FastAPI :8000)
├── 5,206 tools across 364+ servers
├── Semantic search (sentence-transformers + sqlite-vec)
├── Connection pool (persistent stdio/HTTP sessions)
├── Auth injection (Nango OAuth, env vars, local creds)
└── Supports: npm (npx), Python (uvx), Docker, HTTP
```

---

## Demo Script (90 seconds)

**1. Explore** (60s)
> "Find today's trending GitHub repos, star the AI ones, and save them to my Notion database"

- Agent searches → finds GitHub MCP, Notion MCP, browser-use
- Live browser iframe opens → scrapes GitHub Trending (no API for this)
- GitHub MCP checks star status → stars new repos
- Notion MCP creates database entries
- Agent reports results

**2. Convert** (10s)
- Click "Convert to Workflow"
- DAG appears: 3 parallel nodes (scrape, star, save) with dependencies

**3. Marketplace** (20s)
- Click "Publish to Marketplace"
- Set configurable param: topic filter (default: "AI")
- Another user opens marketplace → clicks "Use" → runs immediately with their own GitHub + Notion credentials

**Punchline**: "The first run took 2 minutes of AI exploration. Every run after that takes 10 seconds with no AI. And now anyone on the marketplace can do it in one click."

---

## Registry

| Metric | Count |
|--------|-------|
| MCP Tools | 5,206 |
| MCP Servers | 364+ |
| Connection types | stdio, HTTP, local |
| Auth integrations | GitHub, Google, Slack, Notion, Stripe, Linear, Atlassian |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Orchestrator | FastAPI, Gemini Flash, Claude Sonnet |
| Gateway | FastAPI, sentence-transformers, sqlite-vec, MCP SDK |
| Database | Convex (user data, workflows, marketplace), SQLite (tool registry) |
| Auth | Convex Auth (GitHub/Google), Nango (3rd-party OAuth) |
| Browser | Browser-Use Cloud API |

---

## Team

Built at the YC Browser-Use Hackathon.

- GitHub: [github.com/Hydral8/wisp](https://github.com/Hydral8/wisp)
