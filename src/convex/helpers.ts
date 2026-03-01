import {
  QueryCtx,
  MutationCtx,
  ActionCtx,
} from "./_generated/server";
import { Auth } from "convex/server";

/**
 * Require an authenticated user and return their userId.
 * Throws if not authenticated.
 */
export async function requireUser(
  ctx: { auth: Auth }
): Promise<{ userId: any }> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  // The subject field contains the Convex user ID when using @convex-dev/auth
  const userId = identity.subject.split("|")[0] as any;
  return { userId };
}
