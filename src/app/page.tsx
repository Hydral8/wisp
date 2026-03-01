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

interface CredentialProfile {
  app_id: string;
  display_name: string;
  username: string;
  email: string;
  password: string;
  api_key: string;
  token: string;
  notes: string;
  updated_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [input, setInput] = useState(PRESETS[0].prompt);
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [profiles, setProfiles] = useState<CredentialProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    appId: "",
    displayName: "",
    username: "",
    email: "",
    password: "",
    apiKey: "",
    token: "",
    notes: "",
  });
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

    fetch(`${API}/credentials/profiles`)
      .then((r) => r.json())
      .then((data) => {
        setProfiles(data.profiles ?? []);
      })
      .catch(() => {})
      .finally(() => setLoadingProfiles(false));
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    router.push(`/workflow/new?prompt=${encodeURIComponent(input.trim())}`);
  };

  const resetProfileForm = () => {
    setEditingAppId(null);
    setProfileForm({
      appId: "",
      displayName: "",
      username: "",
      email: "",
      password: "",
      apiKey: "",
      token: "",
      notes: "",
    });
  };

  const handleSaveProfile = async () => {
    const appId = profileForm.appId.trim().toLowerCase();
    if (!appId) return;

    setSavingProfile(true);
    try {
      await fetch(`${API}/credentials/profiles/${encodeURIComponent(appId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: profileForm.displayName,
          username: profileForm.username,
          email: profileForm.email,
          password: profileForm.password,
          api_key: profileForm.apiKey,
          token: profileForm.token,
          notes: profileForm.notes,
        }),
      });
      const refreshed = await fetch(`${API}/credentials/profiles`).then((r) => r.json());
      setProfiles(refreshed.profiles ?? []);
      resetProfileForm();
    } catch {
      // noop
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEditProfile = (profile: CredentialProfile) => {
    setEditingAppId(profile.app_id);
    setProfileForm({
      appId: profile.app_id,
      displayName: profile.display_name ?? "",
      username: profile.username ?? "",
      email: profile.email ?? "",
      password: profile.password ?? "",
      apiKey: profile.api_key ?? "",
      token: profile.token ?? "",
      notes: profile.notes ?? "",
    });
  };

  const handleDeleteProfile = async (appId: string) => {
    try {
      await fetch(`${API}/credentials/profiles/${encodeURIComponent(appId)}`, {
        method: "DELETE",
      });
      setProfiles((prev) => prev.filter((p) => p.app_id !== appId));
      if (editingAppId === appId) resetProfileForm();
    } catch {
      // noop
    }
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

        <div
          className="flex items-center justify-between mb-4 mt-10 pb-2"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--text-dim)" }}>
            Credentials
          </h2>
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            {profiles.length} profiles
          </span>
        </div>

        <div
          className="rounded-lg p-4 mb-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            <input
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="App id (e.g. github)"
              value={profileForm.appId}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, appId: e.target.value }))}
              disabled={Boolean(editingAppId)}
            />
            <input
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Display name"
              value={profileForm.displayName}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, displayName: e.target.value }))}
            />
            <input
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Username"
              value={profileForm.username}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
            />
            <input
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <input
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Password"
              type="password"
              value={profileForm.password}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, password: e.target.value }))}
            />
            <input
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="API key"
              value={profileForm.apiKey}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, apiKey: e.target.value }))}
            />
            <input
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Token"
              value={profileForm.token}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, token: e.target.value }))}
            />
            <input
              className="px-3 py-2 rounded text-xs outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Notes"
              value={profileForm.notes}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile || !profileForm.appId.trim()}
              className="px-3 py-1.5 rounded text-xs font-medium transition-opacity"
              style={{ background: "var(--accent)", color: "#fff", opacity: savingProfile || !profileForm.appId.trim() ? 0.5 : 1 }}
            >
              {editingAppId ? "Update profile" : "Save profile"}
            </button>
            {editingAppId && (
              <button
                onClick={resetProfileForm}
                className="px-3 py-1.5 rounded text-xs"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-dim)" }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </div>

        {loadingProfiles ? (
          <p className="text-xs py-3" style={{ color: "var(--text-dim)" }}>Loading profiles...</p>
        ) : profiles.length === 0 ? (
          <p className="text-xs py-3" style={{ color: "var(--text-dim)" }}>
            No credential profiles yet. Add one above to reuse app logins across relaunches.
          </p>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {profiles.map((profile) => (
              <div
                key={profile.app_id}
                className="p-3 rounded-lg"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium" style={{ color: "var(--text)" }}>
                    {profile.display_name || profile.app_id}
                  </div>
                  <code className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                    {profile.app_id}
                  </code>
                </div>
                <div className="space-y-1 text-xs" style={{ color: "var(--text-dim)" }}>
                  {profile.username && <div>Username: {profile.username}</div>}
                  {profile.email && <div>Email: {profile.email}</div>}
                  {profile.password && <div>Password: ••••••••</div>}
                  {profile.api_key && <div>API key: ••••••••</div>}
                  {profile.token && <div>Token: ••••••••</div>}
                  {profile.notes && <div>Notes: {profile.notes}</div>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEditProfile(profile)}
                    className="px-2 py-1 rounded text-xs"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-dim)" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProfile(profile.app_id)}
                    className="px-2 py-1 rounded text-xs"
                    style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--red)" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
