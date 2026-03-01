/**
 * LLM API wrapper with OpenAI-compatible interface.
 * Uses Gemini (gemini-3-flash-preview) exclusively.
 */

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_MODEL = "gemini-3-flash-preview";

interface OAIMessage {
  role: string;
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
}

interface OAITool {
  type: "function";
  function: { name: string; description: string; parameters: any };
}

interface OAIChoice {
  message: OAIMessage;
  finish_reason: string;
}

/**
 * Call LLM with OpenAI-compatible interface.
 * Uses Gemini's OpenAI-compatible endpoint.
 */
export async function chatCompletion(opts: {
  messages: OAIMessage[];
  tools?: OAITool[];
  max_tokens?: number;
}): Promise<{ choices: OAIChoice[] }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const body: any = {
    model: GEMINI_MODEL,
    max_tokens: opts.max_tokens || 8192,
    messages: opts.messages,
  };
  if (opts.tools?.length) body.tools = opts.tools;

  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini ${resp.status}: ${errText}`);
  }

  return await resp.json();
}
