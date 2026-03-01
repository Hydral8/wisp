PRD.md — Wisp Instant Automation Layer
1. Overview

Product Name: Wisp Instant
Objective: Replace tools like n8n by enabling users to deploy working automations in 2–3 minutes via natural language using Wisp’s generalist browser layer.

Wisp sits above a composable AI + infra stack and orchestrates tools asynchronously with parallel execution and specialized subagents.

Target users:

Hackathon builders

Startup founders

Growth/ops teams

Technical solo operators

Core promise:

“Describe your workflow. Wisp deploys it live in minutes.”

2. System Architecture
2.1 High-Level Flow

User describes automation.

Orchestrator agent parses + plans.

Parallel task graph constructed.

Subagents execute tasks asynchronously.

State persisted + memory updated.

Live automation deployed.

3. Core Stack & Integration Map
3.1 Frontier Model Layer

OpenAI — GPT models (reasoning + orchestration)

Anthropic — Claude Sonnet (structured reasoning)

Google DeepMind — Gemini Flash (fast subagents)

Usage Strategy

Orchestrator → Sonnet / GPT-4 class

Fast execution agents → Gemini Flash–class models

Micro-agents → ultra-low-latency completion models

3.2 Backend + Infra

Convex — reactive backend

MongoDB — document storage

AWS — compute + Bedrock

Vercel — web deployment

3.3 Agent Tooling

Supermemory — long-term memory

Laminar — tracing + evals

HUD — RL benchmarking

Superset — multi-agent parallelism

Daytona — isolated execution

Dedalus Labs — MCP connectivity

AgentMail — inbox automation

Cubic — reliability guardrails

Vibeflow — visual backend workflows

4. Core Product Principles

Async-first execution

Parallelize non-dependent tasks

Centralized memory bus

Model specialization

Sub-2 minute deployment

5. Architecture Details
5.1 Orchestrator Model

Responsibilities:

Parse intent

Construct DAG of tasks

Route tasks to specialized subagents

Resolve dependencies

Maintain global memory state

Output:

{
  nodes: [...],
  dependencies: [...],
  parallelizable_groups: [...]
}
5.2 Subagent Classes
Agent Type	Model Class	Purpose
Planner	Claude Sonnet	Workflow DAG creation
Executor	Gemini Flash	API calls + simple transforms
Browser Actor	Wisp Layer	UI automation
Code Gen	GPT	Generate deployable code
Validator	Smaller LLM	Schema & output validation
Memory Sync	Lightweight model	Context pruning
5.3 Async Parallel Execution Model

Execution rules:

If no data dependency → run in parallel

Await only explicit upstream outputs

Use Promise.all-style orchestration

Short-circuit failure isolation

Example:

User request:

When I receive email → extract invoice → log to DB → notify Slack

Parallelizable:

Email fetch

Metadata extraction

Schema validation

Sequential:

DB write depends on extraction

Slack notification depends on DB confirmation

6. Initial Hackathon Version

Phase 1:

Local Wisp

OpenAI + Anthropic APIs

Convex backend

MongoDB

Minimal memory (in-memory cache)

Phase 2:

Swap in:

Supermemory

Laminar tracing

HUD evaluation

Superset parallel coding

Daytona sandboxes

AWS scaling

7. 2–3 Minute Setup Flow

User types request.

Instant plan generated (<3s).

DAG preview shown.

User clicks “Deploy.”

Live webhook + workflow endpoint generated.

Dashboard shows real-time execution trace.

No drag-and-drop builder.
No manual wiring.

8. Memory Architecture
Short-Term

Session context window

Task-local embeddings

Long-Term

Supermemory integration

Indexed by:

Workflow

Entity

Outcome

Failure type

9. Reliability & Observability

Laminar tracing on every agent call

Cubic code validation for generated scripts

Structured JSON enforcement

Retry policies:

Idempotent tasks → auto retry

Non-idempotent → validation gate

10. Rapid Output Acceleration While Maintaining Reliability
10.1 Model Routing Optimization

Route trivial classification to ultra-small models

Use heuristics before LLM:

Regex

Deterministic schema checks

Avoid orchestration LLM calls when template match exists

10.2 Speculative Execution

Begin likely branches before full reasoning completes

Cancel unused branches

Pre-fetch API metadata

10.3 Multi-Stage Progressive Execution

Fast coarse plan

Immediate partial execution

Refinement pass only if needed

Reduces cold-start latency.

10.4 Memory Caching

Cache:

Workflow structures

Frequent transforms

API schemas

Hash user requests → reuse plans

10.5 Micro-Agent Specialization

Instead of one large executor:

Email extractor agent

Slack formatting agent

DB write agent

Smaller agents:

Lower latency

Lower token cost

Reduced hallucination surface

10.6 Deterministic Wrappers

Wrap agent outputs with:

Schema validators

Type guards

Strict tool invocation contracts

LLMs only fill structured slots.

10.7 Parallel API Aggregation

If 5 APIs needed:

Fire simultaneously

Await barrier sync

Resolve merges via deterministic merge logic

10.8 Confidence Scoring

Before execution:

Run quick validator model

If confidence < threshold:

Trigger deeper reasoning

Otherwise proceed instantly

11. Competitive Differentiation vs n8n
n8n	Wisp Instant
Manual node wiring	Natural language
Sequential mindset	Parallel DAG
No reasoning	Model-driven orchestration
Setup time 20–40 min	<3 minutes
12. Success Metrics

Time to first working automation < 180s

Task success rate > 90%

Median execution latency < 3s per node

Cost per automation < $0.10

13. Long-Term Vision

Wisp becomes:

Browser-native orchestration layer

Unified agent runtime

MCP hub

Parallel AI compute fabric

