import { action, mutation, query, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// --- System prompt (ported from server/main.py) ---

const SYSTEM_PROMPT = `You are an automation builder for Wisp, a tool gateway with 2000+ MCP tools.
Your job is to build reusable automations by finding tools, EXECUTING them live to verify they work, and iterating until the user's automation is fully functional. Do NOT just plan — actually do the work.

IMPORTANT BEHAVIOR:
- Every user message is a request to BUILD an automation — not a general question.
- Always make forward progress: search for tools, test them, and build the workflow.
- If you need critical information from the user (e.g. specific credentials, account details, or ambiguous requirements), you may ask — but ONLY after you have already searched for tools and started building. Never lead with questions.
- Use reasonable defaults and placeholder values where possible — these become configurable parameters the user can change later.
- Your goal is a working, tested automation pipeline — not a plan or a conversation.

WORKFLOW:
1. If the task involves an OAuth service (Gmail, GitHub, Slack, Google Calendar, etc.), use search_composio_tools FIRST to find Composio actions
2. For other capabilities, search for tools using search_tools
3. List server tools with list_server_tools to discover related tools
4. EXECUTE tools with execute_tool to test them and do real work
5. Check results, adjust arguments, retry if needed
6. Keep iterating until the automation is FULLY WORKING
7. If you are blocked on user-specific info (API keys, account names, etc.), ask the user and STOP — do not guess sensitive values
8. When finished, respond with a summary of what the automation does and what was tested
9. If any tool returns action_required/requires_user_action (for example OAuth connect), STOP immediately and wait for the user's next message after they complete the action.

TOOL SEARCH RULES:
- Search for each distinct capability exactly once. Do not rephrase and retry the same search.
- Use list_server_tools after finding a promising tool to discover sibling tools on the same server.

WEB DATA & SEARCH (prefer search/fetch over scraping):
- For finding information, data, or content from the web, ALWAYS prefer search and fetch tools first:
  1. Use search_tools to find search APIs (Exa, Brave Search, Google Search, Tavily, etc.) — these return structured, reliable results.
  2. Use search_tools to find fetch/read tools (website readers, URL fetchers, content extractors) — these cleanly extract page content.
  3. Only use browser_use_run as a LAST RESORT when no search or fetch tool can accomplish the task (e.g., interactive forms, login-gated pages, screenshots).
- Do NOT default to "scrape website" or "crawl" when a search or fetch tool exists — search/fetch tools are faster, cheaper, and more reliable.
- Do NOT just assume data is unavailable; the registry has 2000+ tools including powerful search and data retrieval APIs.

COMPOSIO (OAuth Apps) — ALWAYS PREFER FOR AUTH-BASED SERVICES:
- For services that require user authentication (Gmail, Google Calendar, Google Drive, Google Sheets, GitHub, Slack, Notion, Discord, Trello, Asana, Jira, Salesforce, HubSpot, Outlook, LinkedIn, Twitter/X, Spotify, Dropbox, etc.), ALWAYS use search_composio_tools FIRST.
- Composio tools handle OAuth automatically — the user has already connected their accounts. No API keys or credentials needed.
- Use search_composio_tools with the app name (e.g. "GMAIL", "GITHUB", "SLACK") to discover available actions. Then use execute_tool with server_name set to the app name (e.g. "GMAIL") and tool_name set to the Composio action name.
- If execution returns an action_required response with a connect URL, ask the user to complete the OAuth link, then retry the same tool call.
- Only fall back to generic MCP tools (via search_tools) if Composio does not have the app or returns no results.

TOOL EXECUTION STRATEGY:
- PREFER Composio tools for any OAuth/authenticated service (see above).
- PREFER MCP tools via execute_tool whenever possible — they are faster, cheaper, and more reliable than browser automation.
- Search the registry thoroughly before falling back to browser_use. There are 2000+ tools covering APIs for search, scraping, data fetching, social media, finance, email, and more.
- Only use browser_use_run when the task genuinely requires interactive browser automation (e.g. logging into a site, filling forms, taking screenshots, or when no suitable MCP tool exists).

EXECUTE_TOOL:
- Use execute_tool to run MCP tools (non-browser). Do NOT use execute_tool for browser tasks.

TEXT-TO-SPEECH:
- Use text_to_speech to convert any text into spoken audio. Returns an audio URL.
- Use for: voiceovers, narration, reading content aloud, spoken translations, accessibility.
- If the user asks to "say", "speak", "read aloud", "narrate", or anything audio-related, use this tool.

BROWSER TASKS (last resort):
- Only use browser_use_run when MCP tools cannot accomplish the task.
- browser_use_run launches a cloud browser session. It returns a session_id and liveUrl.
- After calling browser_use_run, call browser_use_status with the session_id.
- NEVER call browser_use_run more than once per task.
- Rewrite and optimize the user's request into a detailed, step-by-step browser instruction prompt.

DO NOT output a JSON DAG. Just work through the task step by step using the tools available.
When you're done, summarize what was accomplished and whether it succeeded.`;

// --- Agent tool definitions (for Claude/Gemini function calling) ---

const AGENT_TOOLS = [
  {
    name: "search_tools",
    description: "Search Wisp for MCP tools matching a query. For OAuth services (Gmail, GitHub, Slack, etc.), results include Composio tools that handle auth automatically — prefer those.",
    input_schema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "list_server_tools",
    description: "List ALL tools available on a specific MCP server.",
    input_schema: {
      type: "object",
      properties: {
        server_name: {
          type: "string",
          description: "The server name (e.g. 'com.browser-use/mcp')",
        },
      },
      required: ["server_name"],
    },
  },
  {
    name: "search_composio_tools",
    description:
      "Search for Composio tools for an OAuth app (Gmail, GitHub, Slack, Google Calendar, Google Drive, Notion, Discord, Trello, Jira, Salesforce, HubSpot, Outlook, LinkedIn, Twitter, Spotify, Dropbox, etc.). Composio handles OAuth automatically — no API keys needed. ALWAYS use this for auth-based services instead of generic MCP tools.",
    input_schema: {
      type: "object",
      properties: {
        app_name: {
          type: "string",
          description:
            "The app name (e.g. 'GMAIL', 'GITHUB', 'SLACK', 'GOOGLECALENDAR', 'GOOGLEDRIVE', 'NOTION')",
        },
        use_case: {
          type: "string",
          description:
            "Optional: describe what you want to do (e.g. 'send email', 'create issue', 'list messages')",
        },
      },
      required: ["app_name"],
    },
  },
  {
    name: "search_servers",
    description: "Search for MCP servers by name or description.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (e.g. 'github', 'slack', 'browser')",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "execute_tool",
    description:
      "Execute an MCP tool and get its result. Do NOT use for browser tasks.",
    input_schema: {
      type: "object",
      properties: {
        server_name: { type: "string", description: "The MCP server name" },
        tool_name: { type: "string", description: "The tool to execute" },
        arguments: {
          type: "object",
          description: "Arguments to pass to the tool",
        },
      },
      required: ["server_name", "tool_name"],
    },
  },
  {
    name: "browser_use_run",
    description:
      "Launch a browser automation task. Returns session_id and live_url.",
    input_schema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "Detailed step-by-step browser instructions.",
        },
        session_id: {
          type: "string",
          description: "Optional: reuse an existing idle session.",
        },
      },
      required: ["task"],
    },
  },
  {
    name: "browser_use_status",
    description: "Get the status of a browser_use session.",
    input_schema: {
      type: "object",
      properties: {
        session_id: {
          type: "string",
          description: "The session ID from browser_use_run",
        },
      },
      required: ["session_id"],
    },
  },
  {
    name: "text_to_speech",
    description:
      "Convert text to speech audio using MiniMax TTS. Returns an audio URL. Use for voiceovers, narration, reading content aloud, or any audio output.",
    input_schema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to convert to speech (max 10000 chars)",
        },
        voice_id: {
          type: "string",
          description:
            "Voice to use. Options: English_expressive_narrator (default), English_radiant_girl, English_magnetic_voiced_man, English_CalmWoman, English_Trustworth_Man, English_Comedian, English_ConfidentWoman",
        },
        speed: {
          type: "number",
          description: "Speech speed 0.5-2.0 (default 1.0)",
        },
        emotion: {
          type: "string",
          description:
            "Emotion: neutral (default), happy, sad, angry, calm, surprised",
        },
      },
      required: ["text"],
    },
  },
];

