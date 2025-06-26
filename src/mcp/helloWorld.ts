import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../utils/logger.js";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const helloWorldSchema = {
  name: z.string().describe("Name to greet"),
  age: z.number().optional().describe("Age of the person"),
  location: z.string().optional().describe("Location of the person"),
  interests: z.array(z.string()).optional().describe("List of interests"),
  isVerified: z.boolean().optional().describe("Verification status"),
};

const helloWorldZodObject = z.object(helloWorldSchema);
type HelloWorldArgs = z.infer<typeof helloWorldZodObject>;

export async function helloWorldTool(
  args?: Partial<HelloWorldArgs>,
): Promise<CallToolResult> {
  if (!args || !helloWorldZodObject.safeParse(args).success) {
    logger.warn("Invalid arguments for hello_world tool", args);
    return {
      content: [
        {
          type: "text",
          text: "Invalid arguments: name must be a string",
        },
      ],
      isError: true,
    };
  }

  logger.info(`Generating greeting for ${args.name}`, {
    age: args.age,
    location: args.location,
    interestCount: args.interests?.length,
    isVerified: args.isVerified,
  });
  return {
    content: [
      {
        type: "text",
        text: `Hello, ${args.name}!`,
      },
    ],
  };
}

export function registerHelloWorldTool(server: McpServer) {
  server.registerTool(
    "hello_world",
    {
      title: "Hello World Tool",
      description: "Returns a greeting message",
      inputSchema: helloWorldSchema,
    },
    async (args: HelloWorldArgs) => {
      const response = await helloWorldTool(args);
      return {
        content: response.content,
      };
    },
  );
}
