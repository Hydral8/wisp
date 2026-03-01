import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

/**
 * Continue planning by sending a follow-up message.
 * Re-uses the existing session.
 */
export const continueChat = action({
  args: {
    prompt: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.runAction(api.planning.startPlanning, {
      prompt: args.prompt,
      sessionId: args.sessionId,
    });
  },
});

/**
 * Convert executed agent steps into a reusable DAG workflow.
 */
export const convertToWorkflow = action({
  args: {
    name: v.string(),
    description: v.string(),
    executedSteps: v.array(v.any()),
  },
  handler: async (ctx, args): Promise<{ workflowId: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const nodes = args.executedSteps.map((step: any, i: number) => ({
      id: `n${i + 1}`,
      step: `Step ${i + 1}: ${step.tool_name || ""}`,
      server_name: step.server_name || "",
      tool_name: step.tool_name || "",
      arguments: step.arguments || {},
      depends_on: i > 0 ? [`n${i}`] : [],
      output_key: `r${i + 1}`,
    }));

    const workflowId = await ctx.runMutation(api.workflows.create, {
      name: args.name || "Workflow",
      description: args.description,
      nodes,
    });

    return { workflowId: workflowId as string };
  },
});
