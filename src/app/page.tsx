"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignIn, UserMenu } from "@/components/auth";
import { PRESETS } from "@/components/workflow-ui";

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

function IconApps() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2.25" y="2.25" width="5.25" height="5.25" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="10.5" y="2.25" width="5.25" height="5.25" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2.25" y="10.5" width="5.25" height="5.25" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="10.5" y="10.5" width="5.25" height="5.25" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
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

function IconCredentials() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2.25" y="6.75" width="13.5" height="8.25" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5.25 6.75V5.25a3.75 3.75 0 0 1 7.5 0v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="9" cy="11.25" r="1.125" fill="currentColor"/>
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
  { id: "apps", label: "Apps", Icon: IconApps },
  { id: "credentials", label: "Credentials", Icon: IconCredentials },
  { id: "marketplace", label: "Marketplace", Icon: IconMarketplace },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

function Sidebar({ active, onChange, user }: { active: NavId; onChange: (id: NavId) => void; user?: { name?: string; image?: string; email?: string } | null }) {
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

      {/* User avatar + sign out at bottom */}
      {user ? (
        <UserMenu user={user} />
      ) : (
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
      )}
    </div>
  );
}

// ─── Compose (home) ──────────────────────────────────────────────────────────

function ComposePane() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

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

  const toggleVoice = () => {
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
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={toggleVoice}
                title={listening ? "Stop listening" : "Voice input"}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "none",
                  background: listening ? "var(--red, #ef4444)" : "transparent",
                  color: listening ? "#fff" : "var(--text-muted)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!listening) e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={(e) => { if (!listening) e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect x="5" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M3 7.5a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M8 13v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {listening && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 8,
                    border: "2px solid var(--red, #ef4444)", animation: "pulse-dot 1s ease-in-out infinite",
                    pointerEvents: "none",
                  }} />
                )}
              </button>
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
  const rawWorkflows = useQuery(api.workflows.list);
  const loading = rawWorkflows === undefined;
  const deleteWorkflow = useMutation(api.workflows.remove);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const workflows: Array<{ id: string; name: string; description: string; status: string; nodes: { id: string }[] }> =
    (rawWorkflows ?? []).map((wf: any) => ({
      id: wf._id,
      name: wf.name,
      description: wf.description,
      status: wf.status,
      nodes: wf.nodes.map((n: any) => ({ id: n.id })),
    }));

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
              <div
                key={wf.id}
                className="animate-fade-in"
                style={{
                  position: "relative",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  transition: "border-color 0.12s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-muted)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                {/* Delete confirmation overlay */}
                {confirmDeleteId === wf.id && (
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 2, borderRadius: 10,
                    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
                  }}>
                    <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>Delete this automation?</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try { await deleteWorkflow({ id: wf.id as any }); } catch (err) { console.error(err); }
                          setConfirmDeleteId(null);
                        }}
                        style={{
                          fontSize: 11, fontWeight: 500, padding: "5px 14px", borderRadius: 6,
                          border: "none", background: "var(--red, #ef4444)", color: "#fff",
                          cursor: "pointer", fontFamily: "inherit",
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                        style={{
                          fontSize: 11, padding: "5px 14px", borderRadius: 6,
                          border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff",
                          cursor: "pointer", fontFamily: "inherit",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => router.push(`/workflow/${wf.id}`)}
                  style={{
                    textAlign: "left",
                    padding: "16px 18px",
                    width: "100%",
                    borderRadius: 10,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
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
                    <span style={{ color: "var(--border)" }}>&middot;</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>
                      {wf.id.slice(0, 8)}
                    </span>
                  </div>
                </button>

                {/* Delete button — bottom-right */}
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(wf.id); }}
                  title="Delete automation"
                  style={{
                    position: "absolute", bottom: 12, right: 14,
                    background: "none", border: "none", cursor: "pointer", padding: 4,
                    borderRadius: 4, color: "var(--text-muted)", transition: "color 0.12s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--red, #ef4444)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Apps ─────────────────────────────────────────────────────────────────────

function AppsPane() {
  const router = useRouter();
  const apps = useQuery(api.apps.listByUser);
  const loading = apps === undefined;

  return (
    <div style={{ flex: 1, padding: "48px 40px", minHeight: "100vh", maxWidth: 900, width: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.3px", margin: "0 0 4px", color: "var(--text)" }}>
          My Apps
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0 }}>
          Mini-apps generated from your workflows
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", gap: 5, paddingTop: 40, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text-muted)", animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 80 }}>
          <p style={{ color: "var(--text-dim)", fontSize: 14, margin: "0 0 4px" }}>No apps yet</p>
          <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>
            Generate one from a workflow with configurable parameters
          </p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12, fontWeight: 500 }}>
            {apps.length} app{apps.length !== 1 ? "s" : ""}
          </div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {apps.map((app: any) => {
              const layout = app.layout || {};
              const primary = layout.colorTheme?.primary || "#6366f1";
              return (
                <button
                  key={app._id}
                  onClick={() => router.push(`/app/${app._id}`)}
                  className="animate-fade-in"
                  style={{
                    textAlign: "left",
                    padding: "18px 20px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "border-color 0.12s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = primary; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{layout.icon || "+"}</span>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
                      {app.name}
                    </div>
                  </div>
                  <p style={{
                    fontSize: 12, color: "var(--text-dim)", margin: 0, lineHeight: 1.5,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {app.description}
                  </p>
                  <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-muted)" }}>
                    {app.configurableParams?.length || 0} input{(app.configurableParams?.length || 0) !== 1 ? "s" : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Credentials ─────────────────────────────────────────────────────────────

const APPS_PER_PAGE = 24;

function IntegrationsSection() {
  const composioApps = useQuery(api.composio.getApps) ?? [];
  const connections = useQuery(api.composio.getConnections) ?? [];
  const syncApps = useAction(api.composio.syncApps);
  const initiate = useAction(api.composio.initiateConnection);
  const disconnect = useMutation(api.composio.removeConnection);
  const save = useMutation(api.composio.saveConnection);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const handleSync = async () => {
    setSyncing(true);
    try { await syncApps({}); } catch (err) { console.error("Sync error:", err); }
    finally { setSyncing(false); }
  };

  // Auto-fetch apps on first mount if table is empty
  useEffect(() => {
    if (composioApps.length === 0) {
      handleSync();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for OAuth callback postMessage
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "composio_callback" && connecting) {
        save({
          provider: connecting,
          composioEntityId: e.data.connectedAccountId || "",
          status: e.data.status || "active",
        });
        setConnecting(null);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [connecting, save]);

  const connectedProviders = new Map(
    connections.map((c: any) => [c.provider, c])
  );

  // Connected apps first, then filter by search
  const sortedApps = [...composioApps].sort((a: any, b: any) => {
    const aConn = connectedProviders.has(a.key) ? 0 : 1;
    const bConn = connectedProviders.has(b.key) ? 0 : 1;
    return aConn - bConn;
  });

  const filtered = search.trim()
    ? sortedApps.filter((app: any) =>
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.key.toLowerCase().includes(search.toLowerCase())
      )
    : sortedApps;

  const totalPages = Math.ceil(filtered.length / APPS_PER_PAGE);
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const pageApps = filtered.slice(currentPage * APPS_PER_PAGE, (currentPage + 1) * APPS_PER_PAGE);

  // Reset page when search changes
  useEffect(() => { setPage(0); }, [search]);

  const handleConnect = async (appKey: string) => {
    setConnecting(appKey);
    try {
      const callbackUrl = `${window.location.origin}/api/composio/callback`;
      const result = await initiate({ appName: appKey, callbackUrl });
      if (result.redirectUrl) {
        window.open(result.redirectUrl, "composio_oauth", "width=600,height=700");
      }
    } catch (err) {
      console.error("Composio connect error:", err);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (appKey: string) => {
    try {
      await disconnect({ provider: appKey });
    } catch (err) {
      console.error("Composio disconnect error:", err);
    }
  };

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Header row */}
      <div style={{ marginBottom: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>
            Integrations
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-dim)", margin: 0 }}>
            {composioApps.length > 0
              ? `${composioApps.length} apps available \u00b7 ${connections.length} connected`
              : "Connect apps via OAuth \u2014 no API keys needed"}
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-dim)",
            fontSize: 11,
            fontFamily: "inherit",
            cursor: syncing ? "not-allowed" : "pointer",
            opacity: syncing ? 0.5 : 1,
          }}
        >
          {syncing ? "Syncing..." : "Refresh"}
        </button>
      </div>

      {composioApps.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ color: "var(--text-dim)", fontSize: 12, margin: 0 }}>
            Loading integrations...
          </p>
        </div>
      ) : (
        <>
          {/* Search */}
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
              color: "var(--text)",
              fontSize: 12,
              fontFamily: "inherit",
              outline: "none",
              marginBottom: 12,
              boxSizing: "border-box",
            }}
          />

          {/* Grid */}
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {pageApps.map((app: any) => {
              const conn = connectedProviders.get(app.key);
              const isActive = conn?.status === "active";
              const isConnecting = connecting === app.key;

              return (
                <div
                  key={app.key}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${isActive ? "rgba(74,222,128,0.3)" : "var(--border)"}`,
                    background: isActive ? "rgba(74,222,128,0.05)" : "var(--bg-card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: isActive ? "var(--green)" : "var(--border)",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {app.name}
                    </span>
                  </div>
                  {isActive ? (
                    <button
                      onClick={() => handleDisconnect(app.key)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: 5,
                        border: "1px solid rgba(248,113,113,0.3)",
                        background: "rgba(248,113,113,0.08)",
                        color: "var(--red)",
                        fontSize: 10,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(app.key)}
                      disabled={isConnecting}
                      style={{
                        padding: "3px 8px",
                        borderRadius: 5,
                        border: "1px solid var(--border)",
                        background: isConnecting ? "var(--border)" : "transparent",
                        color: "var(--text-dim)",
                        fontSize: 10,
                        fontWeight: 500,
                        fontFamily: "inherit",
                        cursor: isConnecting ? "not-allowed" : "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {isConnecting ? "..." : "Connect"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 14 }}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: currentPage === 0 ? "var(--text-muted)" : "var(--text-dim)",
                  fontSize: 11,
                  fontFamily: "inherit",
                  cursor: currentPage === 0 ? "not-allowed" : "pointer",
                }}
              >
                Prev
              </button>
              <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: currentPage >= totalPages - 1 ? "var(--text-muted)" : "var(--text-dim)",
                  fontSize: 11,
                  fontFamily: "inherit",
                  cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const CREDENTIAL_FIELDS = [
  { key: "appId", placeholder: "App id (e.g. github)", disabled: "editing" as const },
  { key: "displayName", placeholder: "Display name" },
  { key: "username", placeholder: "Username" },
  { key: "email", placeholder: "Email" },
  { key: "password", placeholder: "Password", type: "password" },
  { key: "apiKey", placeholder: "API key" },
  { key: "token", placeholder: "Token" },
  { key: "notes", placeholder: "Notes" },
] as const;

function CredentialsPane() {
  const rawProfiles = useQuery(api.credentials.list);
  const profiles: Array<{ appId: string; displayName: string; username: string; email: string; password: string; apiKey: string; token: string; notes: string }> =
    (rawProfiles ?? []) as any;
  const upsertCredential = useMutation(api.credentials.upsert);
  const removeCredential = useMutation(api.credentials.remove);
  const loading = rawProfiles === undefined;
  const [saving, setSaving] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [form, setForm] = useState({
    appId: "", displayName: "", username: "", email: "",
    password: "", apiKey: "", token: "", notes: "",
  });

  const resetForm = () => {
    setEditingAppId(null);
    setForm({ appId: "", displayName: "", username: "", email: "", password: "", apiKey: "", token: "", notes: "" });
  };

  const handleSave = async () => {
    const appId = form.appId.trim().toLowerCase();
    if (!appId) return;
    setSaving(true);
    try {
      await upsertCredential({
        appId,
        displayName: form.displayName,
        username: form.username,
        email: form.email,
        password: form.password,
        apiKey: form.apiKey,
        token: form.token,
        notes: form.notes,
      });
      resetForm();
    } catch { /* noop */ } finally { setSaving(false); }
  };

  const handleEdit = (p: any) => {
    setEditingAppId(p.appId);
    setForm({
      appId: p.appId, displayName: p.displayName ?? "", username: p.username ?? "",
      email: p.email ?? "", password: p.password ?? "", apiKey: p.apiKey ?? "",
      token: p.token ?? "", notes: p.notes ?? "",
    });
  };

  const handleDelete = async (appId: string) => {
    try {
      await removeCredential({ appId });
      if (editingAppId === appId) resetForm();
    } catch { /* noop */ }
  };

  return (
    <div style={{ flex: 1, padding: "48px 40px", minHeight: "100vh", width: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.3px", margin: "0 0 4px", color: "var(--text)" }}>
          Credentials
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0 }}>
          API keys and login profiles for your automations
        </p>
      </div>

      {/* Composio Integrations */}
      <IntegrationsSection />

      {/* Manual Credentials Form */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {CREDENTIAL_FIELDS.map((f) => (
            <input
              key={f.key}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
                color: "var(--text)",
                fontSize: 12,
                fontFamily: "inherit",
                outline: "none",
              }}
              type={("type" in f && f.type) || "text"}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
              disabled={"disabled" in f && f.disabled === "editing" && Boolean(editingAppId)}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <button
            onClick={handleSave}
            disabled={saving || !form.appId.trim()}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: saving || !form.appId.trim() ? "not-allowed" : "pointer",
              background: "var(--accent)",
              color: "#fff",
              opacity: saving || !form.appId.trim() ? 0.5 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {editingAppId ? "Update" : "Save"}
          </button>
          {editingAppId && (
            <button
              onClick={resetForm}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-dim)",
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", gap: 5, paddingTop: 40, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text-muted)", animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 40 }}>
          <p style={{ color: "var(--text-dim)", fontSize: 13, margin: 0 }}>No credential profiles yet</p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12, fontWeight: 500 }}>
            {profiles.length} profile{profiles.length !== 1 ? "s" : ""}
          </div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {profiles.map((p) => (
              <div
                key={p.appId}
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                    {p.displayName || p.appId}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>
                    {p.appId}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, color: "var(--text-dim)" }}>
                  {p.username && <div>Username: {p.username}</div>}
                  {p.email && <div>Email: {p.email}</div>}
                  {p.password && <div>Password: --------</div>}
                  {p.apiKey && <div>API key: --------</div>}
                  {p.token && <div>Token: --------</div>}
                  {p.notes && <div>Notes: {p.notes}</div>}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => handleEdit(p)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text-dim)",
                      fontSize: 11,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.appId)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(248,113,113,0.3)",
                      background: "rgba(248,113,113,0.08)",
                      color: "var(--red)",
                      fontSize: 11,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Marketplace ─────────────────────────────────────────────────────────────

const FALLBACK_MARKETPLACE = [
  { name: "GitHub Intelligence", description: "Search repos, read READMEs, analyze trends and generate reports.", tags: ["GitHub", "Research"] },
  { name: "Competitive Analysis", description: "Scrape company homepages, compare features, output structured briefs.", tags: ["Web", "Analysis"] },
  { name: "Job Market Scanner", description: "Search job boards, extract salaries & skills, build comparison tables.", tags: ["LinkedIn", "Data"] },
  { name: "News Digest", description: "Aggregate top stories from multiple sources with sentiment analysis.", tags: ["News", "AI"] },
];

function MarketplacePane() {
  const router = useRouter();
  const rawItems = useQuery(api.marketplace.list, {});
  const useMarketplaceItem = useMutation(api.marketplace.use);
  const loading = rawItems === undefined;
  const items = rawItems ?? [];
  const [usingId, setUsingId] = useState<string | null>(null);

  const handleUse = async (itemId: string) => {
    setUsingId(itemId);
    try {
      const workflowId = await useMarketplaceItem({ marketplaceId: itemId as any });
      router.push(`/workflow/${workflowId}`);
    } catch (err) {
      console.error("Use marketplace item error:", err);
    } finally {
      setUsingId(null);
    }
  };

  // Show Convex items if available, otherwise show fallback
  const displayItems = items.length > 0
    ? items.map((item: any) => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        tags: item.tags ?? [],
        publisherName: item.publisherName,
        usageCount: item.usageCount ?? 0,
      }))
    : FALLBACK_MARKETPLACE.map((item, i) => ({
        _id: null,
        name: item.name,
        description: item.description,
        tags: item.tags,
        publisherName: null,
        usageCount: 0,
      }));

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

      {loading ? (
        <div style={{ display: "flex", gap: 5, paddingTop: 40, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text-muted)", animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {displayItems.map((item: any) => (
            <div
              key={item._id ?? item.name}
              style={{
                padding: "18px 18px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                cursor: item._id ? "pointer" : "default",
                transition: "border-color 0.12s",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--text-muted)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                  {item.name}
                </div>
                {item._id && (
                  <button
                    onClick={() => handleUse(item._id)}
                    disabled={usingId === item._id}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: usingId === item._id ? "var(--border)" : "transparent",
                      color: "var(--text-dim)",
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: usingId === item._id ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      transition: "background 0.12s, color 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (usingId !== item._id) {
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (usingId !== item._id) {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                      }
                    }}
                  >
                    {usingId === item._id ? "Cloning..." : "Use"}
                  </button>
                )}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-dim)", margin: 0, lineHeight: 1.5 }}>
                {item.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
                  {item.tags.map((t: string) => (
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
                {item.publisherName && (
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    by {item.publisherName}
                  </span>
                )}
                {item.usageCount > 0 && (
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {item.usageCount} use{item.usageCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(
    api.users.currentUser,
    isAuthenticated ? {} : "skip"
  );
  const [active, setActive] = useState<NavId>("compose");

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg)" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text-muted)", animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={active} onChange={setActive} user={user} />
      <div style={{ marginLeft: 56, flex: 1, display: "flex" }}>
        {active === "compose" && <ComposePane />}
        {active === "automations" && <AutomationsPane />}
        {active === "apps" && <AppsPane />}
        {active === "credentials" && <CredentialsPane />}
        {active === "marketplace" && <MarketplacePane />}
      </div>
    </div>
  );
}
