import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";

export async function callTool(
  args?: Record<string, any>,
): Promise<CallToolResult> {
  if (!args || typeof args !== "object") {
    logger.warn("Invalid arguments for start tool", args);
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
    logger.warn("Missing serviceName in start tool", args);
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

  logger.info(`Starting service: ${serviceName}`);
  // 模拟服务启动过程
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            status: "running",
            serviceName,
            startedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      },
    ],
  };
}
