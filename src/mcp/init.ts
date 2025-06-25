import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";

export async function callTool(
  args?: Record<string, any>,
): Promise<CallToolResult> {
  if (!args || typeof args !== "object") {
    logger.warn("Invalid arguments for init tool", args);
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

  const { config } = args;
  if (!config || typeof config !== "object") {
    logger.warn("Missing config in init tool", args);
    return {
      content: [
        {
          type: "text",
          text: "Missing required config parameter",
        },
      ],
      isError: true,
    };
  }

  logger.info("Initializing with config", config);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            status: "initialized",
            config,
          },
          null,
          2,
        ),
      },
    ],
  };
}
