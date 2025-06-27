import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";
import { response } from "../utils/response.js";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InitArgsSchema } from "./schema-init.js";
import { checkDirectory } from "../utils/directory.js";

// Global configuration object
export let globalConfig: Partial<InitArgs> = {};
export let initialized = false;

type InitArgs = z.infer<typeof InitArgsSchema>;

export async function initTool(args?: InitArgs): Promise<CallToolResult> {
  if (!args || typeof args !== "object") {
    logger.warn("Invalid arguments for init tool", args);
    return response.error("Invalid arguments: expected object");
  }

  const parsedArgs = InitArgsSchema.parse(args);

  if (
    globalConfig.projectPath === undefined &&
    (parsedArgs?.projectPath === undefined || parsedArgs?.projectPath === "")
  ) {
    logger.warn("Init failed: projectPath is required");
    return response.error("[projectPath] must be set for first time");
  }

  // Verify projectPath exists and is a directory
  if (parsedArgs.projectPath) {
    const dirResult = await checkDirectory(parsedArgs.projectPath);
    if (dirResult.isErr()) {
      logger.warn(`Invalid project path: ${parsedArgs.projectPath}`);
      return response.error(`Invalid project path: ${parsedArgs.projectPath}`);
    }
    initialized = true;
  }

  // Update globalConfig with parsed args (partial update)
  globalConfig = { ...globalConfig, ...parsedArgs };
  return response.success("Initialization succeeded");
}

export function registerInitTool(server: McpServer) {
  server.registerTool(
    "init",
    {
      title: "Initialize Tool",
      description:
        "告诉 MCP-Prototype 原型根路径、是否展示标记等初始化信息，可以多次调用",
      inputSchema: InitArgsSchema.shape,
    },
    async (args: InitArgs) => {
      const rep = await initTool(args);
      return {
        content: rep.content,
      };
    },
  );
}
