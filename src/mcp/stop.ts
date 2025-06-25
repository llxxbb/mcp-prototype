import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";

export async function callTool(
  args?: Record<string, any>,
): Promise<CallToolResult> {
  if (!args || typeof args !== "object") {
    logger.warn("Invalid arguments for stop tool", args);
    return {
      content: [
        {
          type: "text",
          text: "Invalid arguments: expected object",
        },
      ],
      isError: true,
    };
  }

  const { serviceName } = args;
  if (!serviceName || typeof serviceName !== "string") {
    logger.warn("Missing serviceName in stop tool", args);
    return {
      content: [
        {
          type: "text",
          text: "Missing required serviceName parameter",
        },
      ],
      isError: true,
    };
  }

  logger.info(`Stopping service: ${serviceName}`);
  // 模拟服务停止过程
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            status: "stopped",
            serviceName,
            stoppedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      },
    ],
  };
}
