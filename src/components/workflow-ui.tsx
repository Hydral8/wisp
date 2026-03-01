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
      className="text-xs animate-fade-in-fast rounded"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 cursor-pointer select-none"
        onClick={toggle}
      >
        <div className="flex items-center gap-1.5">
          <span style={{ color: "var(--text-dim)" }}>{label}</span>
          {meta && <span style={{ color: "var(--text-dim)", opacity: 0.5 }}>{meta}</span>}
        </div>
        <span style={{
          color: "var(--text-dim)", fontSize: 10, display: "inline-block",
          transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none",
        }}>v</span>
      </div>
      {open && <div className="px-3 pb-2">{children}</div>}
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
        <div className="flex items-center gap-1.5 text-xs px-3 py-1 animate-fade-in-fast"
          style={{ color: "var(--text-dim)" }}>
          <div className="w-1 h-1 rounded-full" style={{ background: "var(--text-dim)" }} />
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
          <pre className="text-xs whitespace-pre-wrap"
            style={{ color: "var(--text)", maxHeight: 200, overflow: "auto" }}>
            {event.text}
          </pre>
        </Collapsible>
      );

    case "planning_warnings":
      return (
        <div className="text-xs px-3 py-1.5 rounded animate-fade-in-fast"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {event.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-1.5 py-0.5"
              style={{ color: "var(--text-dim)" }}>
              <span style={{ opacity: 0.5 }}>!</span>
              <span>{w}</span>
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
        width: 340,
        minWidth: 340,
        borderRight: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <div
        className="px-4 py-3 text-xs font-bold tracking-wider uppercase"
        style={{ color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}
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
                style={{ background: "var(--text-dim)", opacity: 0.4 }}
              />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

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
        <div className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--text-dim)" }}>
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
        <Collapsible label="Model response" defaultOpen={true}>
          <pre className="text-xs whitespace-pre-wrap"
            style={{ color: "var(--text-dim)", maxHeight: 200, overflow: "auto" }}>
            {event.text}
          </pre>
        </Collapsible>
      );

    case "planning_warnings":
      return (
        <div className="p-3 rounded-lg text-xs animate-fade-in"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {event.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-1.5 py-0.5"
              style={{ color: "var(--text-dim)" }}>
              <span style={{ opacity: 0.5 }}>!</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      );

    case "dag_complete":
      return (
        <div className="p-3 rounded-lg text-xs animate-fade-in"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text)" }} />
            <span style={{ color: "var(--text)" }}>
              Workflow ready — {event.workflow.nodes.length} steps
            </span>
          </div>
        </div>
      );

    case "planning_error":
      return (
        <div className="p-3 rounded-lg text-xs animate-fade-in"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <span style={{ color: "var(--red)" }}>
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
// ExecutionEntry
// ---------------------------------------------------------------------------

export function ExecutionEntry({ node }: { node: NodeStatus }) {
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

      {expanded && (
        <div className="mt-3 space-y-2 animate-fade-in-fast">
          {node.actionRequired && (
            <div
              className="p-2 rounded text-xs"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.4)" }}
            >
              <div className="font-medium mb-1" style={{ color: "#f59e0b" }}>
                User action required in browser
              </div>
              {node.actionMessage && (
                <div style={{ color: "var(--text-dim)" }}>{node.actionMessage}</div>
              )}
              {node.actionUrl && (
                <a
                  href={node.actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  style={{ color: "var(--blue)" }}
                >
                  Open browser view
                </a>
              )}
            </div>
          )}
          {node.browserSteps && node.browserSteps.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--blue)" }}>
                Browser Steps
              </div>
              <div className="space-y-1">
                {node.browserSteps.map((step, idx) => (
                  <div
                    key={`${step.number}-${idx}`}
                    className="text-xs p-2 rounded"
                    style={{ background: "var(--bg-surface)", color: "var(--text-dim)" }}
                  >
                    <div>Step {step.number}: {step.next_goal}</div>
                    {step.url && (
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                        style={{ color: "var(--blue)" }}
                      >
                        {step.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {(node.browserLiveUrl || node.browserShareUrl) && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--blue)" }}>
                Live View
              </div>
              <div className="space-y-1">
                {node.browserLiveUrl && (
                  <a
                    href={node.browserLiveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline block text-xs"
                    style={{ color: "var(--blue)" }}
                  >
                    Open private live view
                  </a>
                )}
                {node.browserShareUrl && (
                  <a
                    href={node.browserShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline block text-xs"
                    style={{ color: "var(--blue)" }}
                  >
                    Open shareable recording link
                  </a>
                )}
              </div>
            </div>
          )}
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
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <div className="text-sm font-medium">{workflow.name}</div>
          <div className="text-xs" style={{ color: "var(--text-dim)" }}>
            {workflow.description}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>
              Browser-use
            </span>
            <select
              className="px-2 py-1 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
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
                className="px-4 py-1.5 rounded text-xs font-medium"
                style={{ background: "var(--blue)", color: "#fff" }}
              >
                Test Run
              </button>
              <button
                onClick={() => onRun("deploy")}
                className="px-4 py-1.5 rounded text-xs font-medium"
                style={{ background: "var(--green)", color: "#000" }}
              >
                Deploy
              </button>
            </>
          )}
          {phase === "done" && runMode === "test" && (
            <>
              <button
                onClick={() => onRun("test")}
                className="px-4 py-1.5 rounded text-xs font-medium"
                style={{ background: "var(--blue)", color: "#fff" }}
              >
                Re-run
              </button>
              <button
                onClick={() => onRun("deploy")}
                className="px-4 py-1.5 rounded text-xs font-medium"
                style={{ background: "var(--green)", color: "#000" }}
              >
                Deploy
              </button>
            </>
          )}
          {phase === "done" && runMode === "deploy" && !webhookUrl && (
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

      {showExecution && <PipelineBar nodes={workflow.nodes} nodeStatuses={nodeStatuses} />}

      <div className="flex-1 overflow-y-auto p-4">
        {showExecution ? (
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
// Presets
// ---------------------------------------------------------------------------

export const PRESETS = [
  { label: "Competitive analysis pipeline", prompt: "Scrape the homepages of Stripe, Square, and Adyen, then compare their product offerings side-by-side and generate a competitive analysis summary with strengths and weaknesses" },
  { label: "Multi-source research report", prompt: "Search GitHub for the top 5 trending AI repositories this week, fetch each repo's README, then synthesize a research briefing that covers what each project does, their tech stacks, and which problems they solve" },
  { label: "Job market snapshot", prompt: "Search for senior backend engineer job postings on LinkedIn and Indeed, extract salary ranges and required skills, then produce a summary table comparing compensation across companies" },
  { label: "News digest + sentiment", prompt: "Scrape the front pages of Hacker News, TechCrunch, and The Verge, identify overlapping stories, then run sentiment analysis on coverage of the top 3 topics and generate a briefing with takeaways" },
];
