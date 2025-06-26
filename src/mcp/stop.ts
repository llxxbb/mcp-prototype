import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export async function stopTool(): Promise<CallToolResult> {
  logger.info("Stopping service");
  // 模拟服务停止过程
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            isOk: true,
            message: "",
          },
          null,
          2,
        ),
      },
    ],
  };
}

export function registerStopTool(server: McpServer) {
  server.registerTool(
    "stop",
    {
      title: "Stop Service",
      description: "停止展示原型，并关闭web服务器",
      inputSchema: {},
    },
    async () => {
      const response = await stopTool();
      return {
        content: response.content,
      };
    },
  );
}
