import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("credentials")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    appId: v.string(),
    displayName: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.optional(v.string()),
    password: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    token: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const normalizedAppId = args.appId.trim().toLowerCase();
    const existing = await ctx.db
      .query("credentials")
      .withIndex("by_user_app", (q) =>
        q.eq("userId", userId).eq("appId", normalizedAppId)
      )
      .unique();

    const data = {
      displayName: args.displayName ?? "",
      username: args.username ?? "",
      email: args.email ?? "",
      password: args.password ?? "",
      apiKey: args.apiKey ?? "",
      token: args.token ?? "",
      notes: args.notes ?? "",
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }

    return await ctx.db.insert("credentials", {
      userId,
      appId: normalizedAppId,
      ...data,
    });
  },
});

export const remove = mutation({
  args: { appId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const normalizedAppId = args.appId.trim().toLowerCase();
    const existing = await ctx.db
      .query("credentials")
      .withIndex("by_user_app", (q) =>
        q.eq("userId", userId).eq("appId", normalizedAppId)
      )
      .unique();

    if (!existing) throw new Error("Credential not found");
    if (existing.userId !== userId) throw new Error("Not authorized");

    await ctx.db.delete(existing._id);
  },
});

/** Internal query used by execution logic to get credentials for a specific app */
export const getForApp = internalQuery({
  args: { userId: v.id("users"), appId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("credentials")
      .withIndex("by_user_app", (q) =>
        q.eq("userId", args.userId).eq("appId", args.appId)
      )
      .unique();
  },
});