This evolves from hackathon automation replacement → foundational internet execution layer.

Make an adjustment to have the option to create deterministic workflows (i.e. once you have a working workflow -> can replace with deterministic one where we only take the ones that were essential to get the result). Additionally, for oauth or mcp connectors obviously have daedalus but any oauth setup ideally should be stupidly simple (i.e. one click) instead of difficult. Give me revised version
PRD.md — Wisp Instant (Revised)
1. Overview

Product Name: Wisp Instant
Objective: Replace tools like n8n by enabling users to deploy working automations in 2–3 minutes via natural language using Wisp’s generalist browser layer.

Wisp sits above a composable AI + infra stack and orchestrates tools asynchronously with parallel execution, specialized subagents, and optional deterministic conversion.

Core promise:

Describe your workflow. Wisp deploys it live in minutes. Then optionally lock it into deterministic mode for production.

2. Core Product Principles

Async-first execution

Parallelize non-dependent tasks

Centralized memory bus

Model specialization

Deterministic upgrade path

Sub-2 minute deployment

One-click OAuth / MCP connectivity

3. System Architecture
3.1 Execution Modes

Wisp supports two execution modes:

Mode A — Adaptive Agent Mode (Default)

LLM-driven orchestration

Dynamic reasoning

Flexible handling of edge cases

Best for rapid prototyping

Mode B — Deterministic Compiled Mode (Production)

Once a workflow works reliably:

Remove non-essential reasoning steps

Freeze the DAG

Replace LLM nodes with:

Direct API calls

Static transforms

Typed schema validators

Deterministic routing logic

This reduces:

Latency

Cost

Hallucination risk

Runtime variability

4. Deterministic Workflow Conversion
4.1 Conversion Trigger

User clicks:
“Convert to Deterministic”

System performs:

Trace analysis via Laminar

Identify essential nodes only

Remove reasoning-only intermediate nodes

Extract static execution graph

Replace LLM transforms with compiled logic

4.2 Deterministic Compilation Strategy

During compilation:

If LLM output is consistent across runs → replace with:

Regex

JSON schema mapping

Direct API call

Typed function

If classification task:

Replace with small local classifier

Or rule-based logic

If pure transform:

Generate TypeScript function

Validate with Cubic

Final result:

{
  nodes: [
    "webhook_listener",
    "invoice_parser.ts",
    "mongodb_insert",
    "slack_notify"
  ],
  type: "deterministic"
}
4.3 Hybrid Mode

Allow partial determinism:

Deterministic core

LLM fallback for rare edge cases

5. OAuth & MCP Simplicity
5.1 MCP Connectivity

MCP integrations handled via:

Dedalus Labs

Wisp automatically:

Registers tool

Generates tool schema

Adds to orchestrator routing table

No manual configuration required.

5.2 One-Click OAuth

Objective: OAuth setup must be stupidly simple.

Design:

User selects integration (Gmail, Slack, Notion, etc.)

Click “Connect”

Redirect → provider OAuth

Token stored securely

Connector immediately usable

Under the hood:

Token storage via Convex

Secure encryption layer

Scoped permission enforcement

Auto-refresh handling

No:

Manual callback URLs

Secret copy/paste

App registration complexity

Advanced mode optionally allows custom client IDs.

6. Core Stack
6.1 Model Layer

OpenAI — orchestration + codegen

Anthropic — structured reasoning

Google DeepMind — fast subagents

Routing Strategy:

Planner → high-capability model

Execution → fast small model

Deterministic mode → no LLM unless fallback

6.2 Backend & Infra

Convex — reactive backend

MongoDB — storage

AWS — compute + Bedrock

Vercel — deployment

6.3 Agent Tooling

Supermemory — long-term memory

Laminar — tracing

HUD — benchmarking

Superset — parallel agents

Daytona — secure sandboxes

AgentMail — email automation

Vibeflow — workflow generation

7. Async Parallel Execution Model

Rules:

Build DAG from planner

Execute independent nodes concurrently

Use Promise.all style batching

Early failure isolation

Retry idempotent nodes only

8. Rapid Output Acceleration While Maintaining Reliability
8.1 Deterministic First Execution

After N successful runs:

Auto-suggest deterministic conversion

Reduce LLM calls by 70–90%

8.2 Speculative Parallel Execution

Predict likely branches

Fire in parallel

Cancel unused branch

8.3 Template Plan Caching

Hash user intent

Reuse compiled DAG

Avoid re-planning when possible

8.4 Micro-Agent Specialization

Replace large executor with:

Email extractor

Slack formatter

DB writer

Schema validator

Small agents:

Lower latency

Lower cost

Less variance

8.5 Deterministic Wrappers

All LLM outputs:

Must match JSON schema

Validated before execution

Strict tool invocation

8.6 Confidence-Gated Escalation

Fast model runs first

If confidence low → escalate to larger model

Deterministic mode bypasses entirely

9. Deployment Flow

User describes workflow.

Planner generates DAG.

Preview shown.

User clicks Deploy.

Live endpoint generated.

After stable runs → prompt for deterministic upgrade.

10. Competitive Differentiation
n8n	Wisp Instant
Manual node wiring	Natural language
Sequential	Parallel DAG
No reasoning	Model-driven orchestration
No compilation	Deterministic compilation
Complex OAuth	One-click OAuth
11. Success Metrics

Time to first workflow < 180s

OAuth connection time < 10s

Deterministic conversion < 5s

70% reduction in runtime cost after compilation

Success rate > 90%

12. Long-Term Vision

Wisp evolves into:

Browser-native orchestration runtime

MCP-native agent fabric

Deterministic + adaptive hybrid engine

Foundational execution layer for AI-driven internet automation