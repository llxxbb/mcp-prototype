import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";

export async function callTool(
  args?: Record<string, any>,
): Promise<CallToolResult> {
  if (!args || typeof args !== "object") {
    logger.warn("Invalid arguments for getSpec tool", args);
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

  logger.info("Generating specification");
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            version: "1.0",
            tools: ["getSpec", "init", "start", "stop"],
          },
          null,
          2,
        ),
      },
    ],
  };
}