const OAUTH_APP_KEYWORDS: Array<{ key: string; tokens: string[] }> = [
  { key: "GMAIL", tokens: ["gmail"] },
  { key: "GITHUB", tokens: ["github"] },
  { key: "SLACK", tokens: ["slack"] },
  { key: "NOTION", tokens: ["notion"] },
  { key: "LINEAR", tokens: ["linear"] },
  { key: "GOOGLECALENDAR", tokens: ["google calendar", "gcal", "calendar"] },
  { key: "GOOGLEDRIVE", tokens: ["google drive", "gdrive", "drive"] },
  { key: "GOOGLESHEETS", tokens: ["google sheets", "gsheets", "sheets"] },
  { key: "OUTLOOK", tokens: ["outlook"] },
  { key: "DISCORD", tokens: ["discord"] },
  { key: "TRELLO", tokens: ["trello"] },
  { key: "ASANA", tokens: ["asana"] },
  { key: "JIRA", tokens: ["jira"] },
  { key: "SALESFORCE", tokens: ["salesforce"] },
  { key: "HUBSPOT", tokens: ["hubspot"] },
  { key: "LINKEDIN", tokens: ["linkedin"] },
  { key: "TWITTER", tokens: ["twitter", "x.com"] },
  { key: "SPOTIFY", tokens: ["spotify"] },
  { key: "DROPBOX", tokens: ["dropbox"] },
];

