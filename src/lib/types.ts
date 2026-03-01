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
  status: "pending" | "running" | "complete" | "error";
  result?: unknown;
  error?: string;
  elapsed?: number;
  progress?: number;
  level?: number;
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
