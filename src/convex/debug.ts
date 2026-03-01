import { action } from "./_generated/server";

// Temporary diagnostic — delete after debugging
export const checkEnv = action({
  args: {},
  handler: async () => {
    const googleId = process.env.AUTH_GOOGLE_ID ?? "NOT SET";
    const siteUrl = process.env.SITE_URL ?? "NOT SET";
    const convexSiteUrl = process.env.CONVEX_SITE_URL ?? "NOT SET";
    return {
      AUTH_GOOGLE_ID_length: googleId.length,
      AUTH_GOOGLE_ID_prefix: googleId.substring(0, 20),
      AUTH_GOOGLE_ID_suffix: googleId.substring(googleId.length - 30),
      AUTH_GOOGLE_SECRET_set: !!process.env.AUTH_GOOGLE_SECRET,
      SITE_URL: siteUrl,
      CONVEX_SITE_URL: convexSiteUrl,
    };
  },
});
