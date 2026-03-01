import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

/**
 * Continue planning by sending a follow-up message.
 * Re-uses the existing session.
 */
export const continueChat = action({
  args: {
    prompt: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.runAction(api.planning.startPlanning, {
      prompt: args.prompt,
      sessionId: args.sessionId,
    });
  },
});

/**
 * Draft a workflow conversion using Anthropic to parse the executed steps
 * and identify potential configurable parameters.
 */
export const draftWorkflowConversion = action({
  args: {
    name: v.string(),
    description: v.string(),
    executedSteps: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY not set");

    // Clean up executed steps for the prompt
    const stepsForPrompt = args.executedSteps.map((s, i) => ({
      index: i,
      server_name: s.server_name,
      tool_name: s.tool_name,
      arguments: s.arguments,
    }));

    const prompt = `Analyze these executed steps from an AI agent session and convert them into a reusable DAG workflow graph.

Objective: ${args.description}

Executed Steps:
${JSON.stringify(stepsForPrompt, null, 2)}

Instructions:
1. Name & Description: Generate a short, clear name (max 60 chars) and a 1-2 sentence description of what this workflow does. Focus on the purpose, not implementation details.
2. Filter: Drop any steps that are purely for formatting output (e.g. conversational LLM formatting steps at the very end). Keep only functional nodes that do real work, fetch data, or perform logical transformations.
3. Nodes: For each functional step, create a node object with:
   - id: e.g. "n1", "n2"
   - step: A brief human-readable title (e.g. "Search Google")
   - server_name: The server name
   - tool_name: The tool name
   - arguments: The arguments object
   - depends_on: Array of node ids this node depends on (based on data flow)
   - output_key: e.g. "r1", "r2"
4. Configurable Parameters: Analyze the nodes and suggest which arguments should be exposed to the user as adjustable inputs (e.g., search queries, URLs).
   For each suggested parameter, create an object with:
   - nodeId: the node it belongs to
   - paramKey: the argument key
   - label: a human-readable label
   - description: why this is configurable
   - defaultValue: the current value from the executed step
   - type: "string", "number", or "boolean"

Return EXACTLY a JSON object with this schema, and NOTHING ELSE:
{
  "name": "Short workflow name",
  "description": "1-2 sentence description of what this workflow does",
  "nodes": [...],
  "configurableParams": [...]
}`;

    const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${geminiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      throw new Error(`Gemini API error: ${resp.status} ${await resp.text()}`);
    }

    const data = await resp.json();
    const text = data.choices[0].message.content || "";

    let parsed;
    try {
      const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1].trim());
      } else {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start !== -1 && end > start) {
          parsed = JSON.parse(text.slice(start, end + 1));
        } else {
          parsed = JSON.parse(text.trim());
        }
      }
    } catch {
      // Fallback to naive linear mapping if JSON parsing fails
      const nodes = args.executedSteps.map((step: any, i: number) => ({
        id: `n${i + 1}`,
        step: `Step ${i + 1}: ${step.tool_name || ""}`,
        server_name: step.server_name || "",
        tool_name: step.tool_name || "",
        arguments: step.arguments || {},
        depends_on: i > 0 ? [`n${i}`] : [],
        output_key: `r${i + 1}`,
      }));
      return { nodes, configurableParams: [] };
    }

    return parsed;
  },
});

/**
 * Save the configured workflow to the database.
 */
export const saveWorkflow = action({
  args: {
    name: v.string(),
    description: v.string(),
    nodes: v.array(v.any()), // DAGNode[]
    configurableParams: v.array(v.any()), // ConfigurableParam[]
  },
  handler: async (ctx, args): Promise<{ workflowId: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const workflowId = await ctx.runMutation(api.workflows.create, {
      name: args.name || "Workflow",
      description: args.description,
      nodes: args.nodes,
      configurableParams: args.configurableParams,
    });

    return { workflowId: workflowId as string };
  },
});
