import { action, mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// --- Types ---

interface DAGNode {
  id: string;
  step: string;
  server_name: string;
  tool_name: string;
  arguments: any;
  depends_on: string[];
  output_key: string;
}

// --- Execution event writer ---

export const writeExecutionEvent = internalMutation({
  args: {
    workflowId: v.id("workflows"),
    nodeId: v.optional(v.string()),
    event: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("executionEvents", {
      workflowId: args.workflowId,
      nodeId: args.nodeId,
      event: args.event,
      createdAt: Date.now(),
    });
  },
});

// --- Read execution events (frontend subscription) ---

export const getExecutionEvents = query({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("executionEvents")
      .withIndex("by_workflow", (q) => q.eq("workflowId", args.workflowId))
      .order("asc")
      .collect();
  },
});

// --- Topological sort into levels ---

function topoLevels(nodes: DAGNode[]): DAGNode[][] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const inDeg = new Map<string, number>();
  for (const n of nodes) {
    inDeg.set(
      n.id,
      n.depends_on.filter((d) => nodeMap.has(d)).length
    );
  }
  const levels: DAGNode[][] = [];
  const remaining = new Set(inDeg.keys());
  while (remaining.size > 0) {
    const level = [...remaining].filter((id) => (inDeg.get(id) ?? 0) === 0);
    if (level.length === 0) throw new Error("Cycle in DAG");
    levels.push(level.map((id) => nodeMap.get(id)!));
    for (const id of level) {
      remaining.delete(id);
      for (const n of nodes) {
        if (n.depends_on.includes(id) && remaining.has(n.id)) {
          inDeg.set(n.id, (inDeg.get(n.id) ?? 0) - 1);
        }
      }
    }
  }
  return levels;
}

// --- Resolve output references ---

function resolve(value: any, outputs: Record<string, any>): any {
  if (typeof value === "string") {
    return value.replace(/\{\{([\w.]+)\}\}/g, (_match, path: string) => {
      const parts = path.split(".");
      const root = parts[0];
      if (!(root in outputs)) return `{{${path}}}`;
      let obj = outputs[root];
      for (const part of parts.slice(1)) {
        if (obj && typeof obj === "object") {
          obj = obj[part];
        } else {
          return `{{${path}}}`;
        }
      }
      return typeof obj === "string" ? obj : JSON.stringify(obj);
    });
  }
  if (Array.isArray(value)) return value.map((v) => resolve(v, outputs));
  if (value && typeof value === "object") {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = resolve(v, outputs);
    }
    return result;
  }
  return value;
}

// --- Apply saved credentials ---

async function applySavedCredentials(
  ctx: any,
  userId: Id<"users">,
  node: DAGNode,
  args: Record<string, any>
): Promise<Record<string, any>> {
  const candidateKeys = [
    node.server_name.trim().toLowerCase(),
    node.tool_name.trim().toLowerCase(),
    `${node.server_name}:${node.tool_name}`.trim().toLowerCase(),
  ];

  let profile: any = null;
  for (const key of candidateKeys) {
    profile = await ctx.runQuery(internal.credentials.getForApp, {
      userId,
      appId: key,
    });
    if (profile) break;
  }

  if (!profile) return args;

  const credValues: Record<string, string> = {};
  if (profile.username) credValues.username = profile.username;
  if (profile.email) credValues.email = profile.email;
  if (profile.password) credValues.password = profile.password;
  if (profile.apiKey) credValues.api_key = profile.apiKey;
  if (profile.token) credValues.token = profile.token;

  if (Object.keys(credValues).length === 0) return args;

  const merged = { ...args };
  for (const [key, value] of Object.entries(credValues)) {
    const existing = merged[key];
    if (existing === undefined || existing === null || (typeof existing === "string" && !existing.trim())) {
      merged[key] = value;
    }
  }

  // Also inject into nested credentials object if present
  if (merged.credentials && typeof merged.credentials === "object") {
    const nested = { ...merged.credentials };
    for (const [key, value] of Object.entries(credValues)) {
      const existing = nested[key];
      if (existing === undefined || existing === null || (typeof existing === "string" && !existing.trim())) {
        nested[key] = value;
      }
    }
    merged.credentials = nested;
  }

  return merged;
}

