"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type {
  Workflow,
  NodeStatus,
  ChatMessage,
  PlanningEvent,
  AppPhase,
  CredentialRequest,
  CredentialField,
} from "@/lib/types";
import {
  API,
  ChatEntry,
  consumeSSE,
  ChatPane,
  PlanningFeed,
  WorkflowPane,
} from "@/components/workflow-ui";

export default function WorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [phase, setPhase] = useState<AppPhase>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatEntry[]>([]);
  const [planningEvents, setPlanningEvents] = useState<PlanningEvent[]>([]);
  const [nodeStatuses, setNodeStatuses] = useState<Map<string, NodeStatus>>(new Map());
  const [runMode, setRunMode] = useState<"deploy" | "test" | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [credentialRequest, setCredentialRequest] = useState<CredentialRequest | null>(null);
  const [credentialValues, setCredentialValues] = useState<Record<string, string>>({});

  // Stream planning events
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

        let newWorkflowId: string | null = null;

        await consumeSSE(res, (raw) => {
          const event = raw as unknown as PlanningEvent & { session_id?: string };

          if (event.type === "session_init") {
            setSessionId(event.session_id ?? null);
            return;
          }

          const pe = event as PlanningEvent;
          setPlanningEvents((prev) => [...prev, pe]);
          setChatMessages((prev) => [
            ...prev,
            { role: "system", content: "", planningEvent: pe },
          ]);

          if (pe.type === "dag_complete") {
            setWorkflow(pe.workflow);
            setPhase("preview");
            newWorkflowId = pe.workflow.id;
          }

          if (pe.type === "planning_message") {
            setChatMessages((prev) => [
              ...prev,
              { role: "assistant", content: pe.text },
            ]);
            setPhase("idle");
          }

          if (pe.type === "planning_error") {
            setPhase("idle");
          }
        });

        // After planning completes, update URL to the real workflow ID
        if (newWorkflowId && isNew) {
          router.replace(`/workflow/${newWorkflowId}`, { scroll: false });
        }
      } catch (err) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${err}` },
        ]);
        setPhase("idle");
      }
    },
    [isNew, router],
  );

  // Load existing workflow or start planning from prompt query param
  useEffect(() => {
    if (loaded) return;
    setLoaded(true);

    if (isNew) {
      const prompt = searchParams.get("prompt");
      if (prompt) {
        setChatMessages([{ role: "user", content: prompt }]);
        streamPlan(prompt);
      }
    } else {
      // Load existing workflow
      fetch(`${API}/workflows/${id}`)
        .then((r) => r.json())
        .then((wf) => {
          setWorkflow(wf);
          setPhase("preview");
        })
        .catch(() => {
          setChatMessages([{ role: "assistant", content: "Workflow not found." }]);
        });
    }
  }, [id, isNew, searchParams, streamPlan, loaded]);

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
          } else if (event.type === "credential_request") {
            const d = event.data as { fields: CredentialField[]; reason: string };
            setCredentialRequest({
              node_id: event.node_id as string,
              workflow_id: event.workflow_id as string,
              fields: d.fields,
              reason: d.reason,
            });
            // Initialize empty values for each field
            const initial: Record<string, string> = {};
            for (const f of d.fields) initial[f.name] = "";
            setCredentialValues(initial);
            // Update the node status to show it's waiting for input
            setNodeStatuses((prev) => {
              const next = new Map(prev);
              const existing = next.get(event.node_id as string);
              if (existing) {
                next.set(event.node_id as string, { ...existing, status: "waiting_input" });
              }
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

  const isLoading = phase === "planning" || phase === "executing";

  const handleCredentialSubmit = useCallback(async () => {
    if (!credentialRequest || !workflow) return;
    try {
      await fetch(`${API}/workflow/${workflow.id}/input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: credentialRequest.node_id,
          data: credentialValues,
        }),
      });
      // Update node status back to running
      setNodeStatuses((prev) => {
        const next = new Map(prev);
        const existing = next.get(credentialRequest.node_id);
        if (existing) {
          next.set(credentialRequest.node_id, { ...existing, status: "running" });
        }
        return next;
      });
      setCredentialRequest(null);
      setCredentialValues({});
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Failed to submit credentials: ${err}` },
      ]);
    }
  }, [credentialRequest, credentialValues, workflow]);

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}
      >
        <button
          onClick={() => router.push("/")}
          className="text-xs px-2 py-1 rounded transition-colors"
          style={{ color: "var(--text-dim)", background: "var(--bg-surface)" }}
        >
          ← All workflows
        </button>
        {workflow && (
          <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
            {workflow.name}
          </span>
        )}
        {isNew && !workflow && (
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            New workflow
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
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
              {phase === "idle" && !isNew ? "Loading workflow..." : "Waiting for workflow plan..."}
            </p>
          </div>
        )}
      </div>

      {/* Credential request modal */}
      {credentialRequest && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
              minWidth: 360,
              maxWidth: 480,
            }}
          >
            <h3
              className="text-sm font-bold mb-1"
              style={{ color: "var(--text)" }}
            >
              Credentials Required
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--text-dim)" }}>
              {credentialRequest.reason}
            </p>
            {credentialRequest.fields.map((field) => (
              <div key={field.name} className="mb-3">
                <label
                  className="text-xs font-medium block mb-1"
                  style={{ color: "var(--text-dim)" }}
                >
                  {field.label}
                </label>
                <input
                  type={field.sensitive ? "password" : "text"}
                  value={credentialValues[field.name] || ""}
                  onChange={(e) =>
                    setCredentialValues((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded text-sm outline-none"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder={field.label}
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCredentialSubmit}
                className="flex-1 px-4 py-2 rounded text-sm font-medium transition-colors"
                style={{
                  background: "var(--blue)",
                  color: "#fff",
                }}
              >
                Submit
              </button>
              <button
                onClick={() => setCredentialRequest(null)}
                className="px-4 py-2 rounded text-sm transition-colors"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-dim)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
