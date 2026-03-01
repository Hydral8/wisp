import { action, mutation, query, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// --- System prompt (ported from server/main.py) ---

const SYSTEM_PROMPT = `You are an agent for Wisp, a tool gateway with 2000+ MCP tools.
Your job is to iteratively find tools, EXECUTE them live, verify they work, and keep going until the user's task is fully complete. Do NOT just plan — actually do the work.

WORKFLOW:
1. Search for tools using search_tools
2. List server tools with list_server_tools to discover related tools
3. EXECUTE tools with execute_tool to test them and do real work
4. Check results, adjust arguments, retry if needed
5. Keep iterating until the task is FULLY DONE
6. When finished, respond with a summary of what was accomplished

TOOL SEARCH RULES:
- Search for each distinct capability exactly once. Do not rephrase and retry the same search.
- Use list_server_tools after finding a promising tool to discover sibling tools on the same server.

EXECUTE_TOOL:
- Use execute_tool to run MCP tools (non-browser). Do NOT use execute_tool for browser tasks.

BROWSER TASKS — USE browser_use_run DIRECTLY:
- For ANY task requiring a web browser, use the browser_use_run tool directly.
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
    description: "Search Wisp for MCP tools matching a query.",
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
    const messages: Array<any> = [
      { role: "user", content: args.prompt },
    ];

    await ctx.runMutation(internal.planning.writePlanningEvent, {
      sessionId,
      event: { type: "planning_start", max_turns: maxTurns },
    });

    const callCache = new Map<string, string>();
    const executedSteps: Array<Record<string, unknown>> = [];

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
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: name,
              content: callCache.get(cacheKey)!,
            });
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
            result = await ctx.runAction(api.registry.searchTools, {
              query: q,
              limit: 5,
            });
            const elapsed = (Date.now() - t0) / 1000;
            const toolNames = (result || []).map(
              (t: any) => t.tool_name || ""
            );
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_search_complete",
                query: q,
                count: (result || []).length,
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
            result = await ctx.runQuery(api.registry.getToolsForServer, {
              serverName: sn,
            });
            const elapsed = (Date.now() - t0) / 1000;
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_search_complete",
                query: `[list] ${sn}`,
                count: (result || []).length,
                tool_names: (result || []).map((t: any) => t.tool_name || ""),
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
            await ctx.runMutation(internal.planning.writePlanningEvent, {
              sessionId,
              event: {
                type: "tool_search_complete",
                query: `[servers] ${q}`,
                count: (result || []).length,
                tool_names: (result || []).map((s: any) => s.name || ""),
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
              // Check if Composio can handle this tool
              const composioApp = await ctx.runQuery(
                internal.composio.resolveComposioApp,
                { serverName: sn }
              );
              let usedComposio = false;

              if (composioApp) {
                const userId = identity.subject as Id<"users">;
                const connection = await ctx.runQuery(
                  internal.composio.getConnectionForProvider,
                  { userId, provider: composioApp }
                );
                if (connection?.status === "active") {
                  result = await ctx.runAction(
                    internal.composio.executeComposioTool,
                    {
                      userId,
                      appName: composioApp,
                      toolName: tn,
                      arguments: toolArgs,
                    }
                  );
                  usedComposio = true;
                }
              }

              // Fall back to MCP proxy
              if (!usedComposio) {
                if (!mcpProxyUrl) throw new Error("MCP_PROXY_URL not set");
                const callResp = await fetch(`${mcpProxyUrl}/call`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    server_name: sn,
                    tool_name: tn,
                    arguments: toolArgs,
                  }),
                });
                result = await callResp.json();
                result = normalizeMcpResult(result);
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
      const userId = identity.subject as Id<"users">;
      await ctx.runMutation(internal.planning.saveChatSession, {
        userId,
        sessionId,
        messages,
      });

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