// --- Planning event writer ---

export const writePlanningEvent = internalMutation({
  args: {
    sessionId: v.string(),
    workflowId: v.optional(v.id("workflows")),
    event: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("planningEvents", {
      sessionId: args.sessionId,
      workflowId: args.workflowId,
      event: args.event,
      createdAt: Date.now(),
    });
  },
});

// --- Read planning events (frontend subscription) ---

export const getPlanningEvents = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("planningEvents")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
  },
});

// --- Start planning action ---

export const startPlanning = action({
  args: {
    prompt: v.string(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const sessionId =
      args.sessionId ?? Math.random().toString(36).slice(2, 10);

    // Emit session_init
    await ctx.runMutation(internal.planning.writePlanningEvent, {
      sessionId,
      event: { type: "session_init", session_id: sessionId },
    });

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY not set");

    const mcpProxyUrl = process.env.MCP_PROXY_URL;
    const browserUseApiKey = process.env.BROWSER_USE_API_KEY;
    const browserUseApi = "https://api.browser-use.com/api/v3";

    const maxTurns = 30;
    const automationPrefix =
      `[AUTOMATION REQUEST] Build a reusable automation for the following. ` +
      `Start by searching for relevant tools and testing them immediately. ` +
      `Ask the user only if you are truly blocked on critical info, otherwise use defaults. ` +
      `The user's request:\n\n`;
    const messages: Array<any> = [
      { role: "user", content: automationPrefix + args.prompt },
    ];

    await ctx.runMutation(internal.planning.writePlanningEvent, {
      sessionId,
      event: { type: "planning_start", max_turns: maxTurns },
    });

    const callCache = new Map<string, string>();
    const executedSteps: Array<Record<string, unknown>> = [];
    const userId = identity.subject.split("|")[0] as Id<"users">;
    const saveSessionMessages = async () => {
      await ctx.runMutation(internal.planning.saveChatSession, {
        userId,
        sessionId,
        messages,
      });
    };
    const pauseForUserAction = async (action: { action_message: string; action_url?: string; app?: string }) => {
      await ctx.runMutation(internal.planning.writePlanningEvent, {
        sessionId,
        event: {
          type: "user_action_required",
          message: action.action_message,
          action_url: action.action_url,
          app: action.app,
        },
      });
      await saveSessionMessages();
      return {
        sessionId,
        executedSteps,
        status: "waiting_input",
        waitingForUserAction: true,
        actionRequired: action,
      };
    };

    for (let turn = 0; turn < maxTurns; turn++) {
      await ctx.runMutation(internal.planning.writePlanningEvent, {
        sessionId,
        event: {
          type: "llm_call_start",
          turn: turn + 1,
          max_turns: maxTurns,
        },
      });

      // Call Gemini OpenAI API
      const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${geminiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          tools: AGENT_TOOLS.map((t) => ({
            type: "function",
            function: {
              name: t.name,
              description: t.description,
              parameters: t.input_schema,
            }
          })),
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        await ctx.runMutation(internal.planning.writePlanningEvent, {
          sessionId,
          event: {
            type: "planning_error",
            message: `API error: ${resp.status} ${errText}`,
          },
        });
        return { sessionId };
      }

      const data = await resp.json();
      const message = data.choices[0].message;
      const stopReason = data.choices[0].finish_reason;
      const text = message.content || "";
      const toolCalls = message.tool_calls || [];

      await ctx.runMutation(internal.planning.writePlanningEvent, {
        sessionId,
        event: {
          type: "llm_call_complete",
          turn: turn + 1,
          stop_reason: stopReason,
          has_tool_calls: toolCalls.length > 0,
          text_preview: text.slice(0, 200),
        },
      });

      if (text.trim()) {
        await ctx.runMutation(internal.planning.writePlanningEvent, {
          sessionId,
          event: { type: "planning_thinking", text },
        });
      }

      messages.push(message);

      if (toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          const name = toolCall.function.name;
          let inp: any = {};
          try {
            inp = JSON.parse(toolCall.function.arguments || "{}");
          } catch (e) { }
          const cacheKey = `${name}:${JSON.stringify(inp)}`;

          if (callCache.has(cacheKey)) {
            const cachedContent = callCache.get(cacheKey)!;
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: name,
              content: cachedContent,
            });
            try {
              const parsed = JSON.parse(cachedContent);
              const action = detectUserActionRequired(parsed);
              if (action) {
                return await pauseForUserAction(action);
              }
            } catch {
              // Cached output may be non-JSON text.
            }
            continue;
          }

          const t0 = Date.now();
          let result: any;

          if (name === "search_tools") {
            const q = inp.query || "";
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: { type: "tool_search_start", query: q },
            });
            const oauthApp = detectOAuthAppFromText(q);
            if (oauthApp) {
              const ensure = await ctx.runAction(
                internal.composio.ensureConnectionForApp,
                { userId, appName: oauthApp }
              );
              const ensureAction = detectUserActionRequired(ensure);
              if (ensureAction) {
                return await pauseForUserAction(ensureAction);
              }
              // Force OAuth services through Composio-first discovery to avoid generic MCP detours.
              try {
                result = await ctx.runAction(internal.composio.searchComposioTools, {
                  appName: oauthApp,
                  useCase: q,
                  limit: 15,
                });
              } catch (e: any) {
                result = { error: e.message };
              }
            } else {
              result = await ctx.runAction(api.registry.searchTools, {
                query: q,
                limit: 5,
              });
              if (Array.isArray(result)) {
                result = result.map((t: any) => {
                  try {
                    return { ...t, input_schema: JSON.parse(t.input_schema) };
                  } catch {
                    return t;
                  }
                });
              }
            }
            const elapsed = (Date.now() - t0) / 1000;
            const resultList = Array.isArray(result) ? result : [];
            const toolNames = resultList.map((t: any) => t.tool_name || "");
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_search_complete",
                query: q,
                count: resultList.length,
                tool_names: toolNames,
                elapsed,
              },
            });
          } else if (name === "list_server_tools") {
            const sn = inp.server_name || "";
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: { type: "tool_search_start", query: `[list] ${sn}` },
            });
            const composioApp = await ctx.runQuery(
              internal.composio.resolveComposioApp,
              { serverName: sn }
            );
            if (composioApp) {
              const ensure = await ctx.runAction(
                internal.composio.ensureConnectionForApp,
                { userId, appName: composioApp }
              );
              const ensureAction = detectUserActionRequired(ensure);
              if (ensureAction) {
                return await pauseForUserAction(ensureAction);
              }
              try {
                result = await ctx.runAction(internal.composio.searchComposioTools, {
                  appName: composioApp,
                  limit: 25,
                });
              } catch (e: any) {
                result = { error: e.message };
              }
            } else {
              result = await ctx.runQuery(api.registry.getToolsForServer, {
                serverName: sn,
              });
              if (Array.isArray(result)) {
                result = result.map((t: any) => {
                  try {
                    return { ...t, input_schema: JSON.parse(t.input_schema) };
                  } catch {
                    return t;
                  }
                });
              }
            }
            const elapsed = (Date.now() - t0) / 1000;
            const resultList = Array.isArray(result) ? result : [];
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_search_complete",
                query: `[list] ${sn}`,
                count: resultList.length,
                tool_names: resultList.map((t: any) => t.tool_name || ""),
                elapsed,
              },
            });
          } else if (name === "search_composio_tools") {
            const rawAppName = String(inp.app_name || "");
            const useCase = inp.use_case || undefined;
            const inferredAppName = detectOAuthAppFromText(
              `${rawAppName} ${useCase || ""}`
            );
            const appName = inferredAppName || rawAppName;
            const ensure = await ctx.runAction(
              internal.composio.ensureConnectionForApp,
              { userId, appName }
            );
            const ensureAction = detectUserActionRequired(ensure);
            if (ensureAction) {
              return await pauseForUserAction(ensureAction);
            }
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: { type: "tool_search_start", query: `[composio] ${appName}${useCase ? `: ${useCase}` : ""}` },
            });
            try {
              result = await ctx.runAction(internal.composio.searchComposioTools, {
                appName,
                useCase,
                limit: 15,
              });
            } catch (e: any) {
              result = { error: e.message };
            }
            const elapsed = (Date.now() - t0) / 1000;
            const toolNames = Array.isArray(result) ? result.map((t: any) => t.tool_name || "") : [];
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_search_complete",
                query: `[composio] ${appName}`,
                count: toolNames.length,
                tool_names: toolNames,
                elapsed,
              },
            });
          } else if (name === "search_servers") {
            const q = inp.query || "";
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_search_start",
                query: `[servers] ${q}`,
              },
            });
            result = await ctx.runQuery(api.registry.searchServers, {
              query: q,
              limit: 10,
            });
            const elapsed = (Date.now() - t0) / 1000;
            const resultList = Array.isArray(result) ? result : [];
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_search_complete",
                query: `[servers] ${q}`,
                count: resultList.length,
                tool_names: resultList.map((s: any) => s.name || ""),
                elapsed,
              },
            });
          } else if (name === "execute_tool") {
            const sn = inp.server_name || "";
            const tn = inp.tool_name || "";
            const toolArgs = inp.arguments || {};
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_exec_start",
                server_name: sn,
                tool_name: tn,
                arguments: toolArgs,
              },
            });

            try {
              // Check if Composio can handle this tool by app key/server mapping.
              const composioAppKey = await ctx.runQuery(
                internal.composio.resolveComposioApp,
                { serverName: sn }
              );
              const isComposioOAuthApp = Boolean(composioAppKey);

              if (isComposioOAuthApp) {
                const connectionState = await ctx.runAction(
                  internal.composio.ensureConnectionForApp,
                  {
                    userId,
                    appName: composioAppKey!,
                  }
                );
                const action = detectUserActionRequired(connectionState);
                if (action) {
                  return await pauseForUserAction(action);
                } else {
                result = await ctx.runAction(
                  internal.composio.executeComposioTool,
                  {
                    userId,
                    appName: composioAppKey!,
                    toolName: tn,
                    arguments: toolArgs,
                  }
                );
                }
              }

              // Fall back to MCP proxy only for non-Composio apps.
              if (!isComposioOAuthApp) {
                if (!mcpProxyUrl) throw new Error("MCP_PROXY_URL not set");

                // Look up connection info from Convex DB (proxy requires it)
                const connInfo = await ctx.runQuery(
                  internal.registry.getServerConnectionInfoInternal,
                  { serverName: sn }
                );
                console.log(`[execute_tool] ${sn}/${tn} connInfo=${connInfo ? connInfo.method : "null"}`);

                const proxyT0 = Date.now();
                const controller = new AbortController();
                const proxyTimeout = setTimeout(() => controller.abort(), 120000);
                try {
                  const callResp = await fetch(`${mcpProxyUrl}/call`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      server_name: sn,
                      tool_name: tn,
                      arguments: toolArgs,
                      connection_info: connInfo,
                    }),
                    signal: controller.signal,
                  });
                  clearTimeout(proxyTimeout);
                  const proxyElapsed = ((Date.now() - proxyT0) / 1000).toFixed(1);
                  console.log(`[execute_tool] ${sn}/${tn} proxy responded ${callResp.status} in ${proxyElapsed}s`);
                  result = await callResp.json();
                  if (callResp.status >= 400) {
                    console.log(`[execute_tool] ${sn}/${tn} error:`, JSON.stringify(result).slice(0, 300));
                  }
                  result = normalizeMcpResult(result);
                } catch (fetchErr: any) {
                  clearTimeout(proxyTimeout);
                  const proxyElapsed = ((Date.now() - proxyT0) / 1000).toFixed(1);
                  if (fetchErr.name === "AbortError") {
                    console.log(`[execute_tool] ${sn}/${tn} timed out after ${proxyElapsed}s`);
                    result = { error: `Tool execution timed out after 45s. The MCP server may need a cold start — try again.` };
                  } else {
                    console.log(`[execute_tool] ${sn}/${tn} fetch error: ${fetchErr.message}`);
                    result = { error: fetchErr.message };
                  }
                }
              }

              const elapsed = (Date.now() - t0) / 1000;
              executedSteps.push({
                server_name: sn,
                tool_name: tn,
                arguments: toolArgs,
                result,
                elapsed,
              });
              await ctx.runMutation(internal.planning.writePlanningEvent, {
                sessionId,
                event: {
                  type: "tool_exec_complete",
                  server_name: sn,
                  tool_name: tn,
                  result,
                  elapsed,
                  success: true,
                },
              });
            } catch (e: any) {
              const elapsed = (Date.now() - t0) / 1000;
              result = { error: e.message };
              await ctx.runMutation(internal.planning.writePlanningEvent, {
                sessionId,
                event: {
                  type: "tool_exec_complete",
                  server_name: sn,
                  tool_name: tn,
                  result,
                  elapsed,
                  success: false,
                },
              });
            }
          } else if (name === "browser_use_run") {
            const task = inp.task || "";
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_exec_start",
                server_name: "browser-use",
                tool_name: "run",
                arguments: { task: task.slice(0, 120) },
              },
            });
            try {
              const buResp = await fetch(`${browserUseApi}/sessions`, {
                method: "POST",
                headers: {
                  "X-Browser-Use-API-Key": browserUseApiKey || "",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ task, model: "bu-mini" }),
              });
              result = await buResp.json();
              const elapsed = (Date.now() - t0) / 1000;
              await ctx.runMutation(internal.planning.writePlanningEvent, {
                sessionId,
                event: {
                  type: "tool_exec_complete",
                  server_name: "browser-use",
                  tool_name: "run",
                  result,
                  elapsed,
                  success: true,
                },
              });
            } catch (e: any) {
              result = { error: e.message };
              await ctx.runMutation(internal.planning.writePlanningEvent, {
                sessionId,
                event: {
                  type: "tool_exec_complete",
                  server_name: "browser-use",
                  tool_name: "run",
                  result,
                  elapsed: (Date.now() - t0) / 1000,
                  success: false,
                },
              });
            }
          } else if (name === "browser_use_status") {
            const sid = inp.session_id || "";
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_exec_start",
                server_name: "browser-use",
                tool_name: "status",
                arguments: { session_id: sid },
              },
            });
            try {
              // Poll until done
              let pollResult: any;
              for (let poll = 0; poll < 120; poll++) {
                const statusResp = await fetch(
                  `${browserUseApi}/sessions/${sid}`,
                  {
                    headers: {
                      "X-Browser-Use-API-Key": browserUseApiKey || "",
                    },
                  }
                );
                pollResult = await statusResp.json();
                const status = pollResult?.status || "";
                if (
                  [
                    "stopped",
                    "error",
                    "timed_out",
                    "idle",
                    "completed",
                  ].includes(status)
                ) {
                  break;
                }
                await new Promise((resolve) => setTimeout(resolve, 10000));
              }
              result = pollResult;
              await ctx.runMutation(internal.planning.writePlanningEvent, {
                sessionId,
                event: {
                  type: "tool_exec_complete",
                  server_name: "browser-use",
                  tool_name: "status",
                  result,
                  elapsed: (Date.now() - t0) / 1000,
                  success: true,
                },
              });
            } catch (e: any) {
              result = { error: e.message };
              await ctx.runMutation(internal.planning.writePlanningEvent, {
                sessionId,
                event: {
                  type: "tool_exec_complete",
                  server_name: "browser-use",
                  tool_name: "status",
                  result,
                  elapsed: (Date.now() - t0) / 1000,
                  success: false,
                },
              });
            }
          } else if (name === "text_to_speech") {
            const text = (inp.text || "").slice(0, 10000);
            const voiceId = inp.voice_id || "English_expressive_narrator";
            const speed = inp.speed || 1.0;
            const emotion = inp.emotion || "neutral";
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_exec_start",
                server_name: "minimax",
                tool_name: "text_to_speech",
                arguments: { text: text.slice(0, 80) + "...", voice_id: voiceId },
              },
            });
            try {
              const minimaxKey = process.env.MINIMAX_API_KEY;
              const minimaxHost = process.env.MINIMAX_API_HOST || "https://api.minimax.io";
              const minimaxGroup = process.env.MINIMAX_GROUP_ID || "";
              if (!minimaxKey) throw new Error("MINIMAX_API_KEY not set");

              let ttsUrl = `${minimaxHost}/v1/t2a_v2`;
              if (minimaxGroup) ttsUrl += `?GroupId=${minimaxGroup}`;

              const ttsResp = await fetch(ttsUrl, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${minimaxKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "speech-02-hd",
                  text,
                  stream: false,
                  voice_setting: { voice_id: voiceId, speed, vol: 1.0, pitch: 0, emotion },
                  audio_setting: { format: "mp3", sample_rate: 32000, bitrate: 128000, channel: 1 },
                }),
              });
              const ttsData = await ttsResp.json();
              if (ttsData.base_resp?.status_code !== 0) {
                throw new Error(ttsData.base_resp?.status_msg || "TTS failed");
              }
              const audioHex = ttsData.data?.audio || "";
              if (!audioHex) throw new Error("No audio data returned");

              // Store audio in Convex storage
              const audioBytes = new Uint8Array(audioHex.match(/.{1,2}/g)!.map((b: string) => parseInt(b, 16)));
              const blob = new Blob([audioBytes], { type: "audio/mpeg" });
              const storageId = await ctx.storage.store(blob);
              const audioUrl = await ctx.storage.getUrl(storageId);

              result = { audio_url: audioUrl, voice_id: voiceId, size_bytes: audioBytes.length, text_length: text.length };
              const elapsed = (Date.now() - t0) / 1000;
              await ctx.runMutation(internal.planning.writePlanningEvent, {
                sessionId,
                event: {
                  type: "tool_exec_complete",
                  server_name: "minimax",
                  tool_name: "text_to_speech",
                  result,
                  elapsed,
                  success: true,
                },
              });
            } catch (e: any) {
              result = { error: e.message };
              await ctx.runMutation(internal.planning.writePlanningEvent, {
                sessionId,
                event: {
                  type: "tool_exec_complete",
                  server_name: "minimax",
                  tool_name: "text_to_speech",
                  result,
                  elapsed: (Date.now() - t0) / 1000,
                  success: false,
                },
              });
            }
          } else {
            result = { error: `Unknown tool: ${name}` };
          }

          const contentStr = JSON.stringify(result);
          callCache.set(cacheKey, contentStr);
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: name,
            content: contentStr,
          });

          const action = detectUserActionRequired(result);
          if (action) {
            return await pauseForUserAction(action);
          }
        }

        continue;
      }

      // No tool calls — agent is done

      if (text.trim()) {
        await ctx.runMutation(internal.planning.writePlanningEvent, {
          sessionId,
          event: {
            type: "agent_done",
            text,
            executed_steps: executedSteps,
          },
        });
      } else {
        await ctx.runMutation(internal.planning.writePlanningEvent, {
          sessionId,
          event: {
            type: "planning_error",
            message: "No response from model.",
          },
        });
      }

      // Save session messages
      await saveSessionMessages();

      return { sessionId, executedSteps };
    }

    // Max turns reached
    await ctx.runMutation(internal.planning.writePlanningEvent, {
      sessionId,
      event: {
        type: "agent_done",
        text: "Reached max iterations.",
        executed_steps: executedSteps,
      },
    });

    return { sessionId, executedSteps };
  },
});

