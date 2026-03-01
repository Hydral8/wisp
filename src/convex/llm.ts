/**
 * LLM API wrapper with OpenAI-compatible interface.
 * Tries Anthropic first, falls back to Gemini if it fails.
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const ANTHROPIC_MODEL = "claude-sonnet-4-6";
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

// --- Anthropic helpers ---

function convertMessagesToAnthropic(oaiMessages: OAIMessage[]): {
  system: string | undefined;
  messages: any[];
} {
  let system: string | undefined;
  const messages: any[] = [];

  for (const msg of oaiMessages) {
    if (msg.role === "system") {
      system = (system ? system + "\n\n" : "") + (msg.content || "");
      continue;
    }
    if (msg.role === "user") {
      messages.push({ role: "user", content: msg.content || "" });
      continue;
    }
    if (msg.role === "assistant") {
      const content: any[] = [];
      if (msg.content) content.push({ type: "text", text: msg.content });
      if (msg.tool_calls) {
        for (const tc of msg.tool_calls) {
          let input: any = {};
          try { input = JSON.parse(tc.function.arguments || "{}"); } catch {}
          content.push({ type: "tool_use", id: tc.id, name: tc.function.name, input });
        }
      }
      messages.push({ role: "assistant", content });
      continue;
    }
    if (msg.role === "tool") {
      messages.push({
        role: "user",
        content: [{ type: "tool_result", tool_use_id: msg.tool_call_id, content: msg.content || "" }],
      });
      continue;
    }
  }

  return { system, messages };
}

function convertAnthropicResponse(resp: any): { choices: OAIChoice[] } {
  const content = resp.content || [];
  let text = "";
  const toolCalls: OAIMessage["tool_calls"] = [];

  for (const block of content) {
    if (block.type === "text") text += block.text;
    else if (block.type === "tool_use") {
      toolCalls.push({
        id: block.id,
        type: "function",
        function: { name: block.name, arguments: JSON.stringify(block.input) },
      });
    }
  }

  const finishReason =
    resp.stop_reason === "tool_use" ? "tool_calls" :
    resp.stop_reason === "end_turn" ? "stop" : resp.stop_reason || "stop";

  const message: OAIMessage = { role: "assistant", content: text || null };
  if (toolCalls.length > 0) message.tool_calls = toolCalls;

  return { choices: [{ message, finish_reason: finishReason }] };
}

function convertToolsToAnthropic(oaiTools: OAITool[]): any[] {
  return oaiTools.map((t) => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters,
  }));
}

// --- Call providers ---

async function callAnthropic(opts: {
  messages: OAIMessage[];
  tools?: OAITool[];
  max_tokens?: number;
}): Promise<{ choices: OAIChoice[] }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const { system, messages } = convertMessagesToAnthropic(opts.messages);
  const body: any = {
    model: ANTHROPIC_MODEL,
    max_tokens: opts.max_tokens || 8192,
    messages,
  };
  if (system) body.system = system;
  if (opts.tools?.length) body.tools = convertToolsToAnthropic(opts.tools);

  const resp = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Anthropic ${resp.status}: ${errText}`);
  }

  return convertAnthropicResponse(await resp.json());
}

async function callGemini(opts: {
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

/**
 * Call LLM with OpenAI-compatible interface.
 * Tries Anthropic first, falls back to Gemini on failure.
 */
export async function chatCompletion(opts: {
  messages: OAIMessage[];
  tools?: OAITool[];
  max_tokens?: number;
}): Promise<{ choices: OAIChoice[] }> {
  // Try Anthropic first
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await callAnthropic(opts);
    } catch (err: any) {
      console.log(`[llm] Anthropic failed: ${err.message}, trying Gemini fallback`);
    }
  }

  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY) {
    return await callGemini(opts);
  }

  throw new Error("No LLM API key configured (ANTHROPIC_API_KEY or GEMINI_API_KEY)");
}
