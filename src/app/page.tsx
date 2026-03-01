"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type {
  Workflow,
  DAGNode,
  NodeStatus,
  ChatMessage,
  PlanResponse,
} from "@/lib/types";

const API = "http://localhost:8001";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLevels(nodes: DAGNode[]): DAGNode[][] {
  const map = new Map(nodes.map((n) => [n.id, n]));
  const inDeg = new Map(nodes.map((n) => [n.id, 0]));
  for (const n of nodes) {
    for (const dep of n.depends_on) {
      if (inDeg.has(n.id)) inDeg.set(n.id, (inDeg.get(n.id) ?? 0) + 1);
    }
  }
  const levels: DAGNode[][] = [];
  const remaining = new Set(inDeg.keys());
  while (remaining.size > 0) {
    const level = [...remaining].filter((id) => (inDeg.get(id) ?? 0) === 0);
    if (level.length === 0) break;
    levels.push(level.map((id) => map.get(id)!));
    for (const id of level) {
      remaining.delete(id);
      for (const n of nodes) {
        if (n.depends_on.includes(id) && remaining.has(n.id)) {
          inDeg.set(n.id, (inDeg.get(n.id) ?? 0) - 1);
        }
      }
    }
  }
  return levels;
}

// ---------------------------------------------------------------------------
// ChatPane
// ---------------------------------------------------------------------------

