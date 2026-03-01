import { action, mutation, query, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const COMPOSIO_BASE = "https://backend.composio.dev";
const OAUTH_FALLBACK_APPS = new Set([
  "GITHUB",
  "GMAIL",
  "SLACK",
  "NOTION",
  "LINEAR",
  "GOOGLECALENDAR",
  "GOOGLEDRIVE",
  "GOOGLESHEETS",
  "OUTLOOK",
  "DISCORD",
  "TRELLO",
  "ASANA",
  "JIRA",
  "SALESFORCE",
  "HUBSPOT",
  "LINKEDIN",
  "TWITTER",
  "SPOTIFY",
  "DROPBOX",
]);
const NON_CONNECTABLE_APP_KEYS = new Set([
  "COMPOSIO",
  "MCP",
  "SERVER",
  "TOOLS",
  "TOOL",
]);
const APP_KEY_ALIASES: Record<string, string[]> = {
  GMAIL: ["GMAIL", "GOOGLEMAIL", "GOOGLE_MAIL"],
  GOOGLEMAIL: ["GOOGLEMAIL", "GMAIL", "GOOGLE_MAIL"],
  GOOGLECALENDAR: ["GOOGLECALENDAR", "GOOGLE_CALENDAR", "GCAL", "CALENDAR"],
  GOOGLEDRIVE: ["GOOGLEDRIVE", "GOOGLE_DRIVE", "GDRIVE", "DRIVE"],
  GOOGLESHEETS: ["GOOGLESHEETS", "GOOGLE_SHEETS", "GSHEETS", "SHEETS"],
};

// --- Core helpers ---

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

function normalizeAppName(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeUserId(value: Id<"users"> | string): string {
  return String(value);
}

function appKeyCandidates(appName: string): string[] {
  const normalized = normalizeAppName(appName);
  const aliases = APP_KEY_ALIASES[normalized] || [];
  return Array.from(new Set([normalized, ...aliases]));
}

function toolkitSlugCandidates(appName: string): string[] {
  const keys = appKeyCandidates(appName);
  const out = new Set<string>();
  for (const key of keys) {
    const lower = key.toLowerCase();
    out.add(lower);
    out.add(lower.replace(/_/g, ""));
    out.add(lower.replace(/_/g, "-"));
    out.add(lower.replace(/google/g, "google_"));
    out.add(lower.replace(/google/g, "google-"));
  }
  return Array.from(out).filter(Boolean);
}

function getDefaultCallbackUrl(): string | null {
  const direct = process.env.COMPOSIO_OAUTH_CALLBACK_URL?.trim();
  if (direct) return direct;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return `${appUrl.replace(/\/$/, "")}/api/composio/callback`;
  return null;
}

// --- Tool Router v3 Session helpers ---

async function getOrCreateSession(
  userId: string,
  toolkits?: string[]
): Promise<{ sessionId: string; tools: any[] }> {
  const resp = await fetch(`${COMPOSIO_BASE}/api/v3/tool_router/session`, {
    method: "POST",
    headers: composioHeaders(),
    body: JSON.stringify({
      user_id: userId,
      toolkits: toolkits ? { enable: toolkits } : undefined,
      manage_connections: {
        enable: true,
        callback_url: getDefaultCallbackUrl() || undefined,
      },
    }),
  });
  if (!resp.ok) throw new Error(`Session create failed: ${await resp.text()}`);
  const data = await resp.json();
  const sessionId = data.session_id || data.sessionId || data.id;
  if (!sessionId) throw new Error("No session_id in response");
  return {
    sessionId,
    tools: Array.isArray(data.tool_router_tools) ? data.tool_router_tools : [],
  };
}

async function getSessionToolkitStatus(
  sessionId: string,
  appName: string
): Promise<{ connected: boolean }> {
  const slugCandidates = toolkitSlugCandidates(appName);
  const resp = await fetch(
    `${COMPOSIO_BASE}/api/v3/tool_router/session/${encodeURIComponent(sessionId)}/toolkits?limit=50`,
    { headers: composioHeaders() }
  );
  if (!resp.ok) return { connected: false };
  const data = await resp.json();
  const items: any[] = Array.isArray(data?.items) ? data.items : [];
  const matched = items.find((t: any) => {
    const vals = [t?.slug, t?.toolkit_slug, t?.toolkitSlug, t?.name, t?.key]
      .filter(Boolean)
      .map((v: any) => String(v).toLowerCase());
    return vals.some((v) => slugCandidates.includes(v));
  });
  if (!matched) return { connected: false };
  const conn = matched.connection || {};
  return {
    connected:
      conn.is_active === true ||
      conn.isActive === true ||
      ["active", "connected", "enabled", "success"].includes(
        String(conn.status || "").toLowerCase()
      ),
  };
}

async function getSessionConnectLink(
  sessionId: string,
  toolkit: string,
  callbackUrl?: string
): Promise<{ redirectUrl?: string; connectedAccountId?: string }> {
  const payload: Record<string, unknown> = { toolkit };
  if (callbackUrl) payload.callback_url = callbackUrl;
  const resp = await fetch(
    `${COMPOSIO_BASE}/api/v3/tool_router/session/${encodeURIComponent(sessionId)}/link`,
    {
      method: "POST",
      headers: composioHeaders(),
      body: JSON.stringify(payload),
    }
  );
  if (!resp.ok) throw new Error(`Session link failed: ${await resp.text()}`);
  const data = await resp.json();
  return {
    redirectUrl: data.redirect_url || data.redirectUrl || data.url,
    connectedAccountId:
      data.connected_account_id || data.connectedAccountId || data.id,
  };
}

async function sessionSearch(
  sessionId: string,
  useCase: string
): Promise<any> {
  const resp = await fetch(
    `${COMPOSIO_BASE}/api/v3/tool_router/session/${encodeURIComponent(sessionId)}/search`,
    {
      method: "POST",
      headers: composioHeaders(),
      body: JSON.stringify({ queries: [{ use_case: useCase }] }),
    }
  );
  if (!resp.ok) throw new Error(`Session search failed: ${await resp.text()}`);
  return await resp.json();
}

async function sessionExecute(
  sessionId: string,
  toolSlug: string,
  args: any
): Promise<any> {
  const resp = await fetch(
    `${COMPOSIO_BASE}/api/v3/tool_router/session/${encodeURIComponent(sessionId)}/execute`,
    {
      method: "POST",
      headers: composioHeaders(),
      body: JSON.stringify({ tool_slug: toolSlug, arguments: args }),
    }
  );
  if (!resp.ok) {
    const body = await resp.text();
    if (
      [401, 403].includes(resp.status) ||
      /connect|not connected|authorization|authenticate|oauth/i.test(body)
    ) {
      return { _auth_error: true, status: resp.status, message: body };
    }
    throw new Error(`Session execute failed (${resp.status}): ${body}`);
  }
  return await resp.json();
}

// Try slug candidates to find a working session
async function findWorkingSession(
  userId: string,
  appName: string
): Promise<{ sessionId: string; slug: string; hasTools: boolean } | null> {
  const slugs = toolkitSlugCandidates(appName);
  for (const slug of slugs) {
    try {
      const { sessionId, tools } = await getOrCreateSession(userId, [slug]);
      return { sessionId, slug, hasTools: tools.length > 0 };
    } catch {
      continue;
    }
  }
  return null;
}

// Check if user has connected accounts for an app via v1 API (authoritative)
async function hasConnectedAccount(
  userId: string,
  appName: string
): Promise<boolean> {
  const keyCandidates = appKeyCandidates(appName);
  try {
    const resp = await fetch(
      `${COMPOSIO_BASE}/api/v1/connectedAccounts?user_uuid=${encodeURIComponent(userId)}&showActiveOnly=true&limit=100`,
      { headers: composioHeaders() }
    );
    if (!resp.ok) return false;
    const data = await resp.json();
    const items = data.items || data;
    if (!Array.isArray(items)) return false;
    return items.some((account: any) => {
      const accountApp = normalizeAppName(
        String(
          account?.appName ||
            account?.app_name ||
            account?.appKey ||
            account?.app_key ||
            account?.integration?.appName ||
            account?.integration?.app_name ||
            ""
        )
      );
      return keyCandidates.includes(accountApp);
    });
  } catch {
    return false;
  }
}

// Normalize tool results from session responses into a flat array
function normalizeSessionTools(data: any, appKey: string): any[] {
  // Handle tool_schemas (object keyed by tool slug)
  const schemas = data?.tool_schemas;
  if (schemas && typeof schemas === "object" && !Array.isArray(schemas)) {
    return Object.entries(schemas).map(([slug, schema]: [string, any]) => ({
      tool_name: slug,
      display_name:
        schema.display_name || schema.displayName || schema.name || slug,
      description: schema.description || "",
      parameters: schema.input_parameters || schema.parameters || {},
      app: appKey,
      _composio: true,
    }));
  }
  // Handle results array or tool_router_tools
  const results = data?.results || data?.tool_router_tools || data;
  if (!Array.isArray(results)) return [];
  return results.map((tool: any) => ({
    tool_name: tool.name || tool.slug || tool.tool_slug || tool.enum || "",
    display_name: tool.display_name || tool.displayName || tool.name || "",
    description: tool.description || "",
    parameters: tool.input_parameters || tool.parameters || {},
    app: appKey,
    _composio: true,
  }));
}

// ========== Sync: fetch all Composio apps and cache in DB ==========

export const syncApps = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const resp = await fetch(`${COMPOSIO_BASE}/api/v1/apps`, {
      headers: composioHeaders(),
    });
    if (!resp.ok) {
      throw new Error(`Failed to fetch Composio apps: ${await resp.text()}`);
    }

    const data = await resp.json();
    const items = data.items || data;
    if (!Array.isArray(items)) throw new Error("Unexpected Composio response");

    const apps = items.map((app: any) => ({
      key: normalizeAppName(app.key || app.name || ""),
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
    apps: v.array(
      v.object({
        key: v.string(),
        name: v.string(),
        description: v.string(),
        logo: v.optional(v.string()),
        categories: v.array(v.string()),
        integrationId: v.optional(v.string()),
        authConfigId: v.optional(v.string()),
      })
    ),
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

// ========== Queries ==========

export const getApps = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("composioApps").collect();
  },
});

export const getAppByKey = internalQuery({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("composioApps")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
  },
});

export const getAppForConnection = internalQuery({
  args: { appName: v.string() },
  handler: async (ctx, args) => {
    const candidates = appKeyCandidates(args.appName);
    for (const key of candidates) {
      const app = await ctx.db
        .query("composioApps")
        .withIndex("by_key", (q) => q.eq("key", key))
        .unique();
      if (app) return app;
    }

    const normalized = normalizeAppName(args.appName);
    const allApps = await ctx.db.query("composioApps").collect();
    return (
      allApps.find((app) => {
        const key = normalizeAppName(app.key || "");
        const name = normalizeAppName(app.name || "");
        return (
          key.includes(normalized) ||
          normalized.includes(key) ||
          name.includes(normalized) ||
          normalized.includes(name)
        );
      }) || null
    );
  },
});

// --- Dynamic server-to-Composio matching ---

export function mapServerToComposioApp(serverName: string): string | null {
  const parts = serverName.split("/");
  const lastSegment = (parts[parts.length - 1] || "").toLowerCase();
  const domainPart = (parts[0] || "").split(".").pop()?.toLowerCase() || "";

  const ALIASES: Record<string, string> = {
    gmail: "GMAIL",
    "google-calendar": "GOOGLECALENDAR",
    "google-drive": "GOOGLEDRIVE",
    "google-sheets": "GOOGLESHEETS",
    googlecalendar: "GOOGLECALENDAR",
    googledrive: "GOOGLEDRIVE",
    googlesheets: "GOOGLESHEETS",
    google_docs: "GOOGLEDOCS",
    "google-docs": "GOOGLEDOCS",
  };

  if (ALIASES[lastSegment]) return ALIASES[lastSegment];
  if (ALIASES[domainPart]) return ALIASES[domainPart];

  const direct = normalizeAppName(lastSegment);
  if (!direct || NON_CONNECTABLE_APP_KEYS.has(direct)) return null;
  return direct;
}

export const resolveComposioApp = internalQuery({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    const candidateKey = mapServerToComposioApp(args.serverName);
    if (!candidateKey) return null;
    if (NON_CONNECTABLE_APP_KEYS.has(candidateKey)) return null;
    const app = await ctx.db
      .query("composioApps")
      .withIndex("by_key", (q) => q.eq("key", candidateKey))
      .unique();
    if (app) return candidateKey;
    if (OAUTH_FALLBACK_APPS.has(candidateKey)) return candidateKey;
    return null;
  },
});

