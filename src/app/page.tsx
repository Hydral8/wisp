"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type {
  Workflow,
  DAGNode,
  NodeStatus,
  ChatMessage,
  PlanningEvent,
  AppPhase,
} from "@/lib/types";

const API = "http://localhost:8001";

// Chat entries can be plain messages or planning events
type ChatEntry = ChatMessage & { planningEvent?: PlanningEvent };

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

async function consumeSSE(
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

function Collapsible({
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

function ChatPlanningStep({ event }: { event: PlanningEvent }) {
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

function ChatPane({
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
      {/* Header */}
      <div
        className="px-4 py-3 text-xs font-bold tracking-wider uppercase"
        style={{ color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}
      >
        Chat
      </div>

      {/* Messages */}
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
// PlanningFeed — clean summary: tool searches, thinking (collapsible), result
// ---------------------------------------------------------------------------

function PlanningFeed({ events }: { events: PlanningEvent[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  const isDone = events.some((e) => e.type === "dag_complete" || e.type === "planning_error");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  // Filter to only meaningful events
  const visible = events.filter((e) =>
    e.type === "tool_search_complete" || e.type === "planning_thinking" ||
    e.type === "dag_complete" || e.type === "planning_error"
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

function WorkflowPane({
  workflow,
  nodeStatuses,
  phase,
  runMode,
  onRun,
  onCreateWebhook,
  webhookUrl,
}: {
  workflow: Workflow;
  nodeStatuses: Map<string, NodeStatus>;
  phase: AppPhase;
  runMode: "deploy" | "test" | null;
  onRun: (mode: "deploy" | "test") => void;
  onCreateWebhook: () => void;
  webhookUrl: string | null;
}) {
  const levels = getLevels(workflow.nodes);
  const showExecution = phase === "executing" || phase === "done";

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

      {/* Pipeline bar */}
      {showExecution && <PipelineBar nodes={workflow.nodes} nodeStatuses={nodeStatuses} />}

      {/* Content */}
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
// Home (main page)
// ---------------------------------------------------------------------------

const PRESETS = [
  { label: "Competitive analysis pipeline", prompt: "Scrape the homepages of Stripe, Square, and Adyen, then compare their product offerings side-by-side and generate a competitive analysis summary with strengths and weaknesses" },
  { label: "Multi-source research report", prompt: "Search GitHub for the top 5 trending AI repositories this week, fetch each repo's README, then synthesize a research briefing that covers what each project does, their tech stacks, and which problems they solve" },
  { label: "Job market snapshot", prompt: "Search for senior backend engineer job postings on LinkedIn and Indeed, extract salary ranges and required skills, then produce a summary table comparing compensation across companies" },
  { label: "News digest + sentiment", prompt: "Scrape the front pages of Hacker News, TechCrunch, and The Verge, identify overlapping stories, then run sentiment analysis on coverage of the top 3 topics and generate a briefing with takeaways" },
];

export default function Home() {
  const [input, setInput] = useState(PRESETS[0].prompt);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [planningEvents, setPlanningEvents] = useState<PlanningEvent[]>([]);
  const [nodeStatuses, setNodeStatuses] = useState<Map<string, NodeStatus>>(new Map());
  const [runMode, setRunMode] = useState<"deploy" | "test" | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const streamPlan = useCallback(
    async (prompt: string, existingSessionId?: string | null) => {
      setPhase("planning");
      setPlanningEvents([]);

      const body: Record<string, string> = { prompt };
      if (existingSessionId) body.session_id = existingSessionId;

      try {
        const res = await fetch(`${API}/plan/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        await consumeSSE(res, (raw) => {
          const event = raw as unknown as PlanningEvent & { session_id?: string };

          if (event.type === "session_init") {
            setSessionId(event.session_id ?? null);
            return;
          }

          const pe = event as PlanningEvent;

          // Accumulate planning events for the right-pane feed
          setPlanningEvents((prev) => [...prev, pe]);

          // Push every planning event into chat as a collapsible entry
          setChatMessages((prev) => [
            ...prev,
            { role: "system", content: "", planningEvent: pe },
          ]);

          // DAG complete — transition to preview
          if (pe.type === "dag_complete") {
            setWorkflow(pe.workflow);
            setPhase("preview");
          }

          // Model is explaining why it can't do something — show as assistant message, stay conversational
          if (pe.type === "planning_message") {
            setChatMessages((prev) => [
              ...prev,
              { role: "assistant", content: pe.text },
            ]);
            setPhase("idle");
          }

          // Error
          if (pe.type === "planning_error") {
            setPhase("idle");
          }
        });
      } catch (err) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${err}` },
        ]);
        setPhase("idle");
      }
    },
    [],
  );

  const handlePlan = useCallback(
    async (prompt: string) => {
      setStarted(true);
      setChatMessages((prev) => [...prev, { role: "user", content: prompt }]);
      await streamPlan(prompt);
    },
    [streamPlan],
  );

  const handleChat = useCallback(
    async (message: string) => {
      if (!sessionId) return;
      setChatMessages((prev) => [...prev, { role: "user", content: message }]);
      await streamPlan(message, sessionId);
    },
    [sessionId, streamPlan],
  );

  const handleRun = useCallback(
    async (mode: "deploy" | "test") => {
      if (!workflow) return;
      setRunMode(mode);
      setPhase("executing");
      setNodeStatuses(new Map());
      setWebhookUrl(null);

      try {
        const res = await fetch(`${API}/deploy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workflow_id: workflow.id }),
        });

        await consumeSSE(res, (event) => {
          if (event.type === "node_start") {
            const d = event.data as Record<string, unknown>;
            setNodeStatuses((prev) => {
              const next = new Map(prev);
              next.set(event.node_id as string, {
                id: event.node_id as string,
                step: d.step as string,
                server_name: d.server_name as string,
                tool_name: d.tool_name as string,
                arguments: d.arguments as Record<string, unknown>,
                status: "running",
                level: d.level as number,
                progress: d.progress as number,
              });
              return next;
            });
          } else if (event.type === "node_complete") {
            const d = event.data as Record<string, unknown>;
            setNodeStatuses((prev) => {
              const next = new Map(prev);
              const existing = next.get(event.node_id as string);
              next.set(event.node_id as string, {
                ...existing!,
                status: "complete",
                result: d.result,
                elapsed: d.elapsed as number,
                progress: d.progress as number,
              });
              return next;
            });
          } else if (event.type === "node_error") {
            const d = event.data as Record<string, unknown>;
            setNodeStatuses((prev) => {
              const next = new Map(prev);
              const existing = next.get(event.node_id as string);
              next.set(event.node_id as string, {
                ...existing!,
                status: "error",
                error: d.error as string,
                progress: d.progress as number,
              });
              return next;
            });
          }
        });
      } catch (err) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Run error: ${err}` },
        ]);
      } finally {
        setPhase("done");
      }
    },
    [workflow],
  );

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
            ref={textareaRef}
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
                onClick={() => {
                  setInput(p.prompt);
                  textareaRef.current?.focus();
                }}
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

  // Split-pane: chat left, right pane varies by phase
  const isLoading = phase === "planning" || phase === "executing";

  return (
    <div className="h-screen flex">
      <ChatPane
        messages={chatMessages}
        onSend={handleChat}
        loading={isLoading}
      />
      {phase === "planning" ? (
        <PlanningFeed events={planningEvents} />
      ) : workflow ? (
        <WorkflowPane
          workflow={workflow}
          nodeStatuses={nodeStatuses}
          phase={phase}
          runMode={runMode}
          onRun={handleRun}
          onCreateWebhook={handleCreateWebhook}
          webhookUrl={webhookUrl}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            Waiting for workflow plan...
          </p>
        </div>
      )}
    </div>
  );
}