// --- Normalize MCP result ---

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

// --- Action required detection ---

const ACTION_REQUIRED_KEYWORDS = [
  "captcha", "verify you are human", "complete login", "sign in",
  "log in", "2fa", "two-factor", "multi-factor", "approve in browser",
  "open the browser", "manual step", "manual intervention", "action required",
];

function flattenStrings(value: any): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => [
      ...flattenStrings(k),
      ...flattenStrings(v),
    ]);
  }
  return [];
}

function detectActionRequired(value: any): { action_required: boolean; action_message: string; action_url?: string } | null {
  if (value && typeof value === "object") {
    if (value.requires_user_action || value.requires_human_input || value.action_required) {
      const actionUrl =
        value.action_url ||
        value.redirect_url ||
        value.redirectUrl ||
        value.connect_url ||
        undefined;
      return {
        action_required: true,
        action_message: value.message || value.error || "Complete the required step in the browser.",
        action_url: typeof actionUrl === "string" ? actionUrl : undefined,
      };
    }
  }
  const combined = flattenStrings(value).map((s) => s.toLowerCase()).join(" ");
  if (ACTION_REQUIRED_KEYWORDS.some((kw) => combined.includes(kw))) {
    return {
      action_required: true,
      action_message: "Action required — check the browser or tool output.",
    };
  }
  return null;
}

// --- LLM execution for __llm__ nodes ---

async function execLlm(args: Record<string, any>): Promise<Record<string, any>> {
  const prompt = args.prompt || "";
  let inputData = args.input || "";
  if (typeof inputData === "object") inputData = JSON.stringify(inputData, null, 2);
  const userMsg = inputData ? `${prompt}\n\nInput:\n${inputData}` : prompt;

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return { error: "GEMINI_API_KEY not set" };

  const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${geminiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemini-3-flash-preview",
      max_tokens: 8192,
      messages: [{ role: "user", content: userMsg }],
    }),
  });

  if (!resp.ok) return { error: `Gemini API error: ${resp.status}` };

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content || "";
  return { result: text };
}

// --- Start execution action ---

