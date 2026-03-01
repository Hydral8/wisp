# MCP Add-Now Status

Updated: 2026-02-28 (America/Los_Angeles)

## Summary

- Added to `mcp_registry.db`: 15 target connectors (including `github` alias).
- Extraction currently usable for:
  - `io.github.Oratorian/discord-node-mcp` (67 tools)
  - `io.github.henilcalagiya/google-sheets-mcp` (24 tools)
  - `github` (40 tools, 2 prompts)
- Most remote connectors currently fail with `mcp_protocol_error` (`TaskGroup` error surfaced by MCP client).

## Connector Snapshot

| Server | Tools | Resources | Prompts | Status | Failure Reason |
|---|---:|---:|---:|---|---|
| `io.github.domdomegg/gmail-mcp` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `com.mintmcp/gmail` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `io.github.stevenvo/slack-mcp-server` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `ai.smithery/smithery-ai-slack` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `com.notion/mcp` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `io.github.henilcalagiya/google-sheets-mcp` | 24 | 0 | 0 | `success` | |
| `io.github.domdomegg/google-sheets-mcp` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `com.mintmcp/gcal` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `com.atlassian/atlassian-mcp-server` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `app.linear/linear` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `io.github.Oratorian/discord-node-mcp` | 67 | 0 | 0 | `success` | |
| `com.stripe/mcp` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `io.github.bytebase/dbhub` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `ai.waystation/postgres` | 0 | 0 | 0 | `permanent_failure` | `mcp_protocol_error` |
| `github` | 40 | 0 | 2 | `permanent_failure` | `mcp_protocol_error` |

## MCP-Only Next Actions

1. Change extraction failure classification for `TaskGroup` transport errors from `permanent` to `transient` so these servers remain retryable.
2. Add connector-level retry strategy:
   - Remote servers: retry with both `streamable-http` and `sse` endpoints when present.
   - Stdio servers: fallback command strategy (e.g., `npx`/`uvx` flags) and explicit auth-var checks.
3. Add preflight auth checks to avoid noisy failures for token-required connectors (Gmail/Slack/DB).
4. Keep `github`, `discord`, `google-sheets (henilcalagiya)` enabled in ranking now; gate others as "installed but unverified".

## Retest Notes (2026-03-01)

- Transport fallback (`streamable-http` + `sse`) is now implemented in extractor.
- Error unwrapping now surfaces root causes instead of opaque `TaskGroup` only errors.

Auth-confirmed failures:

- `com.mintmcp/gmail` -> `401 Unauthorized` (endpoint reachable, auth required)
- `com.notion/mcp` -> `401 Unauthorized` (endpoint reachable, auth required)
- `ai.smithery/smithery-ai-slack` -> `401 Unauthorized` (endpoint reachable, auth required)

Local secret-preflight failures:

- `io.github.domdomegg/gmail-mcp` -> missing required secret env vars:
  - `GOOGLE_ACCESS_TOKEN`
  - `GOOGLE_CLIENT_SECRET`

For Gmail "working" status in this environment, set required Gmail secrets and rerun targeted extraction.

## Nango Integration Status

- Implemented token brokering hook in runtime tool calls:
  - `router/server.py` now injects Nango access tokens for mapped servers.
- Implemented token brokering hook in extraction path:
  - `router/server/mcp_client.py` now resolves Nango auth headers before remote extraction.
- Added helper module:
  - `router/server/nango_auth.py`
- Added setup instructions:
  - `router/server/NANGO_SETUP.md`

## Direct OAuth Status

- Added direct OAuth token support (without Nango) for remote connectors:
  - Notion, Gmail hosted, Slack hosted, Stripe, Atlassian, Linear
- Added Google refresh-token flow for Gmail stdio connectors:
  - `router/server/oauth_tokens.py`
  - Auto-refreshes `GOOGLE_ACCESS_TOKEN` when `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` are present.
- Added setup/preflight CLI:
  - `router/server/oauth_setup.py`
