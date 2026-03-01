import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Generate embeddings via dedicated HF Inference Endpoint.
 * Model: google/embeddinggemma-300m (768D)
 */
export const embed = action({
  args: { text: v.string() },
  handler: async (_ctx, args): Promise<number[]> => {
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey) throw new Error("HUGGINGFACE_API_KEY not set");

    const endpointUrl = process.env.HF_EMBEDDING_URL
      ?? "https://cgk2o7ucgptytlsv.us-east-1.aws.endpoints.huggingface.cloud";

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: args.text }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HF Embedding endpoint error: ${response.status} ${text}`);
    }

    const result = await response.json();
    // HF returns nested array for single input: [[0.1, 0.2, ...]]
    const embedding = Array.isArray(result[0]) ? result[0] : result;
    return embedding as number[];
  },
});
