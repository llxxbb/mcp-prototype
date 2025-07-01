import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from "./utils/logger.js";
import { helloWorldTool, registerHelloWorldTool } from "./tool/helloWorld.js";
import { registerGetSpecTool } from "./tool/getSpec.js";
import { registerInitTool } from "./tool/init.js";
import { registerWebTools } from "./tool/web.js";

export class EnhancedMcpServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: "example-mcp-server",
      version: "0.1.0",
    });

    // Register tools using the new registration functions
    registerHelloWorldTool(this.server);
    registerGetSpecTool(this.server);
    registerInitTool(this.server);
    registerWebTools(this.server);

    // // Register resources
    // this.server.registerResource(
    //   'greeting',
    //   new ResourceTemplate('greeting://{name}'),
    //   {
    //     title: 'Greeting Resource',
    //     description: 'Dynamic greeting generator'
    //   },
    //   async (uri: URL, { name }: { name: string }) => {
    //     logger.info(`Generating greeting for ${name}`);
    //     return {
    //       contents: [{
    //         uri: uri.href,
    //         text: `Hello, ${name}!`
    //       }]
    //     };
    //   }
    // );

    // Error handling
    process.stdin.on("error", (err: Error) => {
      logger.error("STDIN Error", err);
    });

    process.stdout.on("error", (err: Error) => {
      logger.error("STDOUT Error", err);
    });

    process.on("SIGINT", async () => {
      try {
        await this.server.close();
        process.exit(0);
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Shutdown failed: ${err.message}`);
        }
        process.exit(1);
      }
    });
  }

  private isConnected: boolean = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000; // 3 seconds
  private heartbeatInterval?: NodeJS.Timeout;
  private keepAliveInterval?: NodeJS.Timeout;

  async run(): Promise<void> {
    try {
      logger.info("Starting MCP server...");
      const transport = new StdioServerTransport();

      const monitorConnection = async (): Promise<void> => {
        if (
          !this.isConnected &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.reconnectAttempts++;
          logger.warn(
            `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
          );

          try {
            await this.server.connect(transport);
            this.isConnected = true;
            this.reconnectAttempts = 0;
            logger.info("Reconnected successfully");
          } catch (err) {
            if (err instanceof Error) {
              logger.error(`Reconnect failed: ${err.message}`);
            }
            setTimeout(monitorConnection, this.reconnectDelay);
          }
        }
      };

      // Initial connection
      await this.server.connect(transport);
      this.isConnected = true;
      logger.info("Server running on stdio");

      // Heartbeat check
      this.heartbeatInterval = setInterval(() => {
        if (!this.isConnected) {
          logger.warn("Connection lost, attempting to reconnect...");
          monitorConnection();
        }
      }, 5000);

      // Keep process alive
      this.keepAliveInterval = setInterval(() => {
        if (!this.isConnected) {
          clearInterval(this.keepAliveInterval);
        }
      }, 1000);
    } catch (err) {
      logger.error("Server startup failed", err);
      process.exit(1);
    }
  }

  async callTool(
    name: string,
    args: { name?: string },
  ): Promise<{ content: unknown }> {
    if (name === "hello_world") {
      const response = await helloWorldTool(args);
      return {
        content: response.content,
      };
    }
    throw new Error(`Unknown tool: ${name}`);
  }

  async close(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    await this.server.close();
    this.isConnected = false;
    logger.info("Server stopped");
  }
}

const server = new EnhancedMcpServer();
server.run().catch((err) => {
  logger.error("Unhandled server error", err);
  process.exit(1);
});
