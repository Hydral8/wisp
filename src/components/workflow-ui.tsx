"use client";

import { useState, useRef, useEffect } from "react";
import type {
  Workflow,
  DAGNode,
  NodeStatus,
  ChatMessage,
  PlanningEvent,
  AppPhase,
} from "@/lib/types";

export const API = "http://localhost:8001";

// Chat entries can be plain messages or planning events
export type ChatEntry = ChatMessage & { planningEvent?: PlanningEvent };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getLevels(nodes: DAGNode[]): DAGNode[][] {
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

export async function consumeSSE(
  response: Response,
  onEvent: (event: Record<string, unknown>) => void,
) {
  const reader = response.body?.getReader();
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
        onEvent(JSON.parse(line.slice(6)));
      } catch {
        // skip malformed events
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Collapsible — reusable toggle section
// ---------------------------------------------------------------------------

export function Collapsible({
  label,
  meta,
  defaultOpen = true,
  onToggle,
  children,
}: {
  label: string;
  meta?: string;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => {
    setOpen((v) => {
      onToggle?.(!v);
      return !v;
    });
  };
  return (
    <div
      className="animate-fade-in-fast"
      style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={toggle}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 400 }}>{label}</span>
          {meta && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{meta}</span>}
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}
        >
          <path d="M2 4l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && <div style={{ padding: "0 12px 10px" }}>{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChatPlanningStep — minimal inline planning event for chat pane
// ---------------------------------------------------------------------------

export function ChatPlanningStep({ event }: { event: PlanningEvent }) {
  const [expanded, setExpanded] = useState(true);

  switch (event.type) {
    case "tool_search_start":
      return (
        <div className="flex items-center gap-1.5 animate-fade-in-fast"
          style={{ color: "var(--text-dim)", fontSize: 12, padding: "4px 0" }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--text-muted)", flexShrink: 0 }} />
          Searching: {event.query}
        </div>
      );

    case "tool_search_complete":
      return (
        <Collapsible
          label={`${event.count} tools found`}
          meta={`${event.elapsed}s`}
          defaultOpen={false}
        >
          {event.tool_names.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tool_names.map((name, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded"
                  style={{ background: "var(--bg-surface)", color: "var(--text-dim)", fontSize: 10 }}>
                  {name}
                </span>
              ))}
            </div>
          )}
        </Collapsible>
      );

    case "planning_thinking":
      return (
        <Collapsible label="Model response" defaultOpen={expanded} onToggle={setExpanded}>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-dim)", margin: 0, maxHeight: 200, overflow: "auto", whiteSpace: "pre-wrap" }}>
            {event.text}
          </p>
        </Collapsible>
      );

    case "planning_warnings":
      return (
        <div className="animate-fade-in-fast"
          style={{ borderLeft: "2px solid var(--yellow)", paddingLeft: 10, paddingTop: 4, paddingBottom: 4 }}>
          {event.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5, padding: "2px 0" }}>
              {w}
            </div>
          ))}
        </div>
      );

    case "dag_complete":
      return (
        <div className="flex items-center gap-1.5 text-xs px-3 py-1 animate-fade-in-fast"
          style={{ color: "var(--text)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text)" }} />
          Workflow ready — {event.workflow.nodes.length} steps
        </div>
      );

    case "planning_error":
      return (
        <div className="text-xs px-3 py-1 animate-fade-in-fast"
          style={{ color: "var(--red)" }}>
          {event.message.slice(0, 200)}
        </div>
      );

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// ChatPane
// ---------------------------------------------------------------------------

