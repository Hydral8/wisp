# MCP Add-Now Todo (Wisp)

Last updated: 2026-03-01

## Objective

Add the highest-leverage MCP integrations for a general automation product, with concrete server choices.

## Phase 0 - Tracking

- [x] Convert priority categories into concrete MCP server picks
- [ ] Confirm add policy per connector: hosted remote first vs self-hosted stdio first
- [x] Create `router/server/add_add_now_servers.py` with these entries
- [x] Insert servers into `mcp_registry.db`
- [x] Run targeted extraction for new servers
- [ ] Validate auth UX and minimum viable tool coverage

## Phase 1 - Add Now (Tier 1)

### 1) Gmail

- [ ] Add `io.github.domdomegg/gmail-mcp` (primary, npm stdio/HTTP)
  - Package: `npm:gmail-mcp`
  - Notes: direct Gmail read/send/manage coverage; moderate auth complexity.
- [ ] Add `com.mintmcp/gmail` (secondary hosted remote)
  - Remote: `https://gmail.mintmcp.com/mcp`
  - Notes: quick-start hosted option.

### 2) Slack

- [ ] Add `io.github.stevenvo/slack-mcp-server` (primary, self-hosted stdio)
  - Package: `pypi:slack-mcp-server-v2`
  - Notes: read/search workspace data; clear token-based setup.
- [ ] Add `ai.smithery/smithery-ai-slack` (secondary hosted remote)
  - Remote: `https://server.smithery.ai/@smithery-ai/slack/mcp`

### 3) GitHub

- [x] Keep existing `github` registration path via `router/server/add_github_mcp.py`
  - Remote: `https://api.githubcopilot.com/mcp/`
  - Required auth var: `GITHUB_TOKEN`
- [ ] Run extraction and verify core repo/issue/PR tools are discoverable in Wisp search

### 4) Notion

- [ ] Add `com.notion/mcp` (official)
  - Remote: `https://mcp.notion.com/mcp`

### 5) Google Sheets

- [ ] Add `io.github.henilcalagiya/google-sheets-mcp` (primary, tool-rich)
  - Package: `pypi:google-sheets-mcp`
  - Notes: currently highest observed tool count in local index for sheets.
- [ ] Add `io.github.domdomegg/google-sheets-mcp` (secondary npm option)
  - Package: `npm:google-sheets-mcp`

## Phase 2 - Add Next (Tier 2)

### 6) Calendar

- [ ] Add `com.mintmcp/gcal` (hosted remote)
  - Remote: `https://gcal.mintmcp.com/mcp`

### 7) Jira / Atlassian

- [ ] Add `com.atlassian/atlassian-mcp-server` (official remote)
  - Remote: `https://mcp.atlassian.com/v1/mcp`

### 8) Linear

- [ ] Add `app.linear/linear` (official remote)
  - Remote: `https://mcp.linear.app/mcp`

### 9) Discord

- [ ] Add `io.github.Oratorian/discord-node-mcp` (already present in DB; promote to add-now set)
  - Package: `npm:@mahesvara/discord-mcpserver`
  - Notes: high observed tool coverage in local index.

### 10) Stripe

- [ ] Add `com.stripe/mcp` (official remote)
  - Remote: `https://mcp.stripe.com`

### 11) Postgres

- [ ] Add `io.github.bytebase/dbhub` (self-hosted stdio)
  - Package: `npm:@bytebase/dbhub`
- [ ] Add `ai.waystation/postgres` (hosted remote fallback)
  - Remote: `https://waystation.ai/postgres/mcp`

## Tiering Rules

- Tier 1 = highest cross-company automation value + strong ecosystem demand.
- Prefer official provider endpoints where available (`com.*`, `app.*`), then mature OSS servers, then aggregator-hosted remotes.
- Keep at least one self-hosted option for data-sensitive connectors (email, chat, DB).

## Execution Notes

- Add entries to `servers`, plus one of:
  - `server_packages` for stdio package connectors.
  - `server_remotes` for HTTP/SSE connectors.
- Populate `environment_variables` for auth-bearing connectors.
- Run extraction with targeted query per connector and record success/failure in `tool_extraction_status`.

## Latest Extraction Snapshot (2026-02-28 PT)

- Passed with tools:
  - `io.github.Oratorian/discord-node-mcp` (67 tools)
  - `io.github.henilcalagiya/google-sheets-mcp` (24 tools)
  - `github` (40 tools, 2 prompts)
- Failed in this environment with MCP protocol/taskgroup errors:
  - `io.github.domdomegg/gmail-mcp`
  - `com.mintmcp/gmail`
  - `io.github.stevenvo/slack-mcp-server`
  - `ai.smithery/smithery-ai-slack`
  - `com.notion/mcp`
  - `io.github.domdomegg/google-sheets-mcp`
  - `com.mintmcp/gcal`
  - `com.atlassian/atlassian-mcp-server`
  - `app.linear/linear`
  - `com.stripe/mcp`
  - `io.github.bytebase/dbhub`
  - `ai.waystation/postgres`
