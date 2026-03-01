"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type {
  Workflow,
  DAGNode,
  NodeStatus,
  ChatMessage,
  PlanningEvent,
  AppPhase,
  CredentialField,
  CredentialRequest,
  ConfigurableParam,
} from "@/lib/types";
import {
  ChatEntry,
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
  const [workflowId, setWorkflowId] = useState<Id<"workflows"> | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatEntry[]>([]);
  const [nodeStatuses, setNodeStatuses] = useState<Map<string, NodeStatus>>(new Map());
  const [runMode, setRunMode] = useState<"deploy" | "test" | null>(null);
  const [browserUseMode, setBrowserUseMode] = useState<"local" | "remote">("local");
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const loadedRef = useRef(false);
  const [credentialRequest, setCredentialRequest] = useState<CredentialRequest | null>(null);
  const [credentialValues, setCredentialValues] = useState<Record<string, string>>({});
  const [executedSteps, setExecutedSteps] = useState<Record<string, unknown>[]>([]);
  const [agentSummary, setAgentSummary] = useState<string>("");

  // Freeze/Publish state
  const [freezing, setFreezing] = useState(false);
  const [frozenNodes, setFrozenNodes] = useState<DAGNode[] | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishName, setPublishName] = useState("");
  const [publishDescription, setPublishDescription] = useState("");
  const [publishTags, setPublishTags] = useState("");
  const [configurableParams, setConfigurableParams] = useState<ConfigurableParam[]>([]);
  const [suggestingParams, setSuggestingParams] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Convex actions
  const startPlanning = useAction(api.planning.startPlanning);
  const startExecution = useAction(api.execution.startExecution);
  // Convert/Save Workflow state
  const [draftingWorkflow, setDraftingWorkflow] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftNodes, setDraftNodes] = useState<any[]>([]);
  const [draftConfigParams, setDraftConfigParams] = useState<ConfigurableParam[]>([]);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");

  const draftWorkflowConversion = useAction(api.chat.draftWorkflowConversion);
  const saveWorkflow = useAction(api.chat.saveWorkflow);
  const renameWorkflow = useMutation(api.workflows.rename);
  const createWebhookMutation = useMutation(api.webhooks.create);
  const publishToMarketplace = useMutation(api.marketplace.publish);
  const suggestConfigurable = useAction(api.marketplace.suggestConfigurable);
  const generateAppLayout = useAction(api.apps.generateAppLayout);
  const [generatingApp, setGeneratingApp] = useState(false);

  // Subscribe to planning events reactively
  const planningEvents = useQuery(
    api.planning.getPlanningEvents,
    sessionId ? { sessionId } : "skip"
  );

  // Subscribe to execution events reactively
  const executionEvents = useQuery(
    api.execution.getExecutionEvents,
    workflowId ? { workflowId } : "skip"
  );

  // Load existing workflow from Convex
  const existingWorkflow = useQuery(
    api.workflows.get,
    !isNew && id ? { id: id as Id<"workflows"> } : "skip"
  );

  // Process planning events as they arrive
  const lastPlanningEventCount = useRef(0);
  useEffect(() => {
    if (!planningEvents || planningEvents.length === 0) return;
    if (planningEvents.length <= lastPlanningEventCount.current) return;

    const newEvents = planningEvents.slice(lastPlanningEventCount.current);
    lastPlanningEventCount.current = planningEvents.length;

    for (const eventDoc of newEvents) {
      const event = eventDoc.event as PlanningEvent & { session_id?: string };

      if (event.type === "session_init") {
        return;
      }

      const pe = event as PlanningEvent;

      // Add to chat messages
      setChatMessages((prev) => [
        ...prev,
        { role: "system", content: "", planningEvent: pe },
      ]);

      if (pe.type === "dag_complete") {
        setWorkflow(pe.workflow);
        setBrowserUseMode(pe.workflow.browser_use_mode ?? "local");
        setPhase("preview");
      }

      if (pe.type === "agent_done") {
        const e = pe as unknown as Record<string, unknown>;
        setExecutedSteps((e.executed_steps as Record<string, unknown>[]) || []);
        setAgentSummary((e.text as string) || "");
        setPhase("idle");
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
    }
  }, [planningEvents]);

  // Process execution events as they arrive
  const lastExecEventCount = useRef(0);
  useEffect(() => {
    if (!executionEvents || executionEvents.length === 0) return;
    if (executionEvents.length <= lastExecEventCount.current) return;

    const newEvents = executionEvents.slice(lastExecEventCount.current);
    lastExecEventCount.current = executionEvents.length;

    for (const eventDoc of newEvents) {
      const event = eventDoc.event as any;

      if (event.type === "node_start") {
        const d = event.data || {};
        setNodeStatuses((prev) => {
          const next = new Map(prev);
          next.set(event.node_id, {
            id: event.node_id,
            step: d.step,
            server_name: d.server_name,
            tool_name: d.tool_name,
            arguments: d.arguments,
            status: "running",
            level: d.level,
            progress: d.progress,
            browserSteps: [],
          });
          return next;
        });
      } else if (event.type === "node_complete") {
        const d = event.data || {};
        setNodeStatuses((prev) => {
          const next = new Map(prev);
          const existing = next.get(event.node_id);
          next.set(event.node_id, {
            ...existing!,
            status: "complete",
            result: d.result,
            elapsed: d.elapsed,
            progress: d.progress,
            actionRequired: Boolean(d.action_required),
            actionMessage: d.action_message,
            actionUrl: d.action_url,
            browserSessionId: d.session_id,
            browserLiveUrl: d.live_url,
            browserShareUrl: d.share_url,
          });
          return next;
        });
      } else if (event.type === "node_error") {
        const d = event.data || {};
        setNodeStatuses((prev) => {
          const next = new Map(prev);
          const existing = next.get(event.node_id);
          next.set(event.node_id, {
            ...existing!,
            status: "error",
            error: d.error,
            progress: d.progress,
            actionRequired: Boolean(d.action_required),
            actionMessage: d.action_message,
            actionUrl: d.action_url,
          });
          return next;
        });
      } else if (event.type === "node_browser_session") {
        const d = event.data || {};
        setNodeStatuses((prev) => {
          const next = new Map(prev);
          const existing = next.get(event.node_id);
          if (!existing) return next;
          next.set(event.node_id, {
            ...existing,
            browserSessionId: d.session_id,
            browserLiveUrl: d.live_url,
            browserShareUrl: d.share_url,
          });
          return next;
        });
      } else if (event.type === "node_step") {
        const d = event.data || {};
        setNodeStatuses((prev) => {
          const next = new Map(prev);
          const existing = next.get(event.node_id);
          if (!existing) return next;
          next.set(event.node_id, {
            ...existing,
            browserSteps: [
              ...(existing.browserSteps ?? []),
              { number: d.number ?? 0, next_goal: d.next_goal ?? "", url: d.url },
            ],
          });
          return next;
        });
      } else if (event.type === "credential_request") {
        const d = event.data || {};
        setCredentialRequest({
          node_id: event.node_id,
          workflow_id: event.workflow_id,
          fields: d.fields,
          reason: d.reason,
        });
        const initial: Record<string, string> = {};
        for (const f of d.fields) initial[f.name] = "";
        setCredentialValues(initial);
        setNodeStatuses((prev) => {
          const next = new Map(prev);
          const existing = next.get(event.node_id);
          if (existing) {
            next.set(event.node_id, { ...existing, status: "waiting_input" });
          }
          return next;
        });
      } else if (event.type === "workflow_complete") {
        setPhase("done");
      }
    }
  }, [executionEvents]);

  // Load existing workflow
  useEffect(() => {
    if (existingWorkflow && !workflow) {
      const wf = existingWorkflow as any;
      setWorkflow({
        id: wf._id,
        name: wf.name,
        description: wf.description,
        nodes: wf.nodes,
        status: wf.status,
        browser_use_mode: wf.browserUseMode,
      });
      setBrowserUseMode(wf.browserUseMode ?? "local");
      setWorkflowId(wf._id);
      setPhase("preview");
    }
  }, [existingWorkflow, workflow]);

  // Start planning from URL prompt
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (isNew) {
      const prompt = searchParams.get("prompt");
      if (prompt) {
        // Generate sessionId client-side so subscription starts immediately
        const newSessionId = Math.random().toString(36).slice(2, 10);
        setSessionId(newSessionId);
        setChatMessages([{ role: "user", content: prompt }]);
        setPhase("planning");

        startPlanning({ prompt, sessionId: newSessionId }).catch((err) => {
          setChatMessages((prev) => [
            ...prev,
            { role: "assistant", content: `Error: ${err}` },
          ]);
          setPhase("idle");
        });
      }
    }
  }, [isNew, searchParams, startPlanning]);

  const handleChat = useCallback(
    async (message: string) => {
      setChatMessages((prev) => [...prev, { role: "user", content: message }]);
      setPhase("planning");

      // Generate a new session for the follow-up if none exists
      const sid = sessionId ?? Math.random().toString(36).slice(2, 10);
      if (!sessionId) setSessionId(sid);

      try {
        await startPlanning({ prompt: message, sessionId: sid });
      } catch (err) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${err}` },
        ]);
        setPhase("idle");
      }
    },
    [sessionId, startPlanning]
  );

  const handleRun = useCallback(
    async (mode: "deploy" | "test") => {
      if (!workflowId) return;
      setRunMode(mode);
      setPhase("executing");
      setNodeStatuses(new Map());
      setWebhookUrl(null);
      lastExecEventCount.current = 0;

      try {
        const result = await startExecution({
          workflowId,
          browserUseMode,
        });

        if (result?.status === "waiting_input") {
          // Execution paused for user input — don't set done
        } else {
          setPhase("done");
        }
      } catch (err) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Run error: ${err}` },
        ]);
        setPhase("done");
      }
    },
    [browserUseMode, workflowId, startExecution]
  );

  const handleCreateWebhook = useCallback(async () => {
    if (!workflowId) return;
    try {
      const result = await createWebhookMutation({ workflowId });
      setWebhookUrl(`/webhooks/${result.webhookKey}/trigger`);
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }, [workflowId, createWebhookMutation]);

  const handleRename = useCallback(async (newName: string) => {
    if (!workflow) return;
    setWorkflow({ ...workflow, name: newName });
    if (workflowId) {
      try {
        await renameWorkflow({ id: workflowId, name: newName });
      } catch (err) {
        console.error("Rename error:", err);
      }
    }
  }, [workflow, workflowId, renameWorkflow]);

  const isLoading = phase === "planning" || phase === "executing";

  const handleConvertToWorkflow = useCallback(async () => {
    if (executedSteps.length === 0) return;
    setDraftingWorkflow(true);
    try {
      const result = await draftWorkflowConversion({
        name: agentSummary.slice(0, 60) || "Workflow",
        description: agentSummary,
        executedSteps,
      });

      setDraftNodes(result?.nodes || []);
      setConfigurableParams(result?.configurableParams || []);
      setDraftName(result?.name || agentSummary.slice(0, 60) || "Workflow");
      setDraftDescription(result?.description || "Workflow generated from agent session");
      setShowDraftModal(true);
    } catch (err) {
      console.error("Draft error:", err);
      // Fallback
      setDraftNodes([]);
      setConfigurableParams([]);
      setShowDraftModal(true);
    } finally {
      setDraftingWorkflow(false);
    }
  }, [executedSteps, agentSummary, draftWorkflowConversion]);

  const handleConfirmSaveWorkflow = useCallback(async () => {
    setDraftingWorkflow(true);
    try {
      const result = await saveWorkflow({
        name: draftName,
        description: draftDescription,
        nodes: draftNodes,
        configurableParams,
      });
      if (result?.workflowId) {
        setWorkflowId(result.workflowId as Id<"workflows">);
        setShowDraftModal(false);
        router.replace(`/workflow/${result.workflowId}`, { scroll: false });
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setDraftingWorkflow(false);
    }
  }, [draftName, draftDescription, draftNodes, configurableParams, router, saveWorkflow]);

  const handleCredentialSubmit = useCallback(async () => {
    if (!credentialRequest || !workflowId) return;
    // TODO: implement credential submission for paused workflows
    // This would resume the execution with the provided credentials
    setCredentialRequest(null);
    setCredentialValues({});
  }, [credentialRequest, workflowId]);

  // --- Freeze / Publish handlers ---

  const treeshakeNodes = useCallback((nodes: DAGNode[], statuses: Map<string, NodeStatus>): DAGNode[] => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    // Find consumed output keys
    const consumedKeys = new Set<string>();
    for (const n of nodes) {
      const argsStr = JSON.stringify(n.arguments);
      for (const other of nodes) {
        if (other.output_key && argsStr.includes(other.output_key)) {
          consumedKeys.add(other.output_key);
        }
      }
    }
    // Find nodes that are depended on
    const dependedOn = new Set<string>();
    for (const n of nodes) {
      for (const dep of n.depends_on) dependedOn.add(dep);
    }
    // Determine which nodes to keep
    const keepIds = new Set<string>();
    for (const n of nodes) {
      const status = statuses.get(n.id);
      // Remove errored nodes with no successful downstream
      if (status?.status === "error") {
        const hasSuccessfulDependent = nodes.some(
          o => o.depends_on.includes(n.id) && statuses.get(o.id)?.status === "complete"
        );
        if (!hasSuccessfulDependent) continue;
      }
      // Remove intermediate __llm__ nodes not consumed downstream
      if (n.server_name === "__llm__" && !consumedKeys.has(n.output_key) && !dependedOn.has(n.id)) {
        continue;
      }
      keepIds.add(n.id);
    }
    // Re-link dependencies
    return nodes.filter(n => keepIds.has(n.id)).map(n => ({
      ...n,
      depends_on: n.depends_on.flatMap(dep => {
        if (keepIds.has(dep)) return [dep];
        const removed = nodeMap.get(dep);
        return removed ? removed.depends_on.filter(p => keepIds.has(p)) : [];
      }),
    }));
  }, []);

  const handleFreeze = useCallback(async () => {
    if (!workflow) return;
    setFreezing(true);
    try {
      const clean = treeshakeNodes(workflow.nodes, nodeStatuses);
      setFrozenNodes(clean);
      // Update the workflow display with frozen nodes
      setWorkflow({ ...workflow, nodes: clean });
      if (workflowId) {
        // Persist frozen nodes to Convex - no await needed for UI
        // The updateNodes mutation is already available
      }
      setChatMessages(prev => [
        ...prev,
        { role: "assistant", content: `Workflow frozen. ${workflow.nodes.length - clean.length} node(s) removed, ${clean.length} kept.` },
      ]);
    } finally {
      setFreezing(false);
    }
  }, [workflow, nodeStatuses, treeshakeNodes, workflowId]);

  const handlePublish = useCallback(async () => {
    if (!workflow) return;
    const nodes = frozenNodes ?? workflow.nodes;
    setPublishName(workflow.name);
    setPublishDescription(workflow.description);
    setShowPublishModal(true);

    // Auto-suggest configurable params
    setSuggestingParams(true);
    try {
      const suggestions = await suggestConfigurable({
        nodes,
        objective: workflow.description,
      });
      setConfigurableParams(
        (suggestions as ConfigurableParam[]).map((s: ConfigurableParam) => ({ ...s }))
      );
    } catch (err) {
      console.error("Suggest configurable error:", err);
    } finally {
      setSuggestingParams(false);
    }
  }, [workflow, frozenNodes, suggestConfigurable]);

  const handleConfirmPublish = useCallback(async () => {
    if (!workflow) return;
    setPublishing(true);
    try {
      const nodes = frozenNodes ?? workflow.nodes;
      await publishToMarketplace({
        name: publishName,
        description: publishDescription,
        objective: workflow.description,
        nodes,
        configurableParams: configurableParams.map(cp => ({
          nodeId: cp.nodeId,
          paramKey: cp.paramKey,
          label: cp.label,
          description: cp.description,
          defaultValue: cp.defaultValue,
          type: cp.type,
        })),
        tags: publishTags.split(",").map(t => t.trim()).filter(Boolean),
      });
      setShowPublishModal(false);
      setChatMessages(prev => [
        ...prev,
        { role: "assistant", content: `Published "${publishName}" to the marketplace!` },
      ]);
    } catch (err) {
      console.error("Publish error:", err);
    } finally {
      setPublishing(false);
    }
  }, [workflow, frozenNodes, publishName, publishDescription, publishTags, configurableParams, publishToMarketplace]);

  const handleGenerateApp = useCallback(async () => {
    if (!workflowId) return;
    setGeneratingApp(true);
    try {
      const result = await generateAppLayout({ workflowId });
      if (result?.appId) {
        router.push(`/app/${result.appId}`);
      }
    } catch (err) {
      console.error("Generate app error:", err);
      setChatMessages(prev => [
        ...prev,
        { role: "assistant", content: `Failed to generate app: ${err}` },
      ]);
    } finally {
      setGeneratingApp(false);
    }
  }, [workflowId, generateAppLayout, router]);

  // Derive planning events for the PlanningFeed component
  const planningEventsList = useMemo(() => {
    return (planningEvents ?? []).map((e: any) => e.event as PlanningEvent);
  }, [planningEvents]);

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
          &larr; All workflows
        </button>
        {workflow ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              defaultValue={workflow.name}
              key={workflow.id}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v && v !== workflow.name) handleRename(v);
                e.target.style.background = "transparent";
                e.target.style.outline = "none";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              onFocus={(e) => {
                e.target.style.background = "var(--bg-surface)";
                e.target.style.outline = "1px solid var(--border)";
              }}
              className="text-xs font-medium"
              style={{
                color: "var(--text)", background: "transparent", border: "none",
                outline: "none", fontFamily: "inherit", padding: "2px 4px",
                borderRadius: 4, minWidth: 100, maxWidth: 400,
                cursor: "text",
              }}
            />
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="var(--text-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : isNew ? (
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            New workflow
          </span>
        ) : (
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            Loading workflow...
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <ChatPane
          messages={chatMessages}
          onSend={handleChat}
          loading={isLoading || draftingWorkflow}
        />
        {phase === "planning" || (!workflow && planningEventsList.length > 0) ? (
          <PlanningFeed
            events={planningEventsList}
            onConvertToWorkflow={executedSteps.length > 0 ? handleConvertToWorkflow : undefined}
            convertingToWorkflow={draftingWorkflow}
          />
        ) : workflow ? (
          <WorkflowPane
            workflow={workflow}
            nodeStatuses={nodeStatuses}
            phase={phase}
            runMode={runMode}
            browserUseMode={browserUseMode}
            onChangeBrowserUseMode={setBrowserUseMode}
            onRun={handleRun}
            onCreateWebhook={handleCreateWebhook}
            webhookUrl={webhookUrl}
            onFreeze={handleFreeze}
            onPublish={handlePublish}
            freezing={freezing}
            onGenerateApp={handleGenerateApp}
            generatingApp={generatingApp}
            onRename={handleRename}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              {phase === "idle" && !isNew ? "Loading workflow..." : "Waiting for workflow plan..."}
            </p>
          </div>
        )}
      </div>

      {/* Publish modal */}
      {showPublishModal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 12, padding: 24, minWidth: 420, maxWidth: 560, maxHeight: "80vh", overflowY: "auto",
            }}
          >
            <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text)" }}>
              Publish to Marketplace
            </h3>

            <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-dim)" }}>Name</label>
            <input
              value={publishName}
              onChange={e => setPublishName(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm outline-none mb-3"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />

            <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-dim)" }}>Description</label>
            <textarea
              value={publishDescription}
              onChange={e => setPublishDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded text-sm outline-none mb-3"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)", resize: "vertical", fontFamily: "inherit" }}
            />

            <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-dim)" }}>Tags (comma-separated)</label>
            <input
              value={publishTags}
              onChange={e => setPublishTags(e.target.value)}
              placeholder="e.g. GitHub, Research, AI"
              className="w-full px-3 py-2 rounded text-sm outline-none mb-4"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />

            {/* Configurable params */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>
                  Configurable Parameters
                </span>
                {suggestingParams && (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Analyzing...</span>
                )}
              </div>
              {configurableParams.length === 0 && !suggestingParams && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  No configurable parameters suggested.
                </p>
              )}
              {configurableParams.map((cp, i) => (
                <div
                  key={`${cp.nodeId}-${cp.paramKey}`}
                  style={{
                    padding: "10px 12px", borderRadius: 8, marginBottom: 8,
                    border: "1px solid var(--border)", background: "var(--bg-surface)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                      {cp.label}
                    </span>
                    <button
                      onClick={() => setConfigurableParams(prev => prev.filter((_, j) => j !== i))}
                      className="text-xs"
                      style={{ color: "var(--red, #ef4444)", cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>
                    {cp.nodeId}.{cp.paramKey} ({cp.type})
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {cp.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmPublish}
                disabled={publishing || !publishName.trim()}
                style={{
                  flex: 1, padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                  border: "none", background: "var(--green, #22c55e)", color: "#fff",
                  cursor: publishing ? "not-allowed" : "pointer", fontFamily: "inherit",
                  opacity: publishing ? 0.6 : 1,
                }}
              >
                {publishing ? "Publishing..." : "Confirm & Publish"}
              </button>
              <button
                onClick={() => setShowPublishModal(false)}
                style={{
                  padding: "8px 14px", borderRadius: 8, fontSize: 12,
                  border: "1px solid var(--border)", background: "transparent",
                  color: "var(--text-dim)", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert/Draft Workflow modal */}
      {showDraftModal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 12, padding: 24, minWidth: 420, maxWidth: 560, maxHeight: "80vh", overflowY: "auto",
            }}
          >
            <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text)" }}>
              Configure New Workflow
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--text-dim)" }}>
              We've intelligently converted your session into a reusable workflow graph. Here are the parameters you can adjust each time you run it.
            </p>

            <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-dim)" }}>Name</label>
            <input
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm outline-none mb-3"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />

            <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-dim)" }}>Description</label>
            <textarea
              value={draftDescription}
              onChange={e => setDraftDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded text-sm outline-none mb-4"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)", resize: "vertical", fontFamily: "inherit" }}
            />

            {/* Configurable params */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>
                  Adjustable Inputs
                </span>
              </div>
              {configurableParams.length === 0 && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  No adjustable inputs were detected for this workflow.
                </p>
              )}
              {configurableParams.map((cp, i) => (
                <div
                  key={`${cp.nodeId}-${cp.paramKey}`}
                  style={{
                    padding: "10px 12px", borderRadius: 8, marginBottom: 8,
                    border: "1px solid var(--border)", background: "var(--bg-surface)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                      {cp.label}
                    </span>
                    <button
                      onClick={() => setConfigurableParams(prev => prev.filter((_, j) => j !== i))}
                      className="text-xs"
                      style={{ color: "var(--red, #ef4444)", cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>
                    Maps to: <code style={{ color: "var(--orange, #f97316)" }}>{cp.nodeId}.{cp.paramKey}</code>
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {cp.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmSaveWorkflow}
                disabled={draftingWorkflow || !draftName.trim()}
                style={{
                  flex: 1, padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                  border: "none", background: "var(--accent, #3b82f6)", color: "#fff",
                  cursor: draftingWorkflow ? "not-allowed" : "pointer", fontFamily: "inherit",
                  opacity: draftingWorkflow ? 0.6 : 1,
                }}
              >
                {draftingWorkflow ? "Saving..." : "Save Workflow"}
              </button>
              <button
                onClick={() => setShowDraftModal(false)}
                style={{
                  padding: "8px 14px", borderRadius: 8, fontSize: 12,
                  border: "1px solid var(--border)", background: "transparent",
                  color: "var(--text-dim)", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
