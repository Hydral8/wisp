export interface DAGNode {
  id: string;
  step: string;
  server_name: string;
  tool_name: string;
  arguments: Record<string, unknown>;
  depends_on: string[];
  output_key: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: DAGNode[];
  status: string;
  webhook_id?: string;
  browser_use_mode?: "local" | "remote";
}

export interface ExecutionEvent {
  type: string;
  workflow_id: string;
  node_id?: string;
  data: Record<string, unknown>;
  timestamp?: string;
}

export interface NodeStatus {
  id: string;
  step: string;
  server_name: string;
  tool_name: string;
  arguments: Record<string, unknown>;
  status: "pending" | "running" | "complete" | "error" | "waiting_input";
  result?: unknown;
  error?: string;
  elapsed?: number;
  progress?: number;
  level?: number;
  actionRequired?: boolean;
  actionMessage?: string;
  actionUrl?: string;
  browserSessionId?: string;
  browserLiveUrl?: string;
  browserShareUrl?: string;
  browserSteps?: Array<{
    number: number;
    next_goal: string;
    url?: string;
  }>;
}

export interface CredentialField {
  name: string;
  label: string;
  sensitive?: boolean;
}

export interface CredentialRequest {
  node_id: string;
  workflow_id: string;
  fields: CredentialField[];
  reason: string;
}

export interface ConfigurableParam {
  nodeId: string;
  paramKey: string;
  label: string;
  description: string;
  defaultValue: unknown;
  type: "string" | "number" | "boolean";
}

export interface MarketplaceItem {
  _id: string;
  publisherName: string;
  name: string;
  description: string;
  objective: string;
  nodes: DAGNode[];
  configurableParams: ConfigurableParam[];
  tags: string[];
  usageCount: number;
  createdAt: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface PlanResponse {
  workflow: Workflow | null;
  session_id: string;
  chat_messages: ChatMessage[];
  needs_input?: boolean;
}

// --- Planning stream events ---

export type AppPhase = "idle" | "planning" | "preview" | "executing" | "done";

export type PlanningEvent =
  | { type: "session_init"; session_id: string }
  | { type: "planning_start"; max_turns: number }
  | { type: "llm_call_start"; turn: number; max_turns: number }
  | { type: "llm_call_complete"; turn: number; stop_reason: string; has_tool_calls: boolean; text_preview: string }
  | { type: "tool_search_start"; query: string }
  | { type: "tool_search_complete"; query: string; count: number; tool_names: string[]; elapsed: number }
  | { type: "planning_thinking"; text: string }
  | { type: "planning_message"; text: string }
  | { type: "planning_warnings"; warnings: string[] }
  | { type: "dag_complete"; workflow: Workflow }
  | { type: "planning_error"; message: string }
  | { type: "tool_exec_start"; server_name: string; tool_name: string; arguments: Record<string, unknown> }
  | { type: "tool_exec_complete"; server_name: string; tool_name: string; result: unknown; elapsed: number; success: boolean }
  | { type: "agent_done"; text: string; executed_steps: Record<string, unknown>[] };
