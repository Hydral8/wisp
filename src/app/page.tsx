"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API, PRESETS } from "@/components/workflow-ui";

interface WorkflowSummary {
  id: string;
  name: string;
  description: string;
  status: string;
  nodes: { id: string }[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCompose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3H3.75A1.5 1.5 0 0 0 2.25 4.5v9.75A1.5 1.5 0 0 0 3.75 15.75H13.5A1.5 1.5 0 0 0 15 14.25V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.875 2.625a1.5 1.5 0 0 1 2.121 2.122L9.75 11 6.75 11.75l.75-3 6.375-6.125z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconAutomations() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 9a6 6 0 1 0 12 0A6 6 0 0 0 3 9z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconMarketplace() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2.25 3.75h13.5l-1.5 6H3.75l-1.5-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="6" cy="14.25" r="0.75" fill="currentColor"/>
      <circle cx="12" cy="14.25" r="0.75" fill="currentColor"/>
      <path d="M3.75 9.75v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M14.25 9.75v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9 2.25v1.5M9 14.25v1.5M2.25 9h1.5M14.25 9h1.5M4.4 4.4l1.06 1.06M12.54 12.54l1.06 1.06M4.4 13.6l1.06-1.06M12.54 5.46l1.06-1.06" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 7.5h11M7.5 2l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "compose", label: "Compose", Icon: IconCompose },
  { id: "automations", label: "Automations", Icon: IconAutomations },
  { id: "marketplace", label: "Marketplace", Icon: IconMarketplace },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

function Sidebar({ active, onChange }: { active: NavId; onChange: (id: NavId) => void }) {
  return (
    <div
      style={{
        width: 56,
        minWidth: 56,
        height: "100vh",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 16,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10,
        gap: 2,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white"/>
        </svg>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, alignItems: "center", width: "100%" }}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              title={label}
              onClick={() => onChange(id)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isActive ? "var(--bg-surface)" : "transparent",
                color: isActive ? "var(--text)" : "var(--text-muted)",
                transition: "background 0.12s, color 0.12s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }
              }}
            >
              <Icon />
            </button>
          );
        })}
      </div>

      {/* Settings at bottom */}
      <button
        title="Settings"
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          color: "var(--text-muted)",
          transition: "background 0.12s, color 0.12s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <IconSettings />
      </button>
    </div>
  );
}

// ─── Compose (home) ──────────────────────────────────────────────────────────

function ComposePane() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    router.push(`/workflow/new?prompt=${encodeURIComponent(input.trim())}`);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px 80px",
        minHeight: "100vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: 620 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.4px", margin: "0 0 8px", color: "var(--text)" }}>
          What do you want to automate?
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-dim)", margin: "0 0 28px", fontWeight: 400 }}>
          Describe your goal — Wisp finds the right tools and runs them.
        </p>

        {/* Composer */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "14px 14px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              width: "100%",
              fontSize: 14,
              lineHeight: "1.65",
              color: "var(--text)",
              fontFamily: "inherit",
              overflow: "hidden",
              minHeight: 28,
              padding: 0,
            }}
            placeholder="e.g. Search GitHub for trending AI repos and summarize them..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Shift + Enter for new line</span>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "inherit",
                background: input.trim() ? "var(--accent)" : "var(--border)",
                color: input.trim() ? "#fff" : "var(--text-muted)",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              Run <IconSend />
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setInput(p.prompt);
                textareaRef.current?.focus();
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 400,
                fontFamily: "inherit",
                color: "var(--text-dim)",
                transition: "border-color 0.12s, color 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-muted)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
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

// ─── Automations ─────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  completed: "var(--green)",
  running: "var(--blue)",
  planned: "var(--text-dim)",
};

function AutomationsPane() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/workflows`)
      .then((r) => r.json())
      .then((d) => setWorkflows(d.workflows ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ flex: 1, padding: "48px 40px", minHeight: "100vh", maxWidth: 900, width: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.3px", margin: "0 0 4px", color: "var(--text)" }}>
          My Automations
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0 }}>
          Your saved and deployed workflows
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", gap: 5, paddingTop: 40, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text-muted)", animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 80 }}>
          <p style={{ color: "var(--text-dim)", fontSize: 14, margin: "0 0 4px" }}>No automations yet</p>
          <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>Create one from the Compose tab</p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12, fontWeight: 500 }}>
            {workflows.length} automation{workflows.length !== 1 ? "s" : ""}
          </div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {workflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => router.push(`/workflow/${wf.id}`)}
                className="animate-fade-in"
                style={{
                  textAlign: "left",
                  padding: "16px 18px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "border-color 0.12s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-muted)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", lineHeight: 1.4 }}>
                    {wf.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[wf.status] ?? "var(--text-muted)" }} />
                    <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{wf.status}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-dim)", margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {wf.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{wf.nodes.length} steps</span>
                  <span style={{ color: "var(--border)" }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>
                    {wf.id.slice(0, 8)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Marketplace ─────────────────────────────────────────────────────────────

const MARKETPLACE_ITEMS = [
  { name: "GitHub Intelligence", description: "Search repos, read READMEs, analyze trends and generate reports.", tags: ["GitHub", "Research"], icon: "⬡" },
  { name: "Competitive Analysis", description: "Scrape company homepages, compare features, output structured briefs.", tags: ["Web", "Analysis"], icon: "◈" },
  { name: "Job Market Scanner", description: "Search job boards, extract salaries & skills, build comparison tables.", tags: ["LinkedIn", "Data"], icon: "◉" },
  { name: "News Digest", description: "Aggregate top stories from multiple sources with sentiment analysis.", tags: ["News", "AI"], icon: "◎" },
  { name: "Crypto Price Monitor", description: "Fetch real-time prices across exchanges and generate summaries.", tags: ["Finance", "API"], icon: "⬟" },
  { name: "Code Review Pipeline", description: "Fetch PRs, analyze diffs, post structured review comments.", tags: ["GitHub", "DevTools"], icon: "◬" },
];

function MarketplacePane() {
  return (
    <div style={{ flex: 1, padding: "48px 40px", minHeight: "100vh", maxWidth: 900, width: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.3px", margin: "0 0 4px", color: "var(--text)" }}>
          Marketplace
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0 }}>
          Pre-built automation templates — one click to run
        </p>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {MARKETPLACE_ITEMS.map((item) => (
          <div
            key={item.name}
            style={{
              padding: "18px 18px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              cursor: "pointer",
              transition: "border-color 0.12s",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--text-muted)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
              <button
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-dim)",
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.12s, color 0.12s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                }}
              >
                Use
              </button>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
                {item.name}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-dim)", margin: 0, lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {item.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [active, setActive] = useState<NavId>("compose");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={active} onChange={setActive} />
      <div style={{ marginLeft: 56, flex: 1, display: "flex" }}>
        {active === "compose" && <ComposePane />}
        {active === "automations" && <AutomationsPane />}
        {active === "marketplace" && <MarketplacePane />}
      </div>
    </div>
  );
}
