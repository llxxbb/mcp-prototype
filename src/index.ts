#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class Context7Server {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'context7-server',
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
          name: 'get_context7_docs',
          description: 'Get documentation from Context7',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
              library: {
                type: 'string',
                description: 'Library ID in format /org/project or /org/project/version',
              },
            },
            required: ['query'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'get_context7_docs') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      const { query, library } = request.params.arguments as {
        query: string;
        library?: string;
      };
      
      try {
        // First resolve library ID if not provided
        const libraryId = library 
          ? library 
          : await this.resolveLibraryId(query);

        // Then get docs
        const docs = await this.getLibraryDocs(libraryId, query);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(docs, null, 2),
          }],
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Context7 error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async resolveLibraryId(query: string): Promise<string> {
    // Implementation would call Context7 resolve-library-id tool
    // For now returning a mock value
    return '/org/example';
  }

  private async getLibraryDocs(libraryId: string, query: string): Promise<any> {
    // Implementation would call Context7 get-library-docs tool
    // For now returning mock data
    return {
      library: libraryId,
      query: query,
      results: [
        {
          title: 'Example Documentation',
          content: 'This is example documentation from Context7',
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Context7 MCP server running on stdio');
  }
}

const server = new Context7Server();
server.run().catch(console.error);