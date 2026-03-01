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
    sessionTrace: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY not set");

    // Include full step data with results and success/failure
    const stepsForPrompt = args.executedSteps.map((s: any, i: number) => {
      const resultStr = typeof s.result === "string" ? s.result : JSON.stringify(s.result);
      const hasError = s.result && typeof s.result === "object" && s.result.error;
      return {
        index: i,
        server_name: s.server_name,
        tool_name: s.tool_name,
        arguments: s.arguments,
        success: !hasError,
        result_preview: resultStr?.slice(0, 400) || "(empty)",
        elapsed: s.elapsed,
      };
    });

    const prompt = `You are converting an AI agent session into a reusable automation workflow (DAG graph).

## Agent Summary
${args.description}

## Session Trace (chronological: LLM thinking interleaved with tool calls)
${JSON.stringify(args.sessionTrace?.slice(0, 60) || [], null, 2)}

## Executed Tool Calls (with results)
${JSON.stringify(stepsForPrompt, null, 2)}

## Your Task

Convert this into a clean, reusable DAG workflow. Follow these rules EXACTLY:

### 1. FILTER — Remove bad nodes
- DROP any tool call where success=false or the result contains an error
- DROP any tool call whose result was empty, irrelevant, or not used by any later step
- DROP duplicate tool calls (same server+tool+args) — keep only the first successful one
- KEEP only the steps that actually contributed useful data toward the final output

### 2. LLM ANALYSIS NODES — Add __llm__ nodes
- When the agent's thinking shows it ANALYZING, COMPARING, SYNTHESIZING, or TRANSFORMING data from tool results into new insights, create an \`__llm__\` node for that step.
- These are nodes where: server_name = "__llm__", tool_name = "generate"
- The arguments should have a "prompt" key with a reusable instruction (not the agent's raw thinking — rewrite it as a clear prompt template that references input data via output_key names like "Use {{flight_results}} to...")
- These nodes MUST list the tool result nodes they analyze in depends_on
- Example: if the agent compared flight prices from two search results, add an __llm__ node that depends on both search nodes

### 3. DEPENDENCY WIRING — Connect the graph
- Wire depends_on based on actual data flow: if node B uses data from node A's result, B depends on A
- In arguments, when a value should come from a previous node's output, use that node's output_key as the value (e.g., if node n1 has output_key "flight_data", then a downstream node referencing that data should have the value "flight_data" in its arguments)
- Create a proper DAG — parallelizable nodes at the same level should NOT depend on each other

### 4. INPUT NODES — User-configurable values as DAG nodes
- Find arguments that represent user-specific values (origins, destinations, search queries, dates, URLs, account names, etc.)
- For EACH such value, create a dedicated \`__input__\` node at the START of the DAG:
  - server_name = "__input__", tool_name = "input"
  - arguments = { "value": "<current default value>", "default": "<current default value>" }
  - depends_on = [] (inputs are always roots)
  - output_key = a descriptive name like "origin_city", "search_query", etc.
- Then in the downstream node that previously had the hardcoded value, replace that argument's value with "{{output_key_of_input_node}}" so it references the input node's output
- Also create a matching configurableParam entry pointing at the input node

### 5. NAME & DESCRIPTION
- Generate a short, clear name (max 60 chars) describing the automation's purpose
- Write a 1-2 sentence description focused on what it does, not how

## Output Format

Return EXACTLY a JSON object with this schema and NOTHING ELSE (no markdown fences):
{
  "name": "Short workflow name",
  "description": "1-2 sentence description",
  "nodes": [
    {
      "id": "input_1",
      "step": "Origin City",
      "server_name": "__input__",
      "tool_name": "input",
      "arguments": { "value": "NYC", "default": "NYC" },
      "depends_on": [],
      "output_key": "origin_city"
    },
    {
      "id": "n1",
      "step": "Search flights",
      "server_name": "flights_server",
      "tool_name": "search",
      "arguments": { "origin": "{{origin_city}}", "destination": "{{destination_city}}" },
      "depends_on": ["input_1", "input_2"],
      "output_key": "flight_results"
    }
  ],
  "configurableParams": [
    {
      "nodeId": "input_1",
      "paramKey": "value",
      "label": "Origin City",
      "description": "The departure city",
      "defaultValue": "NYC",
      "type": "select",
      "options": ["NYC", "LAX", "SFO", "ORD", "ATL", "DFW", "BOS", "SEA", "MIA", "DEN"],
      "placeholder": "Choose departure city"
    },
    {
      "nodeId": "input_2",
      "paramKey": "value",
      "label": "Departure Date",
      "description": "When to depart",
      "defaultValue": "2026-03-15",
      "type": "date"
    }
  ]
}

### Type Inference Guide for configurableParams
Infer the most specific input type from context. Valid types: "string" | "number" | "boolean" | "date" | "select" | "url" | "email" | "textarea"
- Dates (departure date, deadline, start/end date) → "date"
- Airports, cities, countries, categories, or any fixed-set choice → "select" with an "options" array of common values
- URLs, links, website addresses → "url"
- Email addresses → "email"
- Long text, prompts, descriptions, message bodies → "textarea"
- On/off flags, toggles, yes/no → "boolean"
- Counts, amounts, numeric values → "number"
- Short free-text (names, queries, keywords) → "string"
- Always include "placeholder" with a short hint for the user (e.g. "Enter your email", "Pick a date")`;

    const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${geminiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 8192,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Gemini API error: ${resp.status} ${await resp.text()}`);
    }

    const data = await resp.json();
    const msg = data.choices?.[0]?.message;
    const text = msg?.content || "";

    // Log for debugging
    console.log("[draftWorkflowConversion] Gemini response length:", text.length);
    console.log("[draftWorkflowConversion] Gemini finish_reason:", data.choices?.[0]?.finish_reason);
    if (!text) {
      console.log("[draftWorkflowConversion] Empty content. Full message keys:", Object.keys(msg || {}));
    }

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
    } catch (e) {
      console.log("[draftWorkflowConversion] JSON parse failed:", (e as Error).message);
      console.log("[draftWorkflowConversion] Raw text preview:", text.slice(0, 500));
      // Fallback: naive linear mapping of successful steps only
      const nodes = args.executedSteps
        .filter((s: any) => !(s.result && typeof s.result === "object" && s.result.error))
        .map((step: any, i: number) => ({
          id: `n${i + 1}`,
          step: `${step.tool_name || "Step " + (i + 1)}`,
          server_name: step.server_name || "",
          tool_name: step.tool_name || "",
          arguments: step.arguments || {},
          depends_on: i > 0 ? [`n${i}`] : [],
          output_key: `r${i + 1}`,
        }));
      return { name: args.name, description: "", nodes, configurableParams: [] };
    }

    // Ensure all expected fields exist
    return {
      name: parsed.name || args.name,
      description: parsed.description || "",
      nodes: parsed.nodes || [],
      configurableParams: parsed.configurableParams || [],
    };
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