// ========== OAuth connection queries/mutations ==========

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

export const getConnectionForProvider = internalQuery({
  args: { userId: v.id("users"), provider: v.string() },
  handler: async (ctx, args) => {
    const provider = normalizeAppName(args.provider);
    return await ctx.db
      .query("oauthConnections")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", provider)
      )
      .unique();
  },
});

export const saveConnection = mutation({
  args: {
    provider: v.string(),
    composioEntityId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const provider = normalizeAppName(args.provider);

    const existing = await ctx.db
      .query("oauthConnections")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", userId).eq("provider", provider)
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
      provider,
      composioEntityId: args.composioEntityId,
      status: args.status,
    });
  },
});

export const removeConnection = mutation({
  args: { provider: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const provider = normalizeAppName(args.provider);

    const existing = await ctx.db
      .query("oauthConnections")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", userId).eq("provider", provider)
      )
      .unique();

    if (!existing) throw new Error("Connection not found");
    if (existing.userId !== userId) throw new Error("Not authorized");

    await ctx.db.delete(existing._id);
  },
});

// ========== Actions (session-based) ==========

export const initiateConnection = action({
  args: {
    appName: v.string(),
    callbackUrl: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ redirectUrl?: string; connectedAccountId?: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const appKey = normalizeAppName(args.appName);
    const session = await findWorkingSession(normalizeUserId(userId), appKey);
    if (!session) throw new Error(`Could not create session for ${appKey}`);

    return await getSessionConnectLink(
      session.sessionId,
      session.slug,
      args.callbackUrl || getDefaultCallbackUrl() || undefined
    );
  },
});

