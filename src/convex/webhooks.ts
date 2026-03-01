import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("webhooks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Generate a random webhook key
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < 16; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }

    const id = await ctx.db.insert("webhooks", {
      userId,
      workflowId: args.workflowId,
      webhookKey: key,
    });

    return { id, webhookKey: key };
  },
});

export const getByKey = query({
  args: { webhookKey: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("webhooks")
      .withIndex("by_key", (q) => q.eq("webhookKey", args.webhookKey))
      .unique();
  },
});

export const remove = mutation({
  args: { id: v.id("webhooks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const webhook = await ctx.db.get(args.id);
    if (!webhook || webhook.userId !== userId) throw new Error("Not authorized");
    await ctx.db.delete(args.id);
  },
});