export function ChatPane({
  messages,
  onSend,
  loading,
}: {
  messages: ChatEntry[];
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
        width: 320,
        minWidth: 320,
        borderRight: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-dim)", borderBottom: "1px solid var(--border)", padding: "10px 16px" }}
      >
        Chat
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="animate-fade-in-fast">
            {m.planningEvent ? (
              <ChatPlanningStep event={m.planningEvent} />
            ) : m.role === "user" ? (
              <div className="flex justify-end">
                <div
                  style={{ padding: "8px 12px", borderRadius: 10, fontSize: 13, maxWidth: 240, background: "var(--accent-dim)", color: "#fff", lineHeight: 1.5 }}
                >
                  {m.content}
                </div>
              </div>
            ) : m.role === "system" ? (
              <div
                style={{ fontSize: 12, color: "var(--blue)", paddingLeft: 10, borderLeft: "2px solid rgba(96,165,250,0.4)" }}
              >
                {m.content}
              </div>
            ) : (
              <div
                style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}
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
                style={{ background: "var(--text-dim)", opacity: 0.4 }}
              />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{
              flex: 1, padding: "7px 12px", borderRadius: 8, fontSize: 13,
              outline: "none", border: "1px solid var(--border)",
              background: "transparent", color: "var(--text)", fontFamily: "inherit",
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
            style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: "none", cursor: "pointer", fontFamily: "inherit",
              background: "var(--accent)", color: "#fff",
              opacity: loading || !input.trim() ? 0.4 : 1,
              transition: "opacity 0.15s",
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
// PlanningFeed
// ---------------------------------------------------------------------------

export function PlanningFeed({ events }: { events: PlanningEvent[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  const isDone = events.some((e) => e.type === "dag_complete" || e.type === "planning_error");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const visible = events.filter((e) =>
    e.type === "tool_search_complete" || e.type === "planning_thinking" ||
    e.type === "planning_warnings" || e.type === "dag_complete" || e.type === "planning_error"
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-slide-right">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-dim)" }}>
          Planning
        </div>
        {!isDone && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text-dim)", opacity: 0.6 }} />
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>Thinking...</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {visible.map((e, i) => (
          <PlanningFeedCard key={i} event={e} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function PlanningFeedCard({ event }: { event: PlanningEvent }) {
  switch (event.type) {
    case "tool_search_complete":
      return (
        <Collapsible
          label={`"${event.query}"`}
          meta={`${event.count} tools · ${event.elapsed}s`}
          defaultOpen={true}
        >
          {event.tool_names.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {event.tool_names.map((name, i) => (
                <span key={i} style={{
                  padding: "2px 8px", borderRadius: 12,
                  border: "1px solid var(--border)",
                  color: "var(--text-dim)", fontSize: 11,
                }}>
                  {name}
                </span>
              ))}
            </div>
          )}
        </Collapsible>
      );

    case "planning_thinking":
      return (
        <Collapsible label="Model response" defaultOpen={true}>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-dim)", margin: 0, maxHeight: 200, overflow: "auto", whiteSpace: "pre-wrap" }}>
            {event.text}
          </p>
        </Collapsible>
      );

    case "planning_warnings":
      return (
        <div className="animate-fade-in"
          style={{ borderLeft: "2px solid var(--yellow)", paddingLeft: 10, paddingTop: 4, paddingBottom: 4 }}>
          {event.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 12, color: "var(--text-dim)", padding: "2px 0", lineHeight: 1.5 }}>
              {w}
            </div>
          ))}
        </div>
      );

    case "dag_complete":
      return (
        <div className="animate-fade-in"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "var(--text)" }}>
            Workflow ready — {event.workflow.nodes.length} steps
          </span>
        </div>
      );

    case "planning_error":
      return (
        <div className="animate-fade-in"
          style={{ borderLeft: "2px solid var(--red)", paddingLeft: 10, paddingTop: 4, paddingBottom: 4 }}>
          <span style={{ fontSize: 12, color: "var(--red)" }}>
            {event.message.slice(0, 300)}
          </span>
        </div>
      );

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// PipelineBar
// ---------------------------------------------------------------------------

export function PipelineBar({
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
// Result formatting helpers
// ---------------------------------------------------------------------------

function isLLMNode(node: NodeStatus) {
  return node.server_name === "__llm__";
}

function friendlyLabel(node: NodeStatus) {
  if (isLLMNode(node)) return node.step || "AI Analysis";
  return node.step || node.tool_name;
}

function friendlySubtitle(node: NodeStatus) {
  if (isLLMNode(node)) return "Language model";
  return `${node.server_name} / ${node.tool_name}`;
}

/** Extract a human-readable string from a result object. */
function formatResult(result: unknown): string {
  if (result == null) return "";
  if (typeof result === "string") return result;
  // { result: "..." } from LLM nodes
  if (typeof result === "object" && !Array.isArray(result)) {
    const obj = result as Record<string, unknown>;
    // If it has a single "result" key with a string, surface that
    if (typeof obj.result === "string") return obj.result;
    // If it has a "text" or "content" key
    if (typeof obj.text === "string") return obj.text;
    if (typeof obj.content === "string") return obj.content;
    // If it has "_truncated" flag, show preview
    if (obj._truncated && typeof obj.preview === "string") return obj.preview;
  }
  // Fallback: pretty JSON
  return JSON.stringify(result, null, 2);
}

/** Trim long text for a preview line. */
function previewText(text: string, maxLen = 120): string {
  const oneLine = text.replace(/\n/g, " ").trim();
  if (oneLine.length <= maxLen) return oneLine;
  return oneLine.slice(0, maxLen) + "…";
}

// ---------------------------------------------------------------------------
// ExecutionEntry
// ---------------------------------------------------------------------------

export function ExecutionEntry({ node, isFinal }: { node: NodeStatus; isFinal?: boolean }) {
  const [expanded, setExpanded] = useState(!!isFinal);
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

  const resultText = node.result !== undefined ? formatResult(node.result) : "";
  const hasResult = resultText.length > 0;

  return (
    <div
      className={`animate-fade-in transition-all ${statusClass}`}
      style={{
        background: "var(--bg-card)",
        border: isFinal ? "1px solid var(--accent)" : "1px solid var(--border)",
        borderRadius: 10,
      }}
    >
      {/* Header — always visible */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: statusColor,
              animation:
                node.status === "running" ? "pulse-dot 1s ease-in-out infinite" : "none",
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", lineHeight: 1.3 }}>
              {isFinal ? "Final Result" : friendlyLabel(node)}
            </div>
            <div style={{ fontSize: 11, marginTop: 2, color: "var(--text-dim)" }}>
              {isFinal ? friendlyLabel(node) : friendlySubtitle(node)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {node.status === "running" && (
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Running...</span>
          )}
          {node.elapsed !== undefined && node.status !== "running" && (
            <span style={{ fontSize: 11, color: "var(--text-dim)", fontVariantNumeric: "tabular-nums" }}>
              {node.elapsed}s
            </span>
          )}
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transition: "transform 0.15s", transform: expanded ? "rotate(180deg)" : "none", flexShrink: 0 }}
          >
            <path d="M2 4l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Result preview — shows a one-liner when collapsed */}
      {!expanded && hasResult && node.status === "complete" && (
        <div
          style={{ padding: "0 16px 12px", marginTop: -2, fontSize: 12, color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {previewText(resultText)}
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div
          className="animate-fade-in-fast"
          style={{ padding: "12px 16px 16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 12 }}
        >
          {/* Action required banner */}
          {node.actionRequired && (
            <div style={{ padding: 8, borderRadius: 6, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.4)" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#f59e0b", marginBottom: 4 }}>
                User action required in browser
              </div>
              {node.actionMessage && (
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{node.actionMessage}</div>
              )}
              {node.actionUrl && (
                <a href={node.actionUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "underline" }}>
                  Open browser view
                </a>
              )}
            </div>
          )}

          {/* Browser steps */}
          {node.browserSteps && node.browserSteps.length > 0 && (
            <Collapsible label="Browser steps" meta={`${node.browserSteps.length} steps`} defaultOpen={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {node.browserSteps.map((step, idx) => (
                  <div key={`${step.number}-${idx}`} style={{ fontSize: 11, color: "var(--text-dim)", padding: "4px 0" }}>
                    Step {step.number}: {step.next_goal}
                    {step.url && (
                      <a href={step.url} target="_blank" rel="noreferrer" style={{ color: "var(--blue)", textDecoration: "underline", marginLeft: 6 }}>
                        {step.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Collapsible>
          )}

          {/* Live view links */}
          {(node.browserLiveUrl || node.browserShareUrl) && (
            <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
              {node.browserLiveUrl && (
                <a href={node.browserLiveUrl} target="_blank" rel="noreferrer" style={{ color: "var(--blue)", textDecoration: "underline" }}>
                  Live view
                </a>
              )}
              {node.browserShareUrl && (
                <a href={node.browserShareUrl} target="_blank" rel="noreferrer" style={{ color: "var(--blue)", textDecoration: "underline" }}>
                  Share link
                </a>
              )}
            </div>
          )}

          {/* Result — readable text */}
          {hasResult && (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.65,
                color: "var(--text)",
                whiteSpace: "pre-wrap",
                maxHeight: isFinal ? 480 : 280,
                overflow: "auto",
              }}
            >
              {resultText}
            </p>
          )}

          {/* Error — left-border accent only */}
          {node.error && (
            <div style={{ borderLeft: "2px solid var(--red)", paddingLeft: 10 }}>
              <div style={{ fontSize: 12, color: "var(--red)" }}>
                {node.error}
              </div>
            </div>
          )}

          {/* Technical details — collapsible */}
          {node.arguments && Object.keys(node.arguments).length > 0 && (
            <Collapsible label="Technical details" defaultOpen={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                  {node.server_name} / {node.tool_name}
                </div>
                <pre
                  className="font-mono"
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "var(--text-dim)",
                    maxHeight: 150,
                    overflow: "auto",
                    borderLeft: "2px solid var(--border)",
                    paddingLeft: 10,
                    lineHeight: 1.5,
                  }}
                >
                  {JSON.stringify(node.arguments, null, 2)}
                </pre>
              </div>
            </Collapsible>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// WorkflowPane
// ---------------------------------------------------------------------------

export function WorkflowPane({
  workflow,
  nodeStatuses,
  phase,
  runMode,
  browserUseMode,
  onChangeBrowserUseMode,
  onRun,
  onCreateWebhook,
  webhookUrl,
}: {
  workflow: Workflow;
  nodeStatuses: Map<string, NodeStatus>;
  phase: AppPhase;
  runMode: "deploy" | "test" | null;
  browserUseMode: "local" | "remote";
  onChangeBrowserUseMode: (mode: "local" | "remote") => void;
  onRun: (mode: "deploy" | "test") => void;
  onCreateWebhook: () => void;
  webhookUrl: string | null;
}) {
  const levels = getLevels(workflow.nodes);
  const showExecution = phase === "executing" || phase === "done";

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-slide-right">
      <div
        style={{ borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{workflow.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2, lineHeight: 1.4 }}>
            {workflow.description}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Browser</span>
            <select
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                fontSize: 11,
                outline: "none",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontFamily: "inherit",
              }}
              value={browserUseMode}
              onChange={(e) => onChangeBrowserUseMode(e.target.value as "local" | "remote")}
            >
              <option value="local">Local</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          {phase === "preview" && (
            <>
              <button
                onClick={() => onRun("test")}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "inherit" }}
              >
                Test Run
              </button>
              <button
                onClick={() => onRun("deploy")}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}
              >
                Deploy
              </button>
            </>
          )}
          {phase === "done" && runMode === "test" && (
            <>
              <button
                onClick={() => onRun("test")}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "inherit" }}
              >
                Re-run
              </button>
              <button
                onClick={() => onRun("deploy")}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}
              >
                Deploy
              </button>
            </>
          )}
          {phase === "done" && runMode === "deploy" && !webhookUrl && (
            <button
              onClick={onCreateWebhook}
              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}
            >
              Create Webhook
            </button>
          )}
        </div>
      </div>

      {showExecution && <PipelineBar nodes={workflow.nodes} nodeStatuses={nodeStatuses} />}

      <div className="flex-1 overflow-y-auto p-4">
        {showExecution ? (
          <div className="space-y-3">
            {(() => {
              const visibleNodes = workflow.nodes.filter((n) => nodeStatuses.has(n.id));
              const lastIdx = visibleNodes.length - 1;
              const allDone = phase === "done";
              return visibleNodes.map((n, i) => (
                <ExecutionEntry
                  key={n.id}
                  node={nodeStatuses.get(n.id)!}
                  isFinal={allDone && i === lastIdx}
                />
              ));
            })()}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {levels.map((level, li) => (
              <div key={li}>
                <div
                  style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}
                >
                  Level {li + 1}
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                  {level.map((node) => {
                    const isLlm = node.server_name === "__llm__";
                    return (
                      <div
                        key={node.id}
                        style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)" }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{node.step}</div>
                        <div style={{ fontSize: 11, marginTop: 3, color: "var(--text-dim)" }}>
                          {isLlm ? "Language model" : `${node.server_name} / ${node.tool_name}`}
                        </div>
                        {isLlm && typeof node.arguments.prompt === "string" && (
                          <p style={{ fontSize: 12, marginTop: 8, marginBottom: 0, color: "var(--text-dim)", lineHeight: 1.5 }}>
                            {node.arguments.prompt}
                          </p>
                        )}
                        {!isLlm && Object.keys(node.arguments).length > 0 && (
                          <pre
                            className="font-mono"
                            style={{
                              marginTop: 8,
                              marginBottom: 0,
                              fontSize: 11,
                              color: "var(--text-dim)",
                              borderLeft: "2px solid var(--border)",
                              paddingLeft: 8,
                              lineHeight: 1.5,
                              overflow: "auto",
                            }}
                          >
                            {JSON.stringify(node.arguments, null, 2)}
                          </pre>
                        )}
                      </div>
                    );
                  })}
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
// Presets
// ---------------------------------------------------------------------------

export const PRESETS = [
  { label: "Competitive analysis pipeline", prompt: "Scrape the homepages of Stripe, Square, and Adyen, then compare their product offerings side-by-side and generate a competitive analysis summary with strengths and weaknesses" },
  { label: "Multi-source research report", prompt: "Search GitHub for the top 5 trending AI repositories this week, fetch each repo's README, then synthesize a research briefing that covers what each project does, their tech stacks, and which problems they solve" },
  { label: "Job market snapshot", prompt: "Search for senior backend engineer job postings on LinkedIn and Indeed, extract salary ranges and required skills, then produce a summary table comparing compensation across companies" },
  { label: "News digest + sentiment", prompt: "Scrape the front pages of Hacker News, TechCrunch, and The Verge, identify overlapping stories, then run sentiment analysis on coverage of the top 3 topics and generate a briefing with takeaways" },
  { label: "UML diagram on draw.io", prompt: "Go to draw.io (https://app.diagrams.net) and create a UML class diagram for a simple e-commerce application with entities for User, Product, Order, and OrderItem — including their attributes, methods, and relationships (associations, multiplicities). Save the diagram and take a screenshot." },
  { label: "Star today's trending GitHub repos", prompt: "Fetch today's top trending repositories on GitHub, then for each one check whether I have already starred it and, if not, star it on my behalf. Report which repos were newly starred and which were already starred." },
];
