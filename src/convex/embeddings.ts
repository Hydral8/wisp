import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Generate embeddings using local Python proxy.
 * Model: google/embeddinggemma-300m (768D) via MCP Proxy
 */
export const embed = action({
  args: { text: v.string() },
  handler: async (_ctx, args): Promise<number[]> => {
    const proxyUrl = process.env.MCP_PROXY_URL;
    if (!proxyUrl) throw new Error("MCP_PROXY_URL not set");

    const response = await fetch(`${proxyUrl}/embed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: args.text }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Local embedding proxy error: ${response.status} ${text}`);
    }

    const result = await response.json();
    return result.embedding as number[];
  },
});
