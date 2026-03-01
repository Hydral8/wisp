import { query, action, internalMutation } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// --- Save app to DB (internal) ---

export const saveApp = internalMutation({
  args: {
    userId: v.id("users"),
    workflowId: v.id("workflows"),
    name: v.string(),
    description: v.string(),
    slug: v.string(),
    layout: v.any(),
    configurableParams: v.array(v.object({
      nodeId: v.string(),
      paramKey: v.string(),
      label: v.string(),
      description: v.string(),
      defaultValue: v.any(),
      type: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("apps", {
      userId: args.userId,
      workflowId: args.workflowId,
      name: args.name,
      description: args.description,
      slug: args.slug,
      layout: args.layout,
      configurableParams: args.configurableParams,
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// --- Fetch app by ID ---

export const get = query({
  args: { id: v.id("apps") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// --- List user's apps ---

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("apps")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// --- Generate app layout via Gemini ---

function extractJson(text: string): any {
  // Try direct parse
  try {
    return JSON.parse(text.trim());
  } catch { /* continue */ }
  // Try extracting from markdown fence
  const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (match) {
    try { return JSON.parse(match[1].trim()); } catch { /* continue */ }
  }
  // Try finding object
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch { /* continue */ }
  }
  return null;
}

export const generateAppLayout = action({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args): Promise<{ appId: string; layout: any }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Fetch workflow
    const workflow = await ctx.runQuery(api.workflows.get, {
      id: args.workflowId,
    });
    if (!workflow) throw new Error("Workflow not found");

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY not set");

    const params = workflow.configurableParams || [];
    const nodesDesc = JSON.stringify(workflow.nodes, null, 2);
    const paramsDesc = JSON.stringify(params, null, 2);

    const prompt = `You are a UI designer. Given this workflow, generate a JSON layout descriptor for a mini-app form.

Workflow name: ${workflow.name}
Workflow description: ${workflow.description}

Workflow nodes:
${nodesDesc}

Configurable parameters:
${paramsDesc}

Generate a JSON layout descriptor with this exact shape:
{
  "title": "Human-friendly app title",
  "subtitle": "One-line description of what this app does",
  "icon": "single emoji that represents this app",
  "colorTheme": { "primary": "#hex", "accent": "#hex" },
  "sections": [
    {
      "heading": "Section heading (optional)",
      "description": "Helper text (optional)",
      "fields": [
        {
          "paramKey": "nodeId.paramKey",
          "label": "Human-friendly label",
          "placeholder": "Placeholder text",
          "type": "text|textarea|number|boolean|select|url|email",
          "options": ["only for select type"],
          "required": true,
          "helpText": "Optional help text"
        }
      ]
    }
  ],
  "resultDisplay": {
    "style": "card|table|markdown|timeline",
    "showNodeResults": true
  }
}

Rules:
- Each configurable param MUST appear as a field with matching paramKey ("nodeId.paramKey" format)
- Group related fields into sections logically
- Pick a colorTheme that fits the workflow's purpose
- Choose the best resultDisplay.style for the workflow output type
- Pick a single emoji icon that represents the workflow

Return ONLY valid JSON, no other text.`;

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
    const layout = extractJson(text);

    if (!layout || !layout.title || !layout.sections) {
      throw new Error("Failed to generate valid layout from Gemini");
    }

    // Generate slug from name
    const slug = workflow.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Math.random().toString(36).slice(2, 8);

    // Save to DB
    const appId = await ctx.runMutation(internal.apps.saveApp, {
      userId: userId as any,
      workflowId: args.workflowId,
      name: layout.title || workflow.name,
      description: layout.subtitle || workflow.description,
      slug,
      layout,
      configurableParams: params.map((p: any) => ({
        nodeId: p.nodeId,
        paramKey: p.paramKey,
        label: p.label,
        description: p.description,
        defaultValue: p.defaultValue,
        type: p.type,
      })),
    });

    return { appId, layout };
  },
});
