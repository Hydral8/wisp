"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AppLayout, AppLayoutField, AppLayoutSection } from "@/lib/types";

type Phase = "idle" | "running" | "done";

export default function MiniAppPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const app = useQuery(api.apps.get, { id: id as Id<"apps"> });
  const startExecution = useAction(api.execution.startExecution);

  const [phase, setPhase] = useState<Phase>("idle");
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [initDone, setInitDone] = useState(false);

  const layout: AppLayout | null = app?.layout ?? null;
  const workflowId = app?.workflowId;

  // Subscribe to execution events when running
  const executionEvents = useQuery(
    api.execution.getExecutionEvents,
    workflowId && phase !== "idle" ? { workflowId } : "skip"
  );

  // Initialize form defaults from configurable params
  useEffect(() => {
    if (!app || initDone) return;
    const init: Record<string, any> = {};
    for (const cp of app.configurableParams) {
      init[`${cp.nodeId}.${cp.paramKey}`] = cp.defaultValue ?? "";
    }
    setFormValues(init);
    setInitDone(true);
  }, [app, initDone]);

  // Track execution progress
  const lastEventCount = useRef(0);
  const [currentStep, setCurrentStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Record<string, any>>({});
  const [nodeResults, setNodeResults] = useState<Array<{ id: string; step: string; result: any; error?: string }>>([]);

  useEffect(() => {
    if (!executionEvents || executionEvents.length === 0) return;
    if (executionEvents.length <= lastEventCount.current) return;

    const newEvents = executionEvents.slice(lastEventCount.current);
    lastEventCount.current = executionEvents.length;

    for (const eventDoc of newEvents) {
      const event = eventDoc.event as any;
      if (event.type === "node_start") {
        const d = event.data || {};
        setCurrentStep(d.step || d.tool_name || "Processing...");
        setProgress(d.progress || 0);
      } else if (event.type === "node_complete") {
        const d = event.data || {};
        setProgress(d.progress || 0);
        setNodeResults((prev) => [...prev, {
          id: event.node_id,
          step: d.step || event.node_id,
          result: d.result,
        }]);
        if (d.result) {
          setResults((prev) => ({ ...prev, [event.node_id]: d.result }));
        }
      } else if (event.type === "node_error") {
        const d = event.data || {};
        setNodeResults((prev) => [...prev, {
          id: event.node_id,
          step: event.node_id,
          result: null,
          error: d.error,
        }]);
      } else if (event.type === "workflow_complete") {
        setPhase("done");
        setProgress(1);
      }
    }
  }, [executionEvents]);

  const handleRun = async () => {
    if (!workflowId) return;
    setPhase("running");
    setCurrentStep("Starting...");
    setProgress(0);
    setResults({});
    setNodeResults([]);
    lastEventCount.current = 0;

    try {
      await startExecution({
        workflowId,
        runtimeParams: formValues,
      });
    } catch (err) {
      setPhase("done");
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setCurrentStep("");
    setProgress(0);
    setResults({});
    setNodeResults([]);
    lastEventCount.current = 0;
  };

  if (!app || !layout) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--text-dim)", fontSize: 13 }}>Loading app...</p>
      </div>
    );
  }

  const primary = layout.colorTheme?.primary || "#6366f1";
  const accent = layout.colorTheme?.accent || "#8b5cf6";

  return (
    <div
      style={{
        "--app-primary": primary,
        "--app-accent": accent,
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "inherit",
      } as React.CSSProperties}
    >
      {/* Header */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "24px 0",
        background: `linear-gradient(135deg, ${primary}11, ${accent}11)`,
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              fontSize: 11, color: "var(--text-muted)", background: "none",
              border: "none", cursor: "pointer", fontFamily: "inherit",
              padding: 0, marginBottom: 16,
            }}
          >
            &larr; Back to dashboard
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>{layout.icon || "+"}</span>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: 0 }}>
                {layout.title}
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-dim)", margin: "4px 0 0" }}>
                {layout.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px" }}>
        {/* IDLE: Form */}
        {phase === "idle" && (
          <div>
            {layout.sections.map((section: AppLayoutSection, si: number) => (
              <div key={si} style={{ marginBottom: 28 }}>
                {section.heading && (
                  <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                    {section.heading}
                  </h2>
                )}
                {section.description && (
                  <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>
                    {section.description}
                  </p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {section.fields.map((field: AppLayoutField) => (
                    <FieldRenderer
                      key={field.paramKey}
                      field={field}
                      value={formValues[field.paramKey] ?? ""}
                      onChange={(val) => setFormValues((prev) => ({ ...prev, [field.paramKey]: val }))}
                      accent={accent}
                    />
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleRun}
              disabled={!workflowId}
              style={{
                width: "100%",
                padding: "12px 24px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                background: primary,
                color: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Run
            </button>
          </div>
        )}

        {/* RUNNING: Progress */}
        {phase === "running" && (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>{layout.icon || "+"}</div>
            <div style={{
              width: "100%",
              height: 6,
              borderRadius: 3,
              background: "var(--border)",
              marginBottom: 16,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                borderRadius: 3,
                background: primary,
                width: `${Math.max(progress * 100, 5)}%`,
                transition: "width 0.5s ease",
              }} />
            </div>
            <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
              {currentStep}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              {Math.round(progress * 100)}% complete
            </p>
            {nodeResults.length > 0 && (
              <div style={{ marginTop: 24, textAlign: "left" }}>
                {nodeResults.map((nr, i) => (
                  <div key={i} style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    marginBottom: 6,
                    background: nr.error ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                    border: `1px solid ${nr.error ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                  }}>
                    <div style={{ fontSize: 11, color: nr.error ? "#ef4444" : "#22c55e", fontWeight: 500 }}>
                      {nr.error ? "Failed" : "Done"}: {nr.step}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DONE: Results */}
        {phase === "done" && (
          <div>
            <div style={{
              textAlign: "center",
              marginBottom: 24,
              padding: "16px 0",
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{layout.icon || "+"}</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Complete</p>
            </div>

            <ResultsRenderer
              results={results}
              nodeResults={nodeResults}
              display={layout.resultDisplay}
            />

            <button
              onClick={handleReset}
              style={{
                width: "100%",
                padding: "12px 24px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                border: `2px solid ${primary}`,
                background: "transparent",
                color: primary,
                cursor: "pointer",
                fontFamily: "inherit",
                marginTop: 24,
              }}
            >
              Run Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Field renderer ---

function FieldRenderer({
  field,
  value,
  onChange,
  accent,
}: {
  field: AppLayoutField;
  value: any;
  onChange: (val: any) => void;
  accent: string;
}) {
  const baseInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    outline: "none",
    border: "1px solid var(--border)",
    background: "var(--bg-surface)",
    color: "var(--text)",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
        {field.label}
        {field.required && <span style={{ color: accent, marginLeft: 2 }}>*</span>}
      </label>
      {field.helpText && (
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{field.helpText}</p>
      )}

      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          style={{ ...baseInputStyle, resize: "vertical" }}
        />
      ) : field.type === "boolean" ? (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: accent }}
          />
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{field.placeholder || "Enable"}</span>
        </label>
      ) : field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...baseInputStyle, cursor: "pointer" }}
        >
          <option value="">{field.placeholder || "Select..."}</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type === "number" ? "number" : field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
          value={value}
          onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
          placeholder={field.placeholder}
          style={baseInputStyle}
        />
      )}
    </div>
  );
}

// --- Results renderer ---

function ResultsRenderer({
  results,
  nodeResults,
  display,
}: {
  results: Record<string, any>;
  nodeResults: Array<{ id: string; step: string; result: any; error?: string }>;
  display: AppLayout["resultDisplay"];
}) {
  const style = display?.style || "card";
  const showNodeResults = display?.showNodeResults ?? true;

  // Get the final meaningful result
  const allResults = showNodeResults ? nodeResults : nodeResults.slice(-1);
  const hasErrors = allResults.some((r) => r.error);

  if (style === "markdown") {
    const markdownContent = allResults
      .filter((r) => r.result)
      .map((r) => {
        const text = typeof r.result === "string" ? r.result :
          r.result?.result ? String(r.result.result) :
          JSON.stringify(r.result, null, 2);
        return showNodeResults ? `### ${r.step}\n\n${text}` : text;
      })
      .join("\n\n---\n\n");

    return (
      <div style={{
        padding: 20,
        borderRadius: 12,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}>
        <div className="prose prose-sm" style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent || "No results."}</ReactMarkdown>
        </div>
      </div>
    );
  }

  if (style === "table") {
    return (
      <div style={{
        borderRadius: 12,
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--bg-surface)" }}>
              <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--text-dim)", fontWeight: 500, borderBottom: "1px solid var(--border)" }}>Step</th>
              <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--text-dim)", fontWeight: 500, borderBottom: "1px solid var(--border)" }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {allResults.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "10px 14px", color: "var(--text)", borderBottom: "1px solid var(--border)", verticalAlign: "top" }}>
                  {r.step}
                </td>
                <td style={{ padding: "10px 14px", color: r.error ? "#ef4444" : "var(--text)", borderBottom: "1px solid var(--border)" }}>
                  {r.error || formatResult(r.result)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (style === "timeline") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {allResults.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: r.error ? "#ef4444" : "#22c55e",
                flexShrink: 0,
                marginTop: 4,
              }} />
              {i < allResults.length - 1 && (
                <div style={{ width: 2, flex: 1, background: "var(--border)" }} />
              )}
            </div>
            <div style={{ paddingBottom: 20, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                {r.step}
              </div>
              <div style={{
                fontSize: 12, color: r.error ? "#ef4444" : "var(--text-dim)",
                padding: "8px 12px", borderRadius: 8,
                background: "var(--bg-card)", border: "1px solid var(--border)",
              }}>
                {r.error || formatResult(r.result)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: card style
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {allResults.map((r, i) => (
        <div key={i} style={{
          padding: 16,
          borderRadius: 12,
          background: "var(--bg-card)",
          border: `1px solid ${r.error ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
        }}>
          {showNodeResults && (
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {r.step}
            </div>
          )}
          <div style={{ fontSize: 13, color: r.error ? "#ef4444" : "var(--text)", lineHeight: 1.5 }}>
            {r.error || formatResult(r.result)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatResult(result: any): string {
  if (result === null || result === undefined) return "No result";
  if (typeof result === "string") return result;
  if (result?.result) return typeof result.result === "string" ? result.result : JSON.stringify(result.result, null, 2);
  if (result?._truncated) return result.preview || "Result too large to display";
  return JSON.stringify(result, null, 2);
}