export const searchComposioTools = internalAction({
  args: {
    appName: v.string(),
    useCase: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const appKey = normalizeAppName(args.appName);
    const limit = args.limit ?? 15;
    const slugs = toolkitSlugCandidates(appKey);

    for (const slug of slugs) {
      try {
        const { sessionId, tools: sessionTools } = await getOrCreateSession(
          "default",
          [slug]
        );

        if (args.useCase) {
          const searchResult = await sessionSearch(sessionId, args.useCase);
          const tools = normalizeSessionTools(searchResult, appKey);
          if (tools.length > 0) return tools.slice(0, limit);
        }

        // No use_case or search returned empty — use session tools
        if (sessionTools.length > 0) {
          const tools = normalizeSessionTools(
            { tool_router_tools: sessionTools },
            appKey
          );
          return tools.slice(0, limit);
        }
      } catch {
        continue;
      }
    }

    // Fallback: v2 actions API
    const params = new URLSearchParams({
      appNames: appKey,
      limit: String(limit),
    });
    if (args.useCase) params.set("useCase", args.useCase);

    const resp = await fetch(
      `${COMPOSIO_BASE}/api/v2/actions?${params.toString()}`,
      { headers: composioHeaders() }
    );
    if (!resp.ok) return [];

    const data = await resp.json();
    const items = data.items || data;
    if (!Array.isArray(items)) return [];

    return items.map((action: any) => ({
      tool_name: action.name || action.actionName || "",
      display_name:
        action.displayName || action.display_name || action.name || "",
      description: action.description || "",
      parameters: action.parameters || action.inputParameters || {},
      app: appKey,
      _composio: true,
    }));
  },
});

