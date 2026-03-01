import { action, mutation, query, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const COMPOSIO_BASE = "https://backend.composio.dev";

function getApiKey(): string {
  const key = process.env.COMPOSIO_API_KEY;
  if (!key) throw new Error("COMPOSIO_API_KEY not set");
  return key;
}

function composioHeaders(): Record<string, string> {
  return {
    "x-api-key": getApiKey(),
    "Content-Type": "application/json",
  };
}

// --- Sync: fetch all Composio apps and cache in DB ---

export const syncApps = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const resp = await fetch(`${COMPOSIO_BASE}/api/v1/apps`, {
      headers: composioHeaders(),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Failed to fetch Composio apps: ${err}`);
    }

    const data = await resp.json();
    const items = data.items || data;
    if (!Array.isArray(items)) throw new Error("Unexpected Composio response");

    const apps = items.map((app: any) => ({
      key: (app.key || app.name || "").toUpperCase(),
      name: app.name || app.key || "",
      description: app.description || "",
      logo: app.logo || null,
      categories: Array.isArray(app.categories) ? app.categories : [],
    }));

    await ctx.runMutation(internal.composio.upsertApps, { apps });
    return { synced: apps.length };
  },
});

export const upsertApps = internalMutation({
  args: {
    apps: v.array(v.object({
      key: v.string(),
      name: v.string(),
      description: v.string(),
      logo: v.optional(v.string()),
      categories: v.array(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const app of args.apps) {
      const existing = await ctx.db
        .query("composioApps")
        .withIndex("by_key", (q) => q.eq("key", app.key))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { ...app, syncedAt: now });
      } else {
        await ctx.db.insert("composioApps", { ...app, syncedAt: now });
      }
    }
  },
});

// --- Query: get cached Composio apps (fast, no API call) ---

export const getApps = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("composioApps").collect();
  },
});

// --- Internal query: find Composio app by key ---

export const getAppByKey = internalQuery({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("composioApps")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
  },
});

// --- Dynamic server-to-Composio matching ---
// Tries to match an MCP server_name to a Composio app key.
// e.g. "com.github/github" → "GITHUB", "com.mintmcp/gmail" → "GMAIL"

export function mapServerToComposioApp(serverName: string): string | null {
  // Extract the last segment: "com.github/github" → "github"
  const parts = serverName.split("/");
  const lastSegment = (parts[parts.length - 1] || "").toLowerCase();
  // Also try the domain part: "com.github" → "github"
  const domainPart = (parts[0] || "").split(".").pop()?.toLowerCase() || "";

  // Common aliases
  const ALIASES: Record<string, string> = {
    "gmail": "GMAIL",
    "google-calendar": "GOOGLECALENDAR",
    "google-drive": "GOOGLEDRIVE",
    "google-sheets": "GOOGLESHEETS",
    "googlecalendar": "GOOGLECALENDAR",
    "googledrive": "GOOGLEDRIVE",
    "googlesheets": "GOOGLESHEETS",
  };

  if (ALIASES[lastSegment]) return ALIASES[lastSegment];
  if (ALIASES[domainPart]) return ALIASES[domainPart];

  // Direct match: uppercase the last segment
  return lastSegment.toUpperCase() || null;
}

// Internal query version for use in actions (checks if app exists in our cache)
export const resolveComposioApp = internalQuery({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    const candidateKey = mapServerToComposioApp(args.serverName);
    if (!candidateKey) return null;
    const app = await ctx.db
      .query("composioApps")
      .withIndex("by_key", (q) => q.eq("key", candidateKey))
      .unique();
    return app ? candidateKey : null;
  },
});

// --- Query: get OAuth connections for current user ---

export const getConnections = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("oauthConnections")
      .withIndex("by_user_provider", (q) => q.eq("userId", userId))
      .collect();
  },
});

// --- Internal query: get connection for a specific user + provider ---

export const getConnectionForProvider = internalQuery({
  args: { userId: v.id("users"), provider: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oauthConnections")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider)
      )
      .unique();
  },
});

// --- Mutation: save a connected account after OAuth callback ---

export const saveConnection = mutation({
  args: {
    provider: v.string(),
    composioEntityId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("oauthConnections")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", userId).eq("provider", args.provider)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        composioEntityId: args.composioEntityId,
        status: args.status,
      });
      return existing._id;
    }

    return await ctx.db.insert("oauthConnections", {
      userId,
      provider: args.provider,
      composioEntityId: args.composioEntityId,
      status: args.status,
    });
  },
});

// --- Mutation: remove an OAuth connection ---

export const removeConnection = mutation({
  args: { provider: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("oauthConnections")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", userId).eq("provider", args.provider)
      )
      .unique();

    if (!existing) throw new Error("Connection not found");
    if (existing.userId !== userId) throw new Error("Not authorized");

    await ctx.db.delete(existing._id);
  },
});

// --- Action: initiate OAuth connection via Composio ---

export const initiateConnection = action({
  args: {
    appName: v.string(),
    callbackUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject.split("|")[0];

    // Get the integration for this app
    const integrationsResp = await fetch(
      `${COMPOSIO_BASE}/api/v1/integrations?appName=${args.appName}`,
      { headers: composioHeaders() }
    );
    if (!integrationsResp.ok) {
      const err = await integrationsResp.text();
      throw new Error(`Failed to list integrations: ${err}`);
    }
    const integrations = await integrationsResp.json();
    const items = integrations.items || integrations;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error(`No integration found for app: ${args.appName}`);
    }
    const integrationId = items[0].id;

    // Initiate connection
    const resp = await fetch(`${COMPOSIO_BASE}/api/v1/connectedAccounts`, {
      method: "POST",
      headers: composioHeaders(),
      body: JSON.stringify({
        integration_id: integrationId,
        user_id: userId,
        redirect_uri: args.callbackUrl,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Composio initiate connection failed: ${err}`);
    }

    const data = await resp.json();
    return {
      redirectUrl: data.redirectUrl,
      connectedAccountId: data.connectedAccountId,
    };
  },
});

// --- Internal action: execute a tool via Composio ---

export const executeComposioTool = internalAction({
  args: {
    userId: v.id("users"),
    appName: v.string(),
    toolName: v.string(),
    arguments: v.any(),
  },
  handler: async (ctx, args) => {
    const connection = await ctx.runQuery(
      internal.composio.getConnectionForProvider,
      { userId: args.userId, provider: args.appName }
    );
    if (!connection || connection.status !== "active") {
      throw new Error(`No active Composio connection for ${args.appName}`);
    }

    // Build tool slug: e.g. "GITHUB_CREATE_ISSUE"
    const toolSlug = `${args.appName}_${args.toolName}`.toUpperCase();

    const resp = await fetch(
      `${COMPOSIO_BASE}/api/v3/tools/execute/${toolSlug}`,
      {
        method: "POST",
        headers: composioHeaders(),
        body: JSON.stringify({
          user_id: args.userId,
          arguments: args.arguments || {},
        }),
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Composio tool execution failed: ${err}`);
    }

    return await resp.json();
  },
});
