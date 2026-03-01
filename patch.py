import re

with open("src/convex/planning.ts", "r") as f:
    code = f.read()

# REPLACE 1
code = code.replace(
    '''    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY not set");

    const mcpProxyUrl = process.env.MCP_PROXY_URL;
    const browserUseApiKey = process.env.BROWSER_USE_API_KEY;
    const browserUseApi = "https://api.browser-use.com/api/v3";

    const maxTurns = 30;
    const messages: Array<{ role: string; content: any }> = [
      { role: "user", content: args.prompt },
    ];''',
    '''    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY not set");

    const mcpProxyUrl = process.env.MCP_PROXY_URL;
    const browserUseApiKey = process.env.BROWSER_USE_API_KEY;
    const browserUseApi = "https://api.browser-use.com/api/v3";

    const maxTurns = 30;
    const messages: Array<any> = [
      { role: "user", content: args.prompt },
    ];'''
)

# REPLACE 2
search2 = """      // Call Anthropic API
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          tools: AGENT_TOOLS.map((t) => ({
            name: t.name,
            description: t.description,
            input_schema: t.input_schema,
          })),
          messages,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        await ctx.runMutation(internal.planning.writePlanningEvent, {
          sessionId,
          event: {
            type: "planning_error",
            message: `API error: ${resp.status} ${errText}`,
          },
        });
        return { sessionId };
      }

      const data = await resp.json();
      const stopReason = data.stop_reason;
      const content = data.content || [];

      // Extract text
      const textParts = content
        .filter((b: any) => b.type === "text")
        .map((b: any) => b.text);
      const text = textParts.join("");
      const toolUses = content.filter((b: any) => b.type === "tool_use");

      await ctx.runMutation(internal.planning.writePlanningEvent, {
        sessionId,
        event: {
          type: "llm_call_complete",
          turn: turn + 1,
          stop_reason: stopReason,
          has_tool_calls: toolUses.length > 0,
          text_preview: text.slice(0, 200),
        },
      });

      if (text.trim()) {
        await ctx.runMutation(internal.planning.writePlanningEvent, {
          sessionId,
          event: { type: "planning_thinking", text },
        });
      }

      if (stopReason === "tool_use" && toolUses.length > 0) {
        messages.push({ role: "assistant", content });

        const results: Array<{
          type: string;
          tool_use_id: string;
          content: string;
        }> = [];

        for (const toolUse of toolUses) {
          const name = toolUse.name;
          const inp = toolUse.input || {};
          const cacheKey = `${name}:${JSON.stringify(inp)}`;"""

replace2 = """      // Call Gemini OpenAI API
      const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${geminiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          tools: AGENT_TOOLS.map((t) => ({
            type: "function",
            function: {
              name: t.name,
              description: t.description,
              parameters: t.input_schema,
            }
          })),
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        await ctx.runMutation(internal.planning.writePlanningEvent, {
          sessionId,
          event: {
            type: "planning_error",
            message: `API error: ${resp.status} ${errText}`,
          },
        });
        return { sessionId };
      }

      const data = await resp.json();
      const message = data.choices[0].message;
      const stopReason = data.choices[0].finish_reason;
      const text = message.content || "";
      const toolCalls = message.tool_calls || [];

      await ctx.runMutation(internal.planning.writePlanningEvent, {
        sessionId,
        event: {
          type: "llm_call_complete",
          turn: turn + 1,
          stop_reason: stopReason,
          has_tool_calls: toolCalls.length > 0,
          text_preview: text.slice(0, 200),
        },
      });

      if (text.trim()) {
        await ctx.runMutation(internal.planning.writePlanningEvent, {
          sessionId,
          event: { type: "planning_thinking", text },
        });
      }

      messages.push(message);

      if (toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          const name = toolCall.function.name;
          let inp: any = {};
          try {
            inp = JSON.parse(toolCall.function.arguments || "{}");
          } catch(e) {}
          const cacheKey = `${name}:${JSON.stringify(inp)}`;"""

code = code.replace(search2, replace2)


# REPLACE 3
search3 = """          if (callCache.has(cacheKey)) {
            results.push({
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: callCache.get(cacheKey)!,
            });"""

replace3 = """          if (callCache.has(cacheKey)) {
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: name,
              content: callCache.get(cacheKey)!,
            });"""
code = code.replace(search3, replace3)

# REPLACE 4
search4 = """          const contentStr = JSON.stringify(result);
          callCache.set(cacheKey, contentStr);
          results.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: contentStr,
          });
        }

        messages.push({ role: "user", content: results });
        continue;
      }

      // No tool calls — agent is done
      messages.push({ role: "assistant", content });"""

replace4 = """          const contentStr = JSON.stringify(result);
          callCache.set(cacheKey, contentStr);
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: name,
            content: contentStr,
          });
        }

        continue;
      }

      // No tool calls — agent is done"""

code = code.replace(search4, replace4)

with open("src/convex/planning.ts", "w") as f:
    f.write(code)

print("Patched planning.ts!")
