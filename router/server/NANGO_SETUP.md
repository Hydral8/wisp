# Nango Setup For MCP Connectors

Use this to broker OAuth tokens for remote MCP servers (Gmail, Notion, Slack, etc.).
If you prefer self-managed OAuth, you can skip Nango and provide direct provider tokens in env vars.

## 1) Set Environment Variables

In `router/server/.env` (or your shell):

```bash
NANGO_BASE_URL=https://api.nango.dev
NANGO_SECRET_KEY=your_nango_secret_key
NANGO_MCP_CONNECTIONS_JSON={"com.mintmcp/gmail":{"provider_config_key":"google-mail","connection_id":"default"},"com.notion/mcp":{"provider_config_key":"notion","connection_id":"workspace_prod"},"ai.smithery/smithery-ai-slack":{"provider_config_key":"slack","connection_id":"team_main"}}
```

## 2) Complete OAuth Once In Nango

For each `provider_config_key` + `connection_id` pair in your JSON map:

1. Start/connect the integration in Nango UI.
2. Complete OAuth consent in browser.
3. Confirm connection is healthy in Nango.

After this, Wisp fetches access tokens from Nango on each MCP call/extraction.

## 3) Retest MCP Extraction

```bash
cd router/server
uv run python extract_tools.py --query gmail --clean --limit 5
uv run python extract_tools.py --query notion --clean --limit 5
```

## 4) Retest Runtime Tool Calls

Call Wisp router `POST /call` for a mapped server. Token injection happens automatically.

## Notes

- If a mapped server returns `401`, check Nango connection status first.
- If mapping is missing for a server, Wisp will use existing DB headers only.
- For self-hosted stdio connectors, required local env vars still apply unless you switch to a remote MCP endpoint.

## Direct OAuth (No Nango) Fallback

Wisp also supports direct token injection from env vars:

- `com.mintmcp/gmail`: `GOOGLE_ACCESS_TOKEN`
- `com.notion/mcp`: `NOTION_ACCESS_TOKEN` or `NOTION_API_KEY`
- `ai.smithery/smithery-ai-slack`: `SLACK_BOT_TOKEN` or `SLACK_USER_TOKEN`
- `com.stripe/mcp`: `STRIPE_SECRET_KEY` or `STRIPE_API_KEY`
- `com.atlassian/atlassian-mcp-server`: `ATLASSIAN_ACCESS_TOKEN`
- `app.linear/linear`: `LINEAR_ACCESS_TOKEN` or `LINEAR_API_KEY`

For Gmail stdio connectors (`io.github.domdomegg/gmail-mcp`), set:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Wisp will auto-refresh and inject `GOOGLE_ACCESS_TOKEN` at runtime/extraction.
