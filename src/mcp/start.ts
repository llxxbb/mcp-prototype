import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export async function startTool(): Promise<CallToolResult> {
  logger.info("Starting service");
  // 模拟服务启动过程
  await new Promise((resolve) => setTimeout(resolve, 1000));

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

export function registerStartTool(server: McpServer) {
  server.registerTool(
    "start",
    {
      title: "Start Service",
      description: `
该工具将启动web服务并展示模型，调用成功后，请在浏览器里输入本地地址和 init 中指定的端口号进行查看。在调用此工具前，下面的事情需要就位，否则此工具可能无法正常工作：

- 遵循 getSpec 工具中的指示并进行了原型创造。
- 已经调用 init 工具进行了初始化。
`,
      inputSchema: {},
    },
    async () => {
      const response = await startTool();
      return {
        content: response.content,
      };
    },
  );
}
