#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { GetSpecInputSchema } from "./types/tools.js";
import { callTool as helloWorld } from "./mcp/helloWorld.js";
import { callTool as getSpec } from "./mcp/getSpec.js";
import { callTool as init } from "./mcp/init.js";
import { callTool as start } from "./mcp/start.js";
import { callTool as stop } from "./mcp/stop.js";
import { logger } from "./utils/logger.js";

class EnhancedMcpServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: "example-mcp-server",
      version: "0.1.0",
    });

    // Register tools
    this.server.registerTool(
      "hello_world",
      {
        title: "Hello World Tool",
        description: "Returns a greeting message",
        inputSchema: {
          name: z.string().describe("Name to greet"),
        },
      },
      async ({ name }: { name: string }) => {
        logger.info(`Processing hello_world request for ${name}`);
        const response = await helloWorld({ name });
        return {
          content: response.content,
        };
      },
    );

    this.server.registerTool(
      "getSpec",
      {
        title: "Get Specification",
        description: "Returns service specification",
        inputSchema: GetSpecInputSchema,
      },
      async () => {
        logger.info("Processing getSpec request");
        const response = await getSpec({});
        return {
          content: response.content,
        };
      },
    );

    this.server.registerTool(
      "init",
      {
        title: "Initialize Service",
        description: "Initializes service with configuration",
        inputSchema: {
          config: z.record(z.unknown()).describe("Configuration object"),
        },
      },
      async ({ config }: { config: Record<string, unknown> }) => {
        logger.info("Processing init request");
        const response = await init({ config });
        return {
          content: response.content,
        };
      },
    );

    this.server.registerTool(
      "start",
      {
        title: "Start Service",
        description: "Starts the specified service",
        inputSchema: {
          serviceName: z.string().describe("Name of service to start"),
        },
      },
      async ({ serviceName }: { serviceName: string }) => {
        logger.info(`Processing start request for ${serviceName}`);
        const response = await start({ serviceName });
        return {
          content: response.content,
        };
      },
    );

    this.server.registerTool(
      "stop",
      {
        title: "Stop Service",
        description: "Stops the specified service",
        inputSchema: {
          serviceName: z.string().describe("Name of service to stop"),
        },
      },
      async ({ serviceName }: { serviceName: string }) => {
        logger.info(`Processing stop request for ${serviceName}`);
        const response = await stop({ serviceName });
        return {
          content: response.content,
        };
      },
    );

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
      setInterval(() => {
        if (!this.isConnected) {
          logger.warn("Connection lost, attempting to reconnect...");
          monitorConnection();
        }
      }, 5000);

      // Keep process alive
      const keepAliveInterval = setInterval(() => {
        if (!this.isConnected) {
          clearInterval(keepAliveInterval);
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
      const response = await helloWorld(args);
      return {
        content: response.content,
      };
    }
    throw new Error(`Unknown tool: ${name}`);
  }

  async close(): Promise<void> {
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

export { EnhancedMcpServer as McpServer };
