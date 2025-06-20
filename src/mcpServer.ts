import { Server } from '@modelcontextprotocol/sdk/server';
import { SseServerTransport } from '@modelcontextprotocol/sdk/server/sse';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types';

export class McpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'example-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'example_tool',
          description: 'Example tool for SSE MCP server',
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'example_tool') {
        throw new Error('Unknown tool');
      }
      return {
        content: [
          {
            type: 'text',
            text: 'Example tool executed successfully',
          },
        ],
      };
    });
  }

  async run() {
    const transport = new SseServerTransport();
    await this.server.connect(transport);
    console.log('MCP server running on SSE');
  }
}

const server = new McpServer();
server.run().catch(console.error);