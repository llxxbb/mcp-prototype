export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  tools?: Array<{
    name: string;
    inputSchema: Record<string, unknown>;
  }>;
  _meta?: Record<string, unknown>;
}