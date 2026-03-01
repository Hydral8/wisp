import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("workflows")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("workflows") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    objective: v.optional(v.string()),
    nodes: v.array(
      v.object({
        id: v.string(),
        step: v.string(),
        server_name: v.string(),
        tool_name: v.string(),
        arguments: v.any(),
        depends_on: v.array(v.string()),
        output_key: v.string(),
      })
    ),
    browserUseMode: v.optional(v.string()),
    configurableParams: v.optional(v.array(
      v.object({
        nodeId: v.string(),
        paramKey: v.string(),
        label: v.string(),
        description: v.string(),
        defaultValue: v.any(),
        type: v.string(),
      })
    )),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("workflows", {
      userId,
      name: args.name,
      description: args.description,
      objective: args.objective ?? "",
      nodes: args.nodes,
      status: "planned",
      browserUseMode: args.browserUseMode ?? "local",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("workflows"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("workflows") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const wf = await ctx.db.get(args.id);
    if (!wf || wf.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const rename = mutation({
  args: {
    id: v.id("workflows"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const updateNodes = mutation({
  args: {
    id: v.id("workflows"),
    nodes: v.array(
      v.object({
        id: v.string(),
        step: v.string(),
        server_name: v.string(),
        tool_name: v.string(),
        arguments: v.any(),
        depends_on: v.array(v.string()),
        output_key: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { nodes: args.nodes });
  },
});