function ChatPane({
  messages,
  onSend,
  loading,
}: {
  messages: ChatMessage[];
  onSend: (msg: string) => void;
  loading: boolean;
}) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div
      className="flex flex-col h-full animate-slide-left"
      style={{
        width: 340,
        minWidth: 340,
        borderRight: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 text-xs font-bold tracking-wider uppercase"
        style={{ color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}
      >
        Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="animate-fade-in-fast">
            {m.role === "user" ? (
              <div className="flex justify-end">
                <div
                  className="px-3 py-2 rounded-lg text-xs max-w-[260px]"
                  style={{ background: "var(--accent-dim)", color: "#fff" }}
                >
                  {m.content}
                </div>
              </div>
            ) : m.role === "system" ? (
              <div
                className="text-xs px-3 py-1.5 rounded"
                style={{ color: "var(--blue)", background: "rgba(96,165,250,0.08)" }}
              >
                {m.content}
              </div>
            ) : (
              <div
                className="px-3 py-2 rounded-lg text-xs"
                style={{ background: "var(--bg-card)", color: "var(--text)" }}
              >
                {m.content}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-1 px-3 py-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "var(--accent)",
                  animation: `pulse-dot 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded text-xs outline-none"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            placeholder="Follow up..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded text-xs font-medium transition-opacity"
            style={{
              background: "var(--accent)",
              color: "#fff",
              opacity: loading || !input.trim() ? 0.4 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PipelineBar
// ---------------------------------------------------------------------------

function PipelineBar({
  nodes,
  nodeStatuses,
}: {
  nodes: DAGNode[];
  nodeStatuses: Map<string, NodeStatus>;
}) {
  return (
    <div
      className="flex items-center gap-1 px-4 py-2 overflow-x-auto"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}
    >
      {nodes.map((n, i) => {
        const st = nodeStatuses.get(n.id);
        const status = st?.status ?? "pending";
        const color =
          status === "complete"
            ? "var(--green)"
            : status === "running"
              ? "var(--blue)"
              : status === "error"
                ? "var(--red)"
                : "var(--border)";
        return (
          <div key={n.id} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{ background: color }}
            />
            {i < nodes.length - 1 && (
              <div className="w-4 h-px" style={{ background: "var(--border)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ExecutionEntry
// ---------------------------------------------------------------------------

function ExecutionEntry({ node }: { node: NodeStatus }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor =
    node.status === "complete"
      ? "var(--green)"
      : node.status === "running"
        ? "var(--blue)"
        : node.status === "error"
          ? "var(--red)"
          : "var(--text-dim)";

  const statusClass =
    node.status === "running"
      ? "node-active"
      : node.status === "complete"
        ? "node-complete"
        : node.status === "error"
          ? "node-error"
          : "";

  return (
    <div
      className={`rounded-lg p-4 animate-fade-in transition-all cursor-pointer ${statusClass}`}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: statusColor,
              animation:
                node.status === "running" ? "pulse-dot 1s ease-in-out infinite" : "none",
            }}
          />
          <div>
            <div className="text-xs font-medium" style={{ color: "var(--text)" }}>
              {node.step || node.tool_name}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
              {node.server_name} / {node.tool_name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {node.elapsed !== undefined && (
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>
              {node.elapsed}s
            </span>
          )}
          <span
            className="text-xs"
            style={{ color: statusColor, transform: expanded ? "rotate(180deg)" : "none" }}
          >
            v
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-3 space-y-2 animate-fade-in-fast">
          {/* Request */}
          {node.arguments && Object.keys(node.arguments).length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--blue)" }}>
                Request
              </div>
              <pre
                className="text-xs p-2 rounded overflow-x-auto"
                style={{
                  background: "var(--bg-surface)",
                  color: "var(--text-dim)",
                  maxHeight: 200,
                }}
              >
                {JSON.stringify(node.arguments, null, 2)}
              </pre>
            </div>
          )}

          {/* Response */}
          {node.result !== undefined && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--green)" }}>
                Response
              </div>
              <pre
                className="text-xs p-2 rounded overflow-x-auto"
                style={{
                  background: "var(--bg-surface)",
                  color: "var(--text-dim)",
                  maxHeight: 300,
                }}
              >
                {typeof node.result === "string"
                  ? node.result
                  : JSON.stringify(node.result, null, 2)}
              </pre>
            </div>
          )}

          {/* Error */}
          {node.error && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--red)" }}>
                Error
              </div>
              <pre
                className="text-xs p-2 rounded"
                style={{ background: "rgba(248,113,113,0.08)", color: "var(--red)" }}
              >
                {node.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// WorkflowPane
// ---------------------------------------------------------------------------

function WorkflowPane({
  workflow,
  nodeStatuses,
  isExecuting,
  executionDone,
  onDeploy,
  onCreateWebhook,
  webhookUrl,
}: {
  workflow: Workflow;
  nodeStatuses: Map<string, NodeStatus>;
  isExecuting: boolean;
  executionDone: boolean;
  onDeploy: () => void;
  onCreateWebhook: () => void;
  webhookUrl: string | null;
}) {
  const levels = getLevels(workflow.nodes);
  const showExecution = isExecuting || executionDone;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-slide-right">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <div className="text-sm font-medium">{workflow.name}</div>
          <div className="text-xs" style={{ color: "var(--text-dim)" }}>
            {workflow.description}
          </div>
        </div>
        <div className="flex gap-2">
          {!isExecuting && !executionDone && (
            <button
              onClick={onDeploy}
              className="px-4 py-1.5 rounded text-xs font-medium"
              style={{ background: "var(--green)", color: "#000" }}
            >
              Deploy
            </button>
          )}
          {executionDone && !webhookUrl && (
            <button
              onClick={onCreateWebhook}
              className="px-4 py-1.5 rounded text-xs font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Create Webhook
            </button>
          )}
        </div>
      </div>

      {/* Pipeline bar */}
      {showExecution && <PipelineBar nodes={workflow.nodes} nodeStatuses={nodeStatuses} />}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {showExecution ? (
          /* Execution feed */
          <div className="space-y-3">
            {workflow.nodes
              .filter((n) => nodeStatuses.has(n.id))
              .map((n) => (
                <ExecutionEntry key={n.id} node={nodeStatuses.get(n.id)!} />
              ))}
            {webhookUrl && (
              <div
                className="p-3 rounded-lg text-xs animate-fade-in"
                style={{ background: "rgba(124,107,240,0.1)", border: "1px solid var(--accent)" }}
              >
                <div className="font-medium mb-1" style={{ color: "var(--accent)" }}>
                  Webhook Created
                </div>
                <code style={{ color: "var(--text-dim)" }}>{API}{webhookUrl}</code>
              </div>
            )}
          </div>
        ) : (
          /* DAG preview */
          <div className="space-y-4">
            {levels.map((level, li) => (
              <div key={li}>
                <div
                  className="text-xs font-medium mb-2 uppercase tracking-wider"
                  style={{ color: "var(--text-dim)" }}
                >
                  Level {li + 1}
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                  {level.map((node) => (
                    <div
                      key={node.id}
                      className="p-3 rounded-lg"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                      <div className="text-xs font-medium">{node.step}</div>
                      <div className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
                        {node.server_name} / {node.tool_name}
                      </div>
                      {Object.keys(node.arguments).length > 0 && (
                        <pre
                          className="text-xs mt-2 p-2 rounded overflow-x-auto"
                          style={{
                            background: "var(--bg-surface)",
                            color: "var(--text-dim)",
                            fontSize: 10,
                          }}
                        >
                          {JSON.stringify(node.arguments, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
                {li < levels.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-px h-6" style={{ background: "var(--border)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home (main page)
// ---------------------------------------------------------------------------

const PRESETS = [
  { label: "GitHub trending AI repos", prompt: "Search GitHub for trending AI repositories this week" },
  { label: "Crypto price check", prompt: "Get the current prices of Bitcoin, Ethereum, and Solana" },
  { label: "Web scrape + summarize", prompt: "Scrape the Hacker News front page and summarize the top 5 stories" },
  { label: "Weather comparison", prompt: "Compare the current weather in San Francisco, New York, and London" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [nodeStatuses, setNodeStatuses] = useState<Map<string, NodeStatus>>(new Map());
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionDone, setExecutionDone] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  const handlePlan = useCallback(
    async (prompt: string) => {
      setStarted(true);
      setLoading(true);
      setChatMessages((prev) => [...prev, { role: "user", content: prompt }]);

      try {
        const res = await fetch(`${API}/plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data: PlanResponse = await res.json();

        setSessionId(data.session_id);
        if (data.chat_messages) {
          setChatMessages((prev) => [...prev, ...data.chat_messages]);
        }
        if (data.workflow) {
          setWorkflow(data.workflow);
        }
      } catch (err) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${err}` },
        ]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleChat = useCallback(
    async (message: string) => {
      if (!sessionId) return;
      setLoading(true);
      setChatMessages((prev) => [...prev, { role: "user", content: message }]);

      try {
        const res = await fetch(`${API}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, message }),
        });
        const data: PlanResponse = await res.json();

        if (data.chat_messages) {
          setChatMessages((prev) => [...prev, ...data.chat_messages]);
        }
        if (data.workflow) {
          setWorkflow(data.workflow);
        }
      } catch (err) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${err}` },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  const handleDeploy = useCallback(async () => {
    if (!workflow) return;
    setIsExecuting(true);

    try {
      const res = await fetch(`${API}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow_id: workflow.id }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "node_start") {
              setNodeStatuses((prev) => {
                const next = new Map(prev);
                next.set(event.node_id, {
                  id: event.node_id,
                  step: event.data.step,
                  server_name: event.data.server_name,
                  tool_name: event.data.tool_name,
                  arguments: event.data.arguments,
                  status: "running",
                  level: event.data.level,
                  progress: event.data.progress,
                });
                return next;
              });
            } else if (event.type === "node_complete") {
              setNodeStatuses((prev) => {
                const next = new Map(prev);
                const existing = next.get(event.node_id);
                next.set(event.node_id, {
                  ...existing!,
                  status: "complete",
                  result: event.data.result,
                  elapsed: event.data.elapsed,
                  progress: event.data.progress,
                });
                return next;
              });
            } else if (event.type === "node_error") {
              setNodeStatuses((prev) => {
                const next = new Map(prev);
                const existing = next.get(event.node_id);
                next.set(event.node_id, {
                  ...existing!,
                  status: "error",
                  error: event.data.error,
                  progress: event.data.progress,
                });
                return next;
              });
            }
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Deploy error: ${err}` },
      ]);
    } finally {
      setIsExecuting(false);
      setExecutionDone(true);
    }
  }, [workflow]);

  const handleCreateWebhook = useCallback(async () => {
    if (!workflow) return;
    try {
      const res = await fetch(`${API}/webhooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow_id: workflow.id }),
      });
      const data = await res.json();
      setWebhookUrl(data.url);
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }, [workflow]);

  // Initial state: centered input
  if (!started) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <h1
          className="text-2xl font-bold mb-2 tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Wisp Instant
        </h1>
        <p className="text-xs mb-8" style={{ color: "var(--text-dim)" }}>
          Describe a workflow — we&apos;ll find the right tools and run them.
        </p>

        <div className="w-full max-w-xl">
          <textarea
            className="w-full p-4 rounded-lg text-sm outline-none resize-none"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              minHeight: 80,
            }}
            placeholder="e.g. Search GitHub for trending AI repos this week..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) handlePlan(input.trim());
              }
            }}
          />
          <div className="flex gap-2 mt-3 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePlan(p.prompt)}
                className="px-3 py-1.5 rounded text-xs transition-colors"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-dim)",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Split-pane: chat left, workflow right
  return (
    <div className="h-screen flex">
      <ChatPane
        messages={chatMessages}
        onSend={handleChat}
        loading={loading}
      />
      {workflow ? (
        <WorkflowPane
          workflow={workflow}
          nodeStatuses={nodeStatuses}
          isExecuting={isExecuting}
          executionDone={executionDone}
          onDeploy={handleDeploy}
          onCreateWebhook={handleCreateWebhook}
          webhookUrl={webhookUrl}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {loading ? (
              <div className="flex gap-1.5 justify-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "var(--accent)",
                      animation: `pulse-dot 1s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Waiting for workflow plan...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
