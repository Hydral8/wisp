import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const nodeValidator = v.object({
  id: v.string(),
  step: v.string(),
  server_name: v.string(),
  tool_name: v.string(),
  arguments: v.any(),
  depends_on: v.array(v.string()),
  output_key: v.string(),
});

const configurableParamValidator = v.object({
  nodeId: v.string(),
  paramKey: v.string(),
  label: v.string(),
  description: v.string(),
  defaultValue: v.any(),
  type: v.string(),
});

export const publish = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    objective: v.string(),
    nodes: v.array(nodeValidator),
    configurableParams: v.array(configurableParamValidator),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    const publisherName = user?.name ?? user?.email ?? "Anonymous";

    return await ctx.db.insert("marketplaceWorkflows", {
      publisherId: userId,
      publisherName,
      name: args.name,
      description: args.description,
      objective: args.objective,
      nodes: args.nodes,
      configurableParams: args.configurableParams,
      tags: args.tags,
      usageCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.searchQuery) {
      return await ctx.db
        .query("marketplaceWorkflows")
        .withSearchIndex("search_marketplace", (q) =>
          q.search("description", args.searchQuery!)
        )
        .take(50);
    }
    return await ctx.db
      .query("marketplaceWorkflows")
      .withIndex("by_usage")
      .order("desc")
      .take(50);
  },
});

export const get = query({
  args: { id: v.id("marketplaceWorkflows") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const use = mutation({
  args: {
    marketplaceId: v.id("marketplaceWorkflows"),
    paramOverrides: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.marketplaceId);
    if (!item) throw new Error("Marketplace item not found");

    // Apply param overrides to nodes
    let nodes = item.nodes;
    if (args.paramOverrides && typeof args.paramOverrides === "object") {
      const overrides = args.paramOverrides as Record<string, Record<string, unknown>>;
      nodes = nodes.map((n) => {
        const nodeOverrides = overrides[n.id];
        if (!nodeOverrides) return n;
        return {
          ...n,
          arguments: { ...n.arguments, ...nodeOverrides },
        };
      });
    }

    // Clone into user's workflows
    const workflowId = await ctx.db.insert("workflows", {
      userId,
      name: item.name,
      description: item.description,
      objective: item.objective,
      nodes,
      status: "planned",
      browserUseMode: "local",
    });

    // Increment usage count
    await ctx.db.patch(args.marketplaceId, {
      usageCount: item.usageCount + 1,
    });

    return workflowId;
  },
});

export const suggestConfigurable = action({
  args: {
    nodes: v.any(),
    objective: v.string(),
  },
  handler: async (_ctx, args) => {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY not set");

    const nodesDesc = JSON.stringify(args.nodes, null, 2);
    const prompt = `Analyze this workflow and suggest which parameters should be user-configurable.

Objective: ${args.objective}

Workflow nodes:
${nodesDesc}

Focus on level-1 (entry) nodes whose arguments a user would likely want to customize.
For each suggested parameter, return a JSON object with:
- nodeId: which node it belongs to
- paramKey: the argument key
- label: a human-readable label
- description: why this is configurable
- defaultValue: the current value
- type: "string", "number", or "boolean"

Return ONLY a JSON array of suggestions, no other text.`;

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
      throw new Error(`Gemini API error: ${resp.status}`);
    }

    const data = await resp.json();
    const text = data.choices[0].message.content || "";

    // Parse JSON array from response
    try {
      // Try direct parse
      const parsed = JSON.parse(text.trim());
      if (Array.isArray(parsed)) return parsed;
      if (parsed.suggestions) return parsed.suggestions;
      if (parsed.parameters) return parsed.parameters;
      return [];
    } catch {
      // Try extracting from markdown fence
      const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1].trim());
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      // Try finding array
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      if (start !== -1 && end > start) {
        try {
          return JSON.parse(text.slice(start, end + 1));
        } catch {
          return [];
        }
      }
      return [];
    }
  },
});
