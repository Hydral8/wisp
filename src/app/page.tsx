"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Workflow } from "@/lib/types";
import { API, PRESETS } from "@/components/workflow-ui";

interface WorkflowSummary {
  id: string;
  name: string;
  description: string;
  status: string;
  nodes: { id: string }[];
}

export default function Dashboard() {
  const router = useRouter();
  const [input, setInput] = useState(PRESETS[0].prompt);
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch all workflows on mount
  useEffect(() => {
    fetch(`${API}/workflows`)
      .then((r) => r.json())
      .then((data) => {
        setWorkflows(data.workflows ?? []);
      })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    router.push(`/workflow/new?prompt=${encodeURIComponent(input.trim())}`);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": return "var(--green)";
      case "running": return "var(--blue)";
      case "planned": return "var(--text-dim)";
      default: return "var(--text-dim)";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section with prompt input */}
      <div className="flex flex-col items-center pt-16 pb-12 px-4">
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
                handleSubmit();
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

      {/* Workflows list */}
      <div className="flex-1 px-4 pb-12 max-w-4xl mx-auto w-full">
        <div
          className="flex items-center justify-between mb-4 pb-2"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--text-dim)" }}>
            Your Workflows
          </h2>
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            {workflows.length} total
          </span>
        </div>

        {loadingList ? (
          <div className="flex justify-center py-8">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--text-dim)", opacity: 0.4 }}
                />
              ))}
            </div>
          </div>
        ) : workflows.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              No workflows yet. Create one above to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {workflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => router.push(`/workflow/${wf.id}`)}
                className="text-left p-4 rounded-lg transition-all hover:scale-[1.01]"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {wf.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: statusColor(wf.status) }}
                    />
                    <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                      {wf.status}
                    </span>
                  </div>
                </div>
                <p
                  className="text-xs mb-3 line-clamp-2"
                  style={{ color: "var(--text-dim)" }}
                >
                  {wf.description}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "var(--bg-surface)", color: "var(--text-dim)" }}
                  >
                    {wf.nodes.length} steps
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-dim)", opacity: 0.5 }}>
                    {wf.id}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
