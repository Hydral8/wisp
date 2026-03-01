import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Auth tables (managed by @convex-dev/auth) ---
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),

  authSessions: defineTable({
    userId: v.id("users"),
    expirationTime: v.float64(),
  }).index("userId", ["userId"]),

  authAccounts: defineTable({
    userId: v.id("users"),
    provider: v.string(),
    providerAccountId: v.string(),
  })
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),

  authRefreshTokens: defineTable({
    sessionId: v.id("authSessions"),
    expirationTime: v.float64(),
  }).index("sessionId", ["sessionId"]),

  authVerificationCodes: defineTable({
    accountId: v.id("authAccounts"),
    code: v.string(),
    expirationTime: v.float64(),
    verifier: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
  })
    .index("accountId", ["accountId"])
    .index("code", ["code"]),

  authVerifiers: defineTable({
    sessionId: v.optional(v.id("authSessions")),
    signature: v.optional(v.string()),
    expirationTime: v.optional(v.float64()),
  }).index("signature", ["signature"]),

  authRateLimits: defineTable({
    identifier: v.string(),
    lastAttemptTime: v.float64(),
    attemptsLeft: v.float64(),
  }).index("identifier", ["identifier"]),

  // --- User-scoped tables ---

  credentials: defineTable({
    userId: v.id("users"),
    appId: v.string(),
    displayName: v.string(),
    username: v.string(),
    email: v.string(),
    password: v.string(),
    apiKey: v.string(),
    token: v.string(),
    notes: v.string(),
    updatedAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_user_app", ["userId", "appId"]),

  workflows: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
    objective: v.string(),
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
    status: v.string(), // "planned" | "running" | "completed" | "failed"
    browserUseMode: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["userId", "status"]),

  webhooks: defineTable({
    userId: v.id("users"),
    workflowId: v.id("workflows"),
    webhookKey: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_key", ["webhookKey"]),

  // Planning + execution event streams (for real-time frontend updates)
  planningEvents: defineTable({
    workflowId: v.optional(v.id("workflows")),
    sessionId: v.string(),
    event: v.any(),
    createdAt: v.float64(),
  })
    .index("by_session", ["sessionId", "createdAt"])
    .index("by_workflow", ["workflowId", "createdAt"]),

  executionEvents: defineTable({
    workflowId: v.id("workflows"),
    nodeId: v.optional(v.string()),
    event: v.any(),
    createdAt: v.float64(),
  }).index("by_workflow", ["workflowId", "createdAt"]),

  // Chat sessions for planning continuation
  chatSessions: defineTable({
    userId: v.id("users"),
    workflowId: v.optional(v.id("workflows")),
    messages: v.any(), // Array of chat messages (role + content)
    createdAt: v.float64(),
  }).index("by_user", ["userId"]),

  // --- Global MCP registry tables ---

  servers: defineTable({
    name: v.string(),
    description: v.string(),
    version: v.string(),
    repositoryUrl: v.string(),
    status: v.string(),
  }).index("by_name", ["name"]),

  serverPackages: defineTable({
    serverName: v.string(),
    registryType: v.string(),
    identifier: v.string(),
    transportType: v.string(),
    runtimeHint: v.string(),
  }).index("by_server", ["serverName"]),

  serverRemotes: defineTable({
    serverName: v.string(),
    transportType: v.string(),
    url: v.string(),
    headersJson: v.string(),
  }).index("by_server", ["serverName"]),

  environmentVariables: defineTable({
    serverName: v.string(),
    varName: v.string(),
    isSecret: v.boolean(),
    isRequired: v.boolean(),
  }).index("by_server", ["serverName"]),

  tools: defineTable({
    serverName: v.string(),
    toolName: v.string(),
    title: v.string(),
    description: v.string(),
    inputSchema: v.string(), // JSON string for type safety
  })
    .index("by_server", ["serverName"])
    .index("by_name", ["serverName", "toolName"]),

  toolEmbeddings: defineTable({
    toolId: v.id("tools"),
    fullDoc: v.string(),
    embedding: v.array(v.float64()),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: [],
  }),

  marketRankings: defineTable({
    serverName: v.string(),
    totalScore: v.float64(),
  }).index("by_server", ["serverName"]),

  // --- Marketplace ---
  marketplaceWorkflows: defineTable({
    publisherId: v.id("users"),
    publisherName: v.string(),
    name: v.string(),
    description: v.string(),
    objective: v.string(),
    nodes: v.array(v.object({
      id: v.string(),
      step: v.string(),
      server_name: v.string(),
      tool_name: v.string(),
      arguments: v.any(),
      depends_on: v.array(v.string()),
      output_key: v.string(),
    })),
    configurableParams: v.array(v.object({
      nodeId: v.string(),
      paramKey: v.string(),
      label: v.string(),
      description: v.string(),
      defaultValue: v.any(),
      type: v.string(),
    })),
    tags: v.array(v.string()),
    usageCount: v.float64(),
    createdAt: v.float64(),
  })
    .index("by_publisher", ["publisherId"])
    .index("by_usage", ["usageCount"])
    .searchIndex("search_marketplace", {
      searchField: "description",
      filterFields: ["tags"],
    }),

  // --- OAuth connections (Composio) ---
  oauthConnections: defineTable({
    userId: v.id("users"),
    provider: v.string(),
    composioEntityId: v.string(),
    status: v.string(),
  }).index("by_user_provider", ["userId", "provider"]),
});
