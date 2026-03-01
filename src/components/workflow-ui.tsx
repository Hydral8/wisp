"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  Workflow,
  DAGNode,
  NodeStatus,
  ChatMessage,
  PlanningEvent,
  AppPhase,
  ConfigurableParam,
} from "@/lib/types";

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
          <div className="markdown-body" style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text)", maxHeight: 200, overflow: "auto" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.text || ""}</ReactMarkdown>
          </div>
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
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  const toggleVoice = useCallback(() => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results as SpeechRecognitionResultList)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening]);

  return (
    <div
      className="flex flex-col h-full animate-slide-left"
      style={{
        width: 420,
        minWidth: 420,
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
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={toggleVoice}
            title={listening ? "Stop listening" : "Voice input"}
            style={{
              width: 34, height: 34, borderRadius: 8, border: "none",
              background: listening ? "var(--red, #ef4444)" : "transparent",
              color: listening ? "#fff" : "var(--text-muted)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { if (!listening) e.currentTarget.style.color = "var(--text)"; }}
            onMouseLeave={(e) => { if (!listening) e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 7.5a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M8 13v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {listening && (
              <div style={{
                position: "absolute", width: 34, height: 34, borderRadius: 8,
                border: "2px solid var(--red, #ef4444)", animation: "pulse-dot 1s ease-in-out infinite",
                pointerEvents: "none",
              }} />
            )}
          </button>
          <input
            style={{
              flex: 1, padding: "7px 12px", borderRadius: 8, fontSize: 13,
              outline: "none", border: listening ? "1px solid var(--red, #ef4444)" : "1px solid var(--border)",
              background: "transparent", color: "var(--text)", fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            placeholder={listening ? "Listening..." : "Follow up..."}
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

export function PlanningFeed({
  events,
  onConvertToWorkflow,
  convertingToWorkflow,
}: {
  events: PlanningEvent[];
  onConvertToWorkflow?: () => void;
  convertingToWorkflow?: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const isDone = events.some((e) => e.type === "agent_done" || e.type === "dag_complete" || e.type === "planning_error");

  // Active live_url: show when browser_task returns a live_url,
  // hide when monitor_task completes (is_success is set), reshow on new browser_task.
  const liveUrl = useMemo(() => {
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      if (e.type !== "tool_exec_complete") continue;
      const tn = (e as unknown as Record<string, unknown>).tool_name;
      const r = e.result;
      const obj = (r && typeof r === "object" && !Array.isArray(r))
        ? r as Record<string, unknown> : null;
      // monitor_task finished → session is done, hide iframe
      if (tn === "monitor_task" && obj && obj.is_success !== undefined && obj.is_success !== null) {
        return null;
      }
      // browser_task returned a live_url → session is active
      if (tn === "browser_task" && obj && typeof obj.live_url === "string" && obj.live_url.startsWith("http")) {
        return obj.live_url;
      }
    }
    return null;
  }, [events]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const visible = events.filter((e) =>
    e.type === "tool_search_complete" || e.type === "planning_thinking" ||
    e.type === "planning_warnings" || e.type === "dag_complete" || e.type === "planning_error" ||
    e.type === "tool_exec_start" || e.type === "tool_exec_complete" || e.type === "agent_done"
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-slide-right">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-dim)" }}>
          Agent
        </div>
        <div className="flex items-center gap-2">
          {!isDone && (
            <>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text-dim)", opacity: 0.6 }} />
              <span className="text-xs" style={{ color: "var(--text-dim)" }}>Working...</span>
            </>
          )}
          {isDone && onConvertToWorkflow && (
            <button
              onClick={onConvertToWorkflow}
              disabled={convertingToWorkflow}
              style={{
                padding: "5px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                cursor: convertingToWorkflow ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: convertingToWorkflow ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {convertingToWorkflow && (
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: "spin 1s linear infinite" }}>
                  <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                  <path d="M12.5 7a5.5 5.5 0 0 0-5.5-5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              )}
              {convertingToWorkflow ? "Converting..." : "Convert to Workflow"}
            </button>
          )}
        </div>
      </div>
      {/* Live browser view — shows during active browser_task, hides when monitor_task completes */}
      {liveUrl && (
        <div style={{ borderBottom: "1px solid var(--border)", padding: 12 }}>
          <BrowserLiveView liveUrl={liveUrl} isRunning={!isDone} />
        </div>
      )}
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
          <div className="markdown-body" style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text)", maxHeight: 300, overflow: "auto" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.text || ""}</ReactMarkdown>
          </div>
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

    case "tool_exec_start": {
      return (
        <div className="flex items-center gap-1.5 animate-fade-in-fast" style={{ padding: "4px 0" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--blue, #3b82f6)" }} />
          <span style={{ fontSize: 12, color: "var(--text)" }}>
            Executing: {event.server_name} / {event.tool_name}
          </span>
        </div>
      );
    }

    case "tool_exec_complete": {
      const result = event.result;
      const resultObj = (result && typeof result === "object" && !Array.isArray(result))
        ? result as Record<string, unknown> : null;
      const liveUrl = resultObj && typeof resultObj.live_url === "string" ? resultObj.live_url : undefined;
      const preview = JSON.stringify(result, null, 2);
      return (
        <Collapsible
          label={`${event.server_name} / ${event.tool_name}`}
          meta={`${event.success ? "OK" : "FAIL"} · ${event.elapsed}s`}
          defaultOpen={!event.success}
        >
          {liveUrl && (
            <div style={{ marginBottom: 8 }}>
              <a href={liveUrl} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: "var(--blue)", textDecoration: "underline" }}>
                Open live browser view
              </a>
            </div>
          )}
          <pre style={{ fontSize: 10, lineHeight: 1.4, color: "var(--text-dim)", margin: 0, maxHeight: 200, overflow: "auto", whiteSpace: "pre-wrap" }}>
            {preview.length > 2000 ? preview.slice(0, 2000) + "\n..." : preview}
          </pre>
        </Collapsible>
      );
    }

    case "agent_done": {
      return (
        <div className="animate-fade-in" style={{ padding: "8px 0" }}>
          <div className="flex items-center gap-1.5" style={{ marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>Agent complete</span>
          </div>
          <div className="markdown-body" style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text)", margin: 0 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.text || ""}</ReactMarkdown>
          </div>
        </div>
      );
    }

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

// ---------------------------------------------------------------------------
// BrowserLiveView — embedded browser view via iframe
// ---------------------------------------------------------------------------

function BrowserLiveView({
  liveUrl,
  isRunning,
}: {
  liveUrl: string;
  isRunning?: boolean;
}) {
  const [maximized, setMaximized] = useState(false);

  const iframeContent = (
    <div
      className="animate-fade-in-fast"
      style={{
        position: "relative",
        background: "#000",
        borderRadius: maximized ? 0 : 8,
        overflow: "hidden",
        border: maximized ? "none" : "1px solid var(--border)",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {isRunning && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--green)", animation: "pulse-dot 1s ease-in-out infinite" }}
              />
              <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 500 }}>LIVE</span>
            </div>
          )}
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Browser session</span>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => setMaximized(!maximized)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: 4,
              color: "var(--text-dim)",
              fontSize: 11,
            }}
            title={maximized ? "Minimize" : "Maximize"}
          >
            {maximized ? "↙" : "↗"}
          </button>
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: 4,
              color: "var(--text-dim)",
              fontSize: 11,
              textDecoration: "none",
            }}
            title="Open in new tab"
          >
            ↗ Open
          </a>
        </div>
      </div>

      {/* Iframe */}
      <iframe
        src={liveUrl}
        style={{
          width: "100%",
          height: maximized ? "calc(100vh - 80px)" : 400,
          border: "none",
          display: "block",
          background: "#111",
        }}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );

  // Maximized: render as fixed overlay
  if (maximized) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          flexDirection: "column",
          padding: 16,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMaximized(false);
        }}
      >
        {iframeContent}
      </div>
    );
  }

  return iframeContent;
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
  const [showFullResult, setShowFullResult] = useState(false);
  const isLlm = isLLMNode(node);
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
  const isLongResult = resultText.length > 400;
  const collapsedHeight = isFinal ? 320 : 180;

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
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", lineHeight: 1.3 }}>
                {isFinal ? "Final Result" : friendlyLabel(node)}
              </span>
              {isLlm && (
                <span style={{
                  fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 500,
                  background: "rgba(124,107,240,0.15)", color: "var(--accent)",
                }}>
                  LLM
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, marginTop: 2, color: "var(--text-dim)" }}>
              {isFinal ? friendlyLabel(node) : friendlySubtitle(node)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {node.status === "complete" && (
            <span style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 4,
              background: "rgba(74,222,128,0.12)", color: "var(--green)", fontWeight: 500,
            }}>
              Done
            </span>
          )}
          {node.status === "running" && (
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Running...</span>
          )}
          {node.elapsed !== undefined && node.status !== "running" && (
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
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
          {/* LLM prompt preview */}
          {isLlm && typeof node.arguments?.prompt === "string" && (
            <div style={{
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(124,107,240,0.06)", borderLeft: "2px solid var(--accent)",
            }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "var(--accent)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Prompt
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                {node.arguments.prompt as string}
              </div>
            </div>
          )}

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

          {/* Result — rendered as markdown */}
          {hasResult && (
            <div style={{ position: "relative" }}>
              <div
                className="markdown-result"
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "var(--text)",
                  maxHeight: showFullResult ? "none" : collapsedHeight,
                  overflow: "hidden",
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{resultText}</ReactMarkdown>
              </div>
              {isLongResult && !showFullResult && (
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                  background: "linear-gradient(transparent, var(--bg-card))",
                  display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4,
                }}>
                  <button
                    onClick={() => setShowFullResult(true)}
                    style={{
                      fontSize: 11, fontWeight: 500, color: "var(--accent)", background: "var(--bg-card)",
                      border: "1px solid var(--border)", borderRadius: 6, padding: "3px 12px",
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Show more
                  </button>
                </div>
              )}
              {isLongResult && showFullResult && (
                <button
                  onClick={() => setShowFullResult(false)}
                  style={{
                    fontSize: 11, fontWeight: 500, color: "var(--text-muted)", background: "none",
                    border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 4,
                  }}
                >
                  Show less
                </button>
              )}
            </div>
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
// WorkflowGraph — n8n-style horizontal DAG visualization
// ---------------------------------------------------------------------------

function WorkflowGraph({
  nodes,
  configurableParams,
}: {
  nodes: DAGNode[];
  configurableParams?: ConfigurableParam[];
}) {
  const levels = getLevels(nodes);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [paths, setPaths] = useState<
    { d: string; cx: number; cy: number; key: string }[]
  >([]);

  // Build a map: output_key → node id that produces it
  const outputKeyOwner = useMemo(() => {
    const m = new Map<string, string>();
    for (const n of nodes) if (n.output_key) m.set(n.output_key, n.id);
    return m;
  }, [nodes]);

  // Compute SVG bezier paths from DOM positions
  const computePaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const next: typeof paths = [];

    // Dependency edges
    for (const n of nodes) {
      for (const depId of n.depends_on) {
        const srcEl = nodeRefs.current.get(depId);
        const tgtEl = nodeRefs.current.get(n.id);
        if (!srcEl || !tgtEl) continue;
        const sr = srcEl.getBoundingClientRect();
        const tr = tgtEl.getBoundingClientRect();
        const x1 = sr.right - cRect.left;
        const y1 = sr.top + sr.height / 2 - cRect.top;
        const x2 = tr.left - cRect.left;
        const y2 = tr.top + tr.height / 2 - cRect.top;
        const cpx = Math.abs(x2 - x1) * 0.45;
        next.push({
          d: `M ${x1} ${y1} C ${x1 + cpx} ${y1}, ${x2 - cpx} ${y2}, ${x2} ${y2}`,
          cx: x2,
          cy: y2,
          key: `dep-${depId}-${n.id}`,
        });
      }
    }

    // Configurable param edges
    if (configurableParams) {
      for (const cp of configurableParams) {
        const paramId = `param-${cp.nodeId}-${cp.paramKey}`;
        const srcEl = nodeRefs.current.get(paramId);
        const tgtEl = nodeRefs.current.get(cp.nodeId);
        if (!srcEl || !tgtEl) continue;
        const sr = srcEl.getBoundingClientRect();
        const tr = tgtEl.getBoundingClientRect();
        const x1 = sr.right - cRect.left;
        const y1 = sr.top + sr.height / 2 - cRect.top;
        const x2 = tr.left - cRect.left;
        const y2 = tr.top + tr.height / 2 - cRect.top;
        const cpx = Math.abs(x2 - x1) * 0.45;
        next.push({
          d: `M ${x1} ${y1} C ${x1 + cpx} ${y1}, ${x2 - cpx} ${y2}, ${x2} ${y2}`,
          cx: x2,
          cy: y2,
          key: `param-${cp.nodeId}-${cp.paramKey}`,
        });
      }
    }

    setPaths(next);
  }, [nodes, configurableParams]);

  useEffect(() => {
    requestAnimationFrame(computePaths);
    const ro = new ResizeObserver(computePaths);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computePaths, nodes]);

  const setNodeRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) nodeRefs.current.set(id, el);
      else nodeRefs.current.delete(id);
    },
    [],
  );

  const hasParams = configurableParams && configurableParams.length > 0;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "flex", gap: 80, padding: "16px 8px", minWidth: "fit-content" }}
    >
      {/* SVG overlay */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {paths.map((p) => (
          <g key={p.key}>
            <path d={p.d} fill="none" stroke="rgba(160,160,170,0.5)" strokeWidth={1.5} />
            <circle cx={p.cx} cy={p.cy} r={3} fill="rgba(160,160,170,0.6)" />
          </g>
        ))}
      </svg>

      {/* Input param column */}
      {hasParams && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", minWidth: 200 }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
            Inputs
          </div>
          {configurableParams.map((cp) => {
            const paramId = `param-${cp.nodeId}-${cp.paramKey}`;
            return (
              <div
                key={paramId}
                ref={setNodeRef(paramId)}
                style={{
                  width: 200,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderLeft: "3px solid var(--green)",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{cp.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <span style={{
                    fontSize: 10, padding: "1px 6px", borderRadius: 4,
                    background: "rgba(74,222,128,0.12)", color: "var(--green)", fontWeight: 500,
                  }}>
                    {cp.type}
                  </span>
                  {cp.defaultValue != null && (
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      = {String(cp.defaultValue).slice(0, 20)}
                    </span>
                  )}
                </div>
                {/* Right handle */}
                <div style={{
                  position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)",
                  width: 10, height: 10, borderRadius: "50%",
                  background: "var(--bg-card)", border: "2px solid var(--green)",
                }} />
              </div>
            );
          })}
        </div>
      )}

      {/* DAG columns */}
      {levels.map((level, li) => (
        <div key={li} style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
            Level {li + 1}
          </div>
          {level.map((node) => {
            const isLlm = node.server_name === "__llm__";
            return (
              <div
                key={node.id}
                ref={setNodeRef(node.id)}
                style={{
                  width: 260,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderLeft: isLlm ? "3px solid var(--accent)" : "3px solid var(--blue)",
                  position: "relative",
                }}
              >
                {/* Left handle */}
                {node.depends_on.length > 0 && (
                  <div style={{
                    position: "absolute", left: -5, top: "50%", transform: "translateY(-50%)",
                    width: 10, height: 10, borderRadius: "50%",
                    background: "var(--bg-card)", border: "2px solid var(--border)",
                  }} />
                )}

                {/* Title */}
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{node.step}</div>

                {/* Subtitle */}
                <div style={{ fontSize: 11, marginTop: 3, color: isLlm ? "var(--accent)" : "var(--blue)" }}>
                  {isLlm ? "Language model" : `${node.server_name} / ${node.tool_name}`}
                </div>

                {/* Params / arguments */}
                {isLlm && typeof node.arguments.prompt === "string" ? (
                  <p style={{
                    fontSize: 11, marginTop: 8, marginBottom: 0, color: "var(--text-dim)",
                    lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {node.arguments.prompt}
                  </p>
                ) : (
                  Object.keys(node.arguments).length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                      {Object.entries(node.arguments).map(([k, v]) => {
                        const strVal = String(v);
                        const refOwner = outputKeyOwner.get(strVal);
                        return (
                          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                            <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{k}</span>
                            {refOwner ? (
                              <span style={{
                                fontSize: 10, padding: "1px 7px", borderRadius: 8,
                                background: "rgba(124,107,240,0.15)", color: "var(--accent)", fontWeight: 500,
                              }}>
                                {strVal}
                              </span>
                            ) : (
                              <span style={{ color: "var(--text-dim)" }}>
                                {strVal.length > 28 ? strVal.slice(0, 28) + "…" : strVal}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                )}

                {/* Output key badge */}
                {node.output_key && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <span style={{
                      fontSize: 10, fontFamily: "monospace", padding: "2px 8px", borderRadius: 6,
                      background: "rgba(124,107,240,0.08)", color: "var(--text-muted)",
                    }}>
                      → {node.output_key}
                    </span>
                  </div>
                )}

                {/* Right handle */}
                <div style={{
                  position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)",
                  width: 10, height: 10, borderRadius: "50%",
                  background: "var(--bg-card)",
                  border: isLlm ? "2px solid var(--accent)" : "2px solid var(--blue)",
                }} />
              </div>
            );
          })}
        </div>
      ))}
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
  onFreeze,
  onPublish,
  freezing,
  onGenerateApp,
  generatingApp,
  onRename,
}: {
  workflow: Workflow;
  nodeStatuses: Map<string, NodeStatus>;
  phase: AppPhase;
  runMode: "deploy" | "test" | null;
  browserUseMode: "local" | "remote";
  onChangeBrowserUseMode: (mode: "local" | "remote") => void;
  onRun: (mode: "deploy" | "test", runtimeParams?: Record<string, any>) => void;
  onCreateWebhook: () => void;
  webhookUrl: string | null;
  onFreeze?: () => void;
  onPublish?: () => void;
  freezing?: boolean;
  onGenerateApp?: () => void;
  generatingApp?: boolean;
  onRename?: (name: string) => void;
}) {
  const showExecution = phase === "executing" || phase === "done";
  const [runtimeValues, setRuntimeValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    workflow.configurableParams?.forEach(cp => {
      init[`${cp.nodeId}.${cp.paramKey}`] = cp.defaultValue ?? "";
    });
    return init;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-slide-right">
      <div
        style={{ borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          {onRename ? (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                defaultValue={workflow.name}
                key={workflow.id}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== workflow.name) onRename(v);
                  e.target.style.background = "transparent";
                  e.target.style.outline = "none";
                }}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                onFocus={(e) => {
                  e.target.style.background = "var(--bg-surface)";
                  e.target.style.outline = "1px solid var(--border)";
                }}
                style={{
                  fontSize: 14, fontWeight: 500, color: "var(--text)", background: "transparent",
                  border: "none", outline: "none", fontFamily: "inherit", padding: "1px 4px",
                  borderRadius: 4, flex: 1, cursor: "text",
                }}
              />
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="var(--text-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{workflow.name}</div>
          )}
          <div style={{
            fontSize: 12, color: "var(--text-dim)", marginTop: 2, lineHeight: 1.4, paddingLeft: 4,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
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
                onClick={() => onRun("test", runtimeValues)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "inherit" }}
              >
                Test Run
              </button>
              <button
                onClick={() => onRun("deploy", runtimeValues)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}
              >
                Deploy
              </button>
            </>
          )}
          {phase === "done" && runMode === "test" && (
            <>
              <button
                onClick={() => onRun("test", runtimeValues)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "inherit" }}
              >
                Re-run
              </button>
              <button
                onClick={() => onRun("deploy", runtimeValues)}
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
          {onFreeze && (
            <button
              onClick={onFreeze}
              disabled={freezing}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                border: "1px solid var(--border)", background: "transparent",
                color: freezing ? "var(--text-muted)" : "var(--text)",
                cursor: freezing ? "not-allowed" : "pointer", fontFamily: "inherit",
                opacity: freezing ? 0.6 : 1,
              }}
            >
              {freezing ? "Freezing..." : "Freeze"}
            </button>
          )}
          {onPublish && (
            <button
              onClick={onPublish}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                border: "none", background: "var(--green, #22c55e)",
                color: "#fff", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Publish
            </button>
          )}
          {onGenerateApp && workflow.configurableParams && workflow.configurableParams.length > 0 && (
            <button
              onClick={onGenerateApp}
              disabled={generatingApp}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                border: "none", background: "var(--orange, #f97316)",
                color: "#fff", cursor: generatingApp ? "not-allowed" : "pointer",
                fontFamily: "inherit", opacity: generatingApp ? 0.6 : 1,
              }}
            >
              {generatingApp ? "Generating..." : "Generate App"}
            </button>
          )}
        </div>
      </div>

      {workflow.configurableParams && workflow.configurableParams.length > 0 && (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
            Adjustable Inputs
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {workflow.configurableParams.map(cp => {
              const key = `${cp.nodeId}.${cp.paramKey}`;
              return (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 500, color: "var(--text-dim)" }}>
                    {cp.label} <span style={{ color: "var(--text-muted)", fontSize: 10 }}>({cp.type})</span>
                  </label>
                  <input
                    type={cp.type === "number" ? "number" : "text"}
                    value={runtimeValues[key] ?? ""}
                    onChange={e => setRuntimeValues(prev => ({
                      ...prev,
                      [key]: cp.type === "number" ? Number(e.target.value) : e.target.value
                    }))}
                    placeholder={cp.description}
                    title={cp.description}
                    style={{
                      padding: "6px 10px", borderRadius: 6, fontSize: 12, outline: "none",
                      border: "1px solid var(--border)", background: "var(--bg-surface)",
                      color: "var(--text)", fontFamily: "inherit"
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showExecution && <PipelineBar nodes={workflow.nodes} nodeStatuses={nodeStatuses} />}

      <div className="flex-1 overflow-auto p-4">
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
                <code style={{ color: "var(--text-dim)" }}>{webhookUrl}</code>
              </div>
            )}
          </div>
        ) : (
          <WorkflowGraph nodes={workflow.nodes} configurableParams={workflow.configurableParams} />
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
