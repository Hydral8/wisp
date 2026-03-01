import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

/**
 * Batch insert servers into the database.
 * Call from the Convex dashboard or a script.
 */
export const seedServers = internalMutation({
  args: {
    servers: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        version: v.string(),
        repositoryUrl: v.string(),
        status: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const server of args.servers) {
      // Check if already exists
      const existing = await ctx.db
        .query("servers")
        .withIndex("by_name", (q) => q.eq("name", server.name))
        .first();
      if (!existing) {
        await ctx.db.insert("servers", server);
      }
    }
  },
});

/**
 * Batch insert server packages.
 */
export const seedServerPackages = internalMutation({
  args: {
    packages: v.array(
      v.object({
        serverName: v.string(),
        registryType: v.string(),
        identifier: v.string(),
        transportType: v.string(),
        runtimeHint: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const pkg of args.packages) {
      await ctx.db.insert("serverPackages", pkg);
    }
  },
});

/**
 * Batch insert server remotes.
 */
export const seedServerRemotes = internalMutation({
  args: {
    remotes: v.array(
      v.object({
        serverName: v.string(),
        transportType: v.string(),
        url: v.string(),
        headersJson: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const remote of args.remotes) {
      await ctx.db.insert("serverRemotes", remote);
    }
  },
});

/**
 * Batch insert tools. Returns the inserted tool IDs for embedding association.
 */
export const seedTools = internalMutation({
  args: {
    tools: v.array(
      v.object({
        serverName: v.string(),
        toolName: v.string(),
        title: v.string(),
        description: v.string(),
        inputSchema: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids: Id<"tools">[] = [];
    for (const tool of args.tools) {
      const id = await ctx.db.insert("tools", tool);
      ids.push(id);
    }
    return ids;
  },
});

/**
 * Batch insert tool embeddings.
 */
export const seedToolEmbeddings = internalMutation({
  args: {
    embeddings: v.array(
      v.object({
        toolId: v.id("tools"),
        fullDoc: v.string(),
        embedding: v.array(v.float64()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const emb of args.embeddings) {
      await ctx.db.insert("toolEmbeddings", emb);
    }
  },
});

/**
 * Clear all tool embeddings. Used before re-seeding with real vectors.
 */
export const clearToolEmbeddings = internalMutation({
  args: {
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.batchSize ?? 100;
    const batch = await ctx.db.query("toolEmbeddings").take(limit);
    for (const doc of batch) {
      await ctx.db.delete(doc._id);
    }
    return batch.length;
  },
});

/**
 * List all tools with their Convex IDs, for building sqlite→convex ID map.
 */
export const listAllTools = internalMutation({
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    return all.map((t) => ({
      id: t._id,
      serverName: t.serverName,
      toolName: t.toolName,
    }));
  },
});

/**
 * Batch insert environment variables.
 */
export const seedEnvironmentVariables = internalMutation({
  args: {
    vars: v.array(
      v.object({
        serverName: v.string(),
        varName: v.string(),
        isSecret: v.boolean(),
        isRequired: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const v of args.vars) {
      await ctx.db.insert("environmentVariables", v);
    }
  },
});