// Save chat session for continuation
export const saveChatSession = internalMutation({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    // Check if session already exists
    const existing = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const match = existing.find(
      (s: any) =>
        // Simple check: look for matching session in planning events
        true
    );

    await ctx.db.insert("chatSessions", {
      userId: args.userId,
      messages: args.messages,
      createdAt: Date.now(),
    });
  },
});

// --- Helpers ---

function normalizeMcpResult(result: any): any {
  if (!result || typeof result !== "object") return result;
  const content = result.content;
  if (Array.isArray(content) && content.length > 0) {
    const item = content[0];
    if (item && typeof item === "object" && item.type === "text") {
      const text = item.text || "";
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
  }
  return result;
}

function detectOAuthAppFromText(query: string): string | null {
  const q = query.toLowerCase();
  for (const entry of OAUTH_APP_KEYWORDS) {
    if (entry.tokens.some((token) => q.includes(token))) {
      return entry.key;
    }
  }
  return null;
}

function detectUserActionRequired(
  value: any
): { action_required: boolean; action_message: string; action_url?: string; app?: string } | null {
  if (!value || typeof value !== "object") return null;
  if (!(value.action_required || value.requires_user_action || value.requires_human_input)) {
    return null;
  }

  const actionUrl =
    value.action_url ||
    value.redirect_url ||
    value.redirectUrl ||
    value.connect_url ||
    undefined;

  return {
    action_required: true,
    action_message:
      value.action_message ||
      value.message ||
      value.error ||
      "User action is required before continuing.",
    action_url: typeof actionUrl === "string" ? actionUrl : undefined,
    app: typeof value.app === "string" ? value.app : undefined,
  };
}
