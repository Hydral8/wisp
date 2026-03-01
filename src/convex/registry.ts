import { query, action, internalQuery } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";

interface ToolSearchResult {
  score: number;
  tool_name: string;
  title: string;
  description: string;
  input_schema: any;
  server: { name: string; description: string };
}

/** Search tools by vector similarity. Takes a pre-computed embedding. */
export const searchToolsByVector = action({
  args: {
    embedding: v.array(v.float64()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<ToolSearchResult[]> => {
    const limit = args.limit ?? 10;
    const results = await ctx.vectorSearch("toolEmbeddings", "by_embedding", {
      vector: args.embedding,
      limit,
    });

    const hydrated: (ToolSearchResult | null)[] = await Promise.all(
      results.map(async (r): Promise<ToolSearchResult | null> => {
        const embedding = await ctx.runQuery(
          internal.registry.getToolEmbeddingById,
          { id: r._id }
        );
        if (!embedding) return null;
        const tool = await ctx.runQuery(internal.registry.getToolById, {
          id: embedding.toolId,
        });
        if (!tool) return null;
        const server = await ctx.runQuery(internal.registry.getServerByToolName, {
          serverName: tool.serverName,
        });
        return {
          score: r._score,
          tool_name: tool.toolName,
          title: tool.title,
          description: tool.description,
          input_schema: tool.inputSchema ? JSON.parse(tool.inputSchema) : {},
          server: server
            ? { name: server.name, description: server.description }
            : { name: tool.serverName, description: "" },
        };
      })
    );

    return hydrated.filter((x): x is ToolSearchResult => x !== null);
  },
});

/** Semantic tool search: embed query, then vector search */
export const searchTools = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<ToolSearchResult[]> => {
    const embedding: number[] = await ctx.runAction(api.embeddings.embed, {
      text: args.query,
    });
    return await ctx.runAction(api.registry.searchToolsByVector, {
      embedding,
      limit: args.limit ?? 10,
    });
  },
});

/** Get connection info for a server (package/remote) */
export const getServerConnectionInfo = query({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    // Check remotes first
    const remote = await ctx.db
      .query("serverRemotes")
      .withIndex("by_server", (q) => q.eq("serverName", args.serverName))
      .first();
    if (remote) {
      return {
        method: "remote" as const,
        url: remote.url,
        headers: remote.headersJson ? JSON.parse(remote.headersJson) : null,
      };
    }

    // Check packages
    const pkg = await ctx.db
      .query("serverPackages")
      .withIndex("by_server", (q) => q.eq("serverName", args.serverName))
      .first();
    if (pkg) {
      return {
        method: "stdio" as const,
        registry: pkg.registryType,
        identifier: pkg.identifier,
        runtime_hint: pkg.runtimeHint,
      };
    }

    return null;
  },
});

/** List all tools for a server */
export const getToolsForServer = query({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    const tools = await ctx.db
      .query("tools")
      .withIndex("by_server", (q) => q.eq("serverName", args.serverName))
      .collect();
    return tools.map((t) => ({
      server_name: t.serverName,
      tool_name: t.toolName,
      description: t.description,
      input_schema: t.inputSchema ? JSON.parse(t.inputSchema) : {},
    }));
  },
});

/** Search servers by name/description (prefix match) */
export const searchServers = query({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const q = args.query.toLowerCase();
    // Full table scan with filter — acceptable for ~364 servers
    const all = await ctx.db.query("servers").collect();
    const matched = all
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      )
      .slice(0, limit);
    // Get tool counts
    const results = await Promise.all(
      matched.map(async (s) => {
        const tools = await ctx.db
          .query("tools")
          .withIndex("by_server", (q) => q.eq("serverName", s.name))
          .collect();
        return {
          name: s.name,
          description: s.description,
          tool_count: tools.length,
        };
      })
    );
    return results;
  },
});

/** Get a single server by name */
export const getServerByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("servers")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();
  },
});

// --- Internal queries for hydration ---

export const getToolEmbeddingById = internalQuery({
  args: { id: v.id("toolEmbeddings") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getToolById = internalQuery({
  args: { id: v.id("tools") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getServerByToolName = internalQuery({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("servers")
      .withIndex("by_name", (q) => q.eq("name", args.serverName))
      .first();
  },
});