export const ensureConnectionForApp = internalAction({
  args: {
    userId: v.id("users"),
    appName: v.string(),
  },
  handler: async (ctx, args) => {
    const appName = normalizeAppName(args.appName);
    if (NON_CONNECTABLE_APP_KEYS.has(appName)) {
      return {
        connected: false,
        action_required: true,
        requires_user_action: true,
        action_message:
          "Choose a specific app to connect (for example: GMAIL, GITHUB, SLACK).",
        app: appName,
      };
    }

    // 1. Check local DB first — covers connections saved via Integrations page
    const connection = await ctx.runQuery(
      internal.composio.getConnectionForProvider,
      { userId: args.userId, provider: appName }
    );
    if (connection?.status === "active") {
      return { connected: true, app: appName };
    }

    const userId = normalizeUserId(args.userId);

    // 2. Check via session API — toolkit status or session tools indicate connection
    const session = await findWorkingSession(userId, appName);
    if (session) {
      // If session creation returned tools, the user is connected
      if (session.hasTools) {
        return { connected: true, app: appName };
      }

      const status = await getSessionToolkitStatus(
        session.sessionId,
        appName
      );
      if (status.connected) {
        return { connected: true, app: appName };
      }
    }

    // 3. Check via v1 connected accounts API (authoritative Composio state)
    if (await hasConnectedAccount(userId, appName)) {
      return { connected: true, app: appName };
    }

    // Not connected anywhere — generate connect link
    if (session) {
      const callbackUrl = getDefaultCallbackUrl() || undefined;
      try {
        const link = await getSessionConnectLink(
          session.sessionId,
          session.slug,
          callbackUrl
        );
        return {
          connected: false,
          action_required: true,
          requires_user_action: true,
          action_message: `Connect ${appName} to continue.`,
          action_url: link.redirectUrl || "",
          connected_account_id: link.connectedAccountId || "",
          app: appName,
        };
      } catch {
        // Link generation failed, fall through
      }
    }

    return {
      connected: false,
      action_required: true,
      requires_user_action: true,
      action_message: `Connect ${appName} in Integrations, then continue.`,
      app: appName,
    };
  },
});

