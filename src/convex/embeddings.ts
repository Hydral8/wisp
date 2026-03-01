import { action } from "./_generated/server";
import { v } from "convex/values";

const HF_MODEL = "google/embeddinggemma-300m"; // 768D

/**
 * Generate embeddings via HuggingFace Inference API.
 * Model: google/embeddinggemma-300m (768D)
 */
export const embed = action({
  args: { text: v.string() },
  handler: async (_ctx, args): Promise<number[]> => {
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey) throw new Error("HUGGINGFACE_API_KEY not set");

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: args.text }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HuggingFace Inference error: ${response.status} ${text}`);
    }

    const result = await response.json();
    // HF returns nested array for single input: [[0.1, 0.2, ...]]
    const embedding = Array.isArray(result[0]) ? result[0] : result;
    return embedding as number[];
  },
});
