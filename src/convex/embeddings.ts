import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Generate embeddings using HuggingFace Inference API.
 * Model: google/embeddinggemma-300m (768D, same as current local model)
 */
export const embed = action({
  args: { text: v.string() },
  handler: async (_ctx, args): Promise<number[]> => {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) throw new Error("HUGGINGFACE_API_KEY not set");

    const response = await fetch(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/google/embeddinggemma-300m",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: args.text }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HuggingFace API error: ${response.status} ${text}`);
    }

    const result = await response.json();
    // HuggingFace returns [[...floats]] for single input
    const embedding = Array.isArray(result[0]) ? result[0] : result;
    return embedding as number[];
  },
});
