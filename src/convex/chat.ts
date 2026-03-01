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

### 0. THINK ABOUT INPUTS FIRST — What does this automation need from the user?
Before building the DAG, reason about the automation's PURPOSE and what a user would naturally need to provide each time they run it. This is the MOST IMPORTANT step.

**Think like a product designer:** If you were building a form for this automation, what fields would you show?

Examples of intelligent input identification:
- "Send an email" → recipient_email, subject, body (and optionally cc, bcc)
- "Search for flights" → origin, destination, departure_date, return_date, num_passengers
- "Post to Slack" → channel, message_text
- "Create GitHub issue" → repository, title, description, labels
- "Scrape a website" → url, what_to_extract
- "Send a tweet" → tweet_text
- "Schedule a meeting" → title, date, time, duration, attendees
- "Translate text" → source_text, target_language
- "Generate a report" → topic, date_range, format

**CRITICAL RULES for inputs:**
- Even if the agent hardcoded values during testing (e.g., used "hello@test.com" as recipient), you MUST still create input nodes for those — they should be configurable by the user
- Even if certain parameters were NOT explicitly used in the session but are logically needed for the automation, ADD them as input nodes. For example, if the agent sent an email with a hardcoded body, create an input for the email body.
- Use the actual values from the session as DEFAULTS, but make them overridable
- Think about what would change between runs — those are your inputs
- Group related inputs logically (e.g., all email fields together)

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

### 4. INPUT NODES — Wire the inputs you identified in Step 0
- For EACH user input you identified, create a dedicated \`__input__\` node at the START of the DAG:
  - server_name = "__input__", tool_name = "input"
  - arguments = { "value": "<sensible default>", "default": "<sensible default>" }
  - depends_on = [] (inputs are always roots)
  - output_key = a descriptive snake_case name like "recipient_email", "email_subject", "search_query"
- Then in the downstream node that uses this value, replace the argument's value with "{{output_key_of_input_node}}"
- Also create a matching configurableParam entry for each input node
- **If a tool argument was hardcoded during the session but should be user-configurable, ALWAYS extract it into an input node**

### 5. NAME & DESCRIPTION
- Generate a short, clear name (max 60 chars) describing the automation's purpose
- Write a 1-2 sentence description focused on what it does, not how

## Output Format

Return EXACTLY a JSON object with this schema and NOTHING ELSE (no markdown fences).

Here are two complete examples showing different automation types:

**Example A — Email automation (demonstrates decomposing a single tool into multiple inputs):**
{
  "name": "Send Email via Gmail",
  "description": "Sends an email through Gmail with configurable recipient, subject, and body.",
  "nodes": [
    { "id": "input_1", "step": "Recipient Email", "server_name": "__input__", "tool_name": "input", "arguments": { "value": "user@example.com", "default": "user@example.com" }, "depends_on": [], "output_key": "recipient_email" },
    { "id": "input_2", "step": "Email Subject", "server_name": "__input__", "tool_name": "input", "arguments": { "value": "Hello", "default": "Hello" }, "depends_on": [], "output_key": "email_subject" },
    { "id": "input_3", "step": "Email Body", "server_name": "__input__", "tool_name": "input", "arguments": { "value": "", "default": "" }, "depends_on": [], "output_key": "email_body" },
    { "id": "n1", "step": "Send email", "server_name": "GMAIL", "tool_name": "GMAIL_SEND_EMAIL", "arguments": { "recipient_email": "{{recipient_email}}", "subject": "{{email_subject}}", "body": "{{email_body}}" }, "depends_on": ["input_1", "input_2", "input_3"], "output_key": "send_result" }
  ],
  "configurableParams": [
    { "nodeId": "input_1", "paramKey": "value", "label": "Recipient Email", "description": "Who to send the email to", "defaultValue": "user@example.com", "type": "email", "placeholder": "Enter recipient email address" },
    { "nodeId": "input_2", "paramKey": "value", "label": "Subject", "description": "The email subject line", "defaultValue": "Hello", "type": "string", "placeholder": "Enter email subject" },
    { "nodeId": "input_3", "paramKey": "value", "label": "Email Body", "description": "The content of the email", "defaultValue": "", "type": "textarea", "placeholder": "Write your email message here..." }
  ]
}

**Example B — Flight search (demonstrates multiple inputs feeding parallel tool calls + LLM analysis):**
{
  "name": "Compare Flight Prices",
  "description": "Searches for flights between two cities and compares prices across providers.",
  "nodes": [
    { "id": "input_1", "step": "Origin City", "server_name": "__input__", "tool_name": "input", "arguments": { "value": "NYC", "default": "NYC" }, "depends_on": [], "output_key": "origin_city" },
    { "id": "input_2", "step": "Destination City", "server_name": "__input__", "tool_name": "input", "arguments": { "value": "LAX", "default": "LAX" }, "depends_on": [], "output_key": "destination_city" },
    { "id": "input_3", "step": "Departure Date", "server_name": "__input__", "tool_name": "input", "arguments": { "value": "2026-04-01", "default": "2026-04-01" }, "depends_on": [], "output_key": "departure_date" },
    { "id": "input_4", "step": "Return Date", "server_name": "__input__", "tool_name": "input", "arguments": { "value": "2026-04-08", "default": "2026-04-08" }, "depends_on": [], "output_key": "return_date" },
    { "id": "n1", "step": "Search flights", "server_name": "flights_server", "tool_name": "search", "arguments": { "origin": "{{origin_city}}", "destination": "{{destination_city}}", "date": "{{departure_date}}", "return_date": "{{return_date}}" }, "depends_on": ["input_1", "input_2", "input_3", "input_4"], "output_key": "flight_results" },
    { "id": "n2", "step": "Compare and rank flights", "server_name": "__llm__", "tool_name": "generate", "arguments": { "prompt": "Analyze {{flight_results}} and rank the top 5 options by price, highlighting any deals or tradeoffs." }, "depends_on": ["n1"], "output_key": "comparison" }
  ],
  "configurableParams": [
    { "nodeId": "input_1", "paramKey": "value", "label": "Origin City", "description": "The departure city", "defaultValue": "NYC", "type": "select", "options": ["NYC", "LAX", "SFO", "ORD", "ATL", "DFW", "BOS", "SEA", "MIA", "DEN"], "placeholder": "Choose departure city" },
    { "nodeId": "input_2", "paramKey": "value", "label": "Destination City", "description": "Where you want to fly to", "defaultValue": "LAX", "type": "select", "options": ["NYC", "LAX", "SFO", "ORD", "ATL", "DFW", "BOS", "SEA", "MIA", "DEN"], "placeholder": "Choose destination city" },
    { "nodeId": "input_3", "paramKey": "value", "label": "Departure Date", "description": "When to depart", "defaultValue": "2026-04-01", "type": "date", "placeholder": "Pick departure date" },
    { "nodeId": "input_4", "paramKey": "value", "label": "Return Date", "description": "When to return", "defaultValue": "2026-04-08", "type": "date", "placeholder": "Pick return date" }
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
- Always include "placeholder" with a short helpful hint (e.g. "Enter recipient email", "Describe what to search for")`;

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