export const startExecution = action({
  args: {
    workflowId: v.id("workflows"),
    browserUseMode: v.optional(v.string()),
    runtimeParams: v.optional(v.any()), // e.g. { "n1.query": "San Francisco" }
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject.split("|")[0] as Id<"users">;

    const workflow = await ctx.runQuery(api.workflows.get, {
      id: args.workflowId,
    });
    if (!workflow) throw new Error("Workflow not found");

    const mcpProxyUrl = process.env.MCP_PROXY_URL;
    const browserUseApiKey = process.env.BROWSER_USE_API_KEY;
    const browserUseApi = "https://api.browser-use.com/api/v3";

    // Update status
    await ctx.runMutation(api.workflows.updateStatus, {
      id: args.workflowId,
      status: "running",
    });

    let nodes: DAGNode[] = workflow.nodes;
    // Apply runtime overrides if provided
    if (args.runtimeParams && typeof args.runtimeParams === "object") {
      nodes = nodes.map(n => {
        const updatedArgs = { ...n.arguments };
        for (const [key, val] of Object.entries(args.runtimeParams!)) {
          if (key.startsWith(`${n.id}.`)) {
            const paramName = key.split(".")[1];
            if (paramName) updatedArgs[paramName] = val;
          }
        }
        return { ...n, arguments: updatedArgs };
      });
    }

    const levels = topoLevels(nodes);
    const outputs: Record<string, any> = {};
    const total = nodes.length;
    let done = 0;

    // Emit workflow_start
    await ctx.runMutation(internal.execution.writeExecutionEvent, {
      workflowId: args.workflowId,
      event: {
        type: "workflow_start",
        workflow_id: args.workflowId,
        total_nodes: total,
      },
    });

    for (let li = 0; li < levels.length; li++) {
      const level = levels[li];

      // Process each node in the level
      // Note: Convex actions can't do true parallelism with shared state,
      // so we execute sequentially within each level
      for (const node of level) {
        const resolvedArgs = resolve(node.arguments, outputs);
        const enrichedArgs =
          typeof resolvedArgs === "object" && resolvedArgs !== null
            ? await applySavedCredentials(ctx, userId, node, resolvedArgs)
            : resolvedArgs;

        // Emit node_start
        await ctx.runMutation(internal.execution.writeExecutionEvent, {
          workflowId: args.workflowId,
          nodeId: node.id,
          event: {
            type: "node_start",
            workflow_id: args.workflowId,
            node_id: node.id,
            data: {
              step: node.step,
              server_name: node.server_name,
              tool_name: node.tool_name,
              arguments: enrichedArgs,
              level: li,
              progress: done / total,
            },
          },
        });

        const t0 = Date.now();

        try {
          let result: any;

          if (node.server_name === "__input__") {
            // Input nodes: value is already patched by runtimeParams override above
            result = enrichedArgs?.value ?? enrichedArgs?.default ?? "";
          } else if (node.server_name === "__llm__") {
            result = await execLlm(enrichedArgs);
          } else if (node.server_name === "__browser_use__") {
            // Browser-Use API direct call
            const task =
              typeof enrichedArgs === "string"
                ? enrichedArgs
                : enrichedArgs?.task || enrichedArgs?.prompt || node.step;

            const buResp = await fetch(`${browserUseApi}/sessions`, {
              method: "POST",
              headers: {
                "X-Browser-Use-API-Key": browserUseApiKey || "",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ task, model: "bu-mini" }),
            });
            const buResult = await buResp.json();
            const sessionId = buResult.id || "";

            // Emit browser session info
            if (buResult.liveUrl) {
              await ctx.runMutation(internal.execution.writeExecutionEvent, {
                workflowId: args.workflowId,
                nodeId: node.id,
                event: {
                  type: "node_browser_session",
                  workflow_id: args.workflowId,
                  node_id: node.id,
                  data: {
                    session_id: sessionId,
                    live_url: buResult.liveUrl,
                  },
                },
              });
            }

            // Poll until done
            let pollResult = buResult;
            for (let poll = 0; poll < 120; poll++) {
              await new Promise((r) => setTimeout(r, 10000));
              const statusResp = await fetch(
                `${browserUseApi}/sessions/${sessionId}`,
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
            }

            result = {
              task,
              session_id: sessionId,
              live_url: buResult.liveUrl || pollResult?.liveUrl,
              output: pollResult?.output,
              status: pollResult?.status,
            };
          } else if (node.server_name === "__user_input__") {
            // For user input nodes, emit a credential request and wait
            // In Convex, we handle this differently — set status to waiting_input
            // and return. The frontend will call a separate mutation to continue.
            await ctx.runMutation(internal.execution.writeExecutionEvent, {
              workflowId: args.workflowId,
              nodeId: node.id,
              event: {
                type: "credential_request",
                workflow_id: args.workflowId,
                node_id: node.id,
                data: {
                  fields: enrichedArgs?.fields || [],
                  reason: enrichedArgs?.reason || "Credentials required",
                },
              },
            });

            // Update workflow status to waiting_input
            await ctx.runMutation(api.workflows.updateStatus, {
              id: args.workflowId,
              status: "waiting_input",
            });

            // We can't block in a Convex action, so we stop execution here.
            // The frontend should call a resume action after user submits credentials.
            return {
              status: "waiting_input",
              nodeId: node.id,
              workflowId: args.workflowId,
            };
          } else {
            // Check if Composio can handle this tool
            const composioApp = await ctx.runQuery(
              internal.composio.resolveComposioApp,
              { serverName: node.server_name }
            );
            const isComposioOAuthApp = Boolean(composioApp);

            if (isComposioOAuthApp) {
              const connectionState = await ctx.runAction(
                internal.composio.ensureConnectionForApp,
                {
                  userId,
                  appName: composioApp!,
                }
              );
              if (
                connectionState?.action_required ||
                connectionState?.requires_user_action
              ) {
                result = connectionState;
              } else {
                result = await ctx.runAction(
                  internal.composio.executeComposioTool,
                  {
                    userId,
                    appName: composioApp!,
                    toolName: node.tool_name,
                    arguments: enrichedArgs,
                  }
                );
              }
            }
            
            // Fall back to MCP proxy only for non-Composio apps.
            if (!isComposioOAuthApp) {
              if (!mcpProxyUrl) throw new Error("MCP_PROXY_URL not set");

              // Look up connection info from Convex DB (stateless proxy)
              const connInfo = await ctx.runQuery(
                internal.registry.getServerConnectionInfoInternal,
                { serverName: node.server_name }
              );

              const isLongRunning = ["monitor_task", "browser_task"].includes(
                node.tool_name
              );
              const timeout = isLongRunning ? 600000 : 120000;

              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), timeout);

              const callResp = await fetch(`${mcpProxyUrl}/call`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  server_name: node.server_name,
                  tool_name: node.tool_name,
                  arguments: enrichedArgs,
                  connection_info: connInfo,
                }),
                signal: controller.signal,
              });
              clearTimeout(timeoutId);
              result = normalizeMcpResult(await callResp.json());
            }
          }

          // Store output
          if (node.output_key) {
            outputs[node.output_key] = result;
          }
          done++;

          // Check for action required
          const actionInfo = detectActionRequired(result);

          // Truncate large results
          const resultStr = JSON.stringify(result);
          const finalResult =
            resultStr.length > 8000
              ? { _truncated: true, preview: resultStr.slice(0, 8000) }
              : result;

          const nodeData: any = {
            result: finalResult,
            elapsed: (Date.now() - t0) / 1000,
            progress: done / total,
          };
          if (actionInfo) Object.assign(nodeData, actionInfo);

          await ctx.runMutation(internal.execution.writeExecutionEvent, {
            workflowId: args.workflowId,
            nodeId: node.id,
            event: {
              type: "node_complete",
              workflow_id: args.workflowId,
              node_id: node.id,
              data: nodeData,
            },
          });

          if (actionInfo) {
            await ctx.runMutation(api.workflows.updateStatus, {
              id: args.workflowId,
              status: "waiting_input",
            });
            return {
              status: "waiting_input",
              nodeId: node.id,
              workflowId: args.workflowId,
              actionRequired: actionInfo,
            };
          }
        } catch (e: any) {
          done++;
          const errorText = e.message || String(e);
          const actionInfo = detectActionRequired(errorText);
          const nodeData: any = {
            error: errorText,
            progress: done / total,
          };
          if (actionInfo) Object.assign(nodeData, actionInfo);

          await ctx.runMutation(internal.execution.writeExecutionEvent, {
            workflowId: args.workflowId,
            nodeId: node.id,
            event: {
              type: "node_error",
              workflow_id: args.workflowId,
              node_id: node.id,
              data: nodeData,
            },
          });

          if (actionInfo) {
            await ctx.runMutation(api.workflows.updateStatus, {
              id: args.workflowId,
              status: "waiting_input",
            });
            return {
              status: "waiting_input",
              nodeId: node.id,
              workflowId: args.workflowId,
              actionRequired: actionInfo,
            };
          }
        }
      }
    }

    // Mark workflow complete
    await ctx.runMutation(api.workflows.updateStatus, {
      id: args.workflowId,
      status: "completed",
    });

    await ctx.runMutation(internal.execution.writeExecutionEvent, {
      workflowId: args.workflowId,
      event: {
        type: "workflow_complete",
        workflow_id: args.workflowId,
        data: {
          outputs: Object.fromEntries(
            Object.entries(outputs).map(([k, v]) => [
              k,
              String(v).slice(0, 500),
            ])
          ),
        },
      },
    });

    return { status: "completed", workflowId: args.workflowId };
  },
});
