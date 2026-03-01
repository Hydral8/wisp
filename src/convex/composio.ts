import { action, mutation, query, internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// --- Server-to-Composio mapping ---

const SERVER_TO_COMPOSIO: Record<string, string> = {
  "com.github/github": "GITHUB",
  "com.mintmcp/gmail": "GMAIL",
  "ai.smithery/smithery-ai-slack": "SLACK",
  "com.notion/mcp": "NOTION",
  "com.linear/mcp": "LINEAR",
  "com.google/calendar": "GOOGLECALENDAR",
  "com.google/drive": "GOOGLEDRIVE",
  "com.google/sheets": "GOOGLESHEETS",
};

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

// --- Helper: map server name to Composio app slug ---

export function mapServerToComposioApp(serverName: string): string | null {
  return SERVER_TO_COMPOSIO[serverName] ?? null;
}

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
    const userId = identity.subject;

    // First, get the integration/auth config for this app
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
      throw new Error(`No integration found for app: ${args.appName}. Set one up in the Composio dashboard.`);
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

// --- Action: list available Composio apps ---

export const listComposioApps = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const resp = await fetch(`${COMPOSIO_BASE}/api/v1/apps`, {
      headers: composioHeaders(),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Failed to list Composio apps: ${err}`);
    }

    const data = await resp.json();
    const items = data.items || data;

    // Filter to only apps we have in our mapping (or return all if desired)
    const knownApps = new Set(Object.values(SERVER_TO_COMPOSIO));
    return (Array.isArray(items) ? items : [])
      .filter((app: any) => knownApps.has(app.key?.toUpperCase() || app.name?.toUpperCase()))
      .map((app: any) => ({
        key: (app.key || app.name || "").toUpperCase(),
        name: app.name || app.key || "",
        logo: app.logo || null,
        description: app.description || "",
      }));
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
    // Get the user's connection to find their Composio user_id
    const connection = await ctx.runQuery(
      internal.composio.getConnectionForProvider,
      { userId: args.userId, provider: args.appName }
    );
    if (!connection || connection.status !== "active") {
      throw new Error(`No active Composio connection for ${args.appName}`);
    }

    // Build the tool slug: e.g. "GITHUB_CREATE_ISSUE" from app="GITHUB" tool="create_issue"
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