export const executeComposioTool = internalAction({
  args: {
    userId: v.id("users"),
    appName: v.string(),
    toolName: v.string(),
    arguments: v.any(),
  },
  handler: async (ctx, args) => {
    const appName = normalizeAppName(args.appName);
    const userId = normalizeUserId(args.userId);

    // Build tool slug, avoiding duplicate app prefix
    const rawTool = String(args.toolName || "").trim().toUpperCase();
    const appPrefix = `${appName}_`;
    const toolSlug = rawTool.startsWith(appPrefix)
      ? rawTool
      : rawTool.startsWith(`${appName}`)
        ? `${appName}_${rawTool.slice(appName.length).replace(/^_+/, "")}`
        : `${appName}_${rawTool}`;

    // Try session-based execute first
    const session = await findWorkingSession(userId, appName);
    if (session) {
      const result = await sessionExecute(
        session.sessionId,
        toolSlug,
        args.arguments || {}
      );
      if (!result?._auth_error) return result;
    }

    // Fallback: direct v3 tools execute (works when user connected outside session)
    const directResp = await fetch(
      `${COMPOSIO_BASE}/api/v3/tools/execute/${toolSlug}`,
      {
        method: "POST",
        headers: composioHeaders(),
        body: JSON.stringify({
          user_id: userId,
          arguments: args.arguments || {},
        }),
      }
    );
    if (directResp.ok) {
      return await directResp.json();
    }

    // Both failed — check if it's an auth issue
    const errorBody = await directResp.text();
    const isAuthError =
      [401, 403].includes(directResp.status) ||
      /connect|not connected|authorization|authenticate|oauth/i.test(
        errorBody
      );

    if (isAuthError && session) {
      const callbackUrl = getDefaultCallbackUrl() || undefined;
      try {
        const link = await getSessionConnectLink(
          session.sessionId,
          session.slug,
          callbackUrl
        );
        return {
          action_required: true,
          requires_user_action: true,
          action_message: `Connect ${appName} to continue, then re-run the task.`,
          action_url: link.redirectUrl || "",
          connected_account_id: link.connectedAccountId || "",
          app: appName,
          _composio_auth_required: true,
        };
      } catch {
        // fall through
      }
    }

    if (isAuthError) {
      return {
        action_required: true,
        requires_user_action: true,
        action_message: `Connect ${appName} in Integrations, then re-run the task.`,
        app: appName,
        _composio_auth_required: true,
      };
    }

    throw new Error(
      `Composio tool execution failed (${directResp.status}): ${errorBody}`
    );
  },
});
