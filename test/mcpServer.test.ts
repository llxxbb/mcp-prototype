import { McpServer } from '../src/index';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('McpServer', () => {
  let server: McpServer;
  let transport: StdioServerTransport;

  beforeAll(async () => {
    server = new McpServer();
    transport = new StdioServerTransport();
    await server.run();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should register hello_world tool', async () => {
    const response = await server.callTool('hello_world', { name: 'test' });
    expect(response.content).toBeDefined();
    if (Array.isArray(response.content) && response.content[0]?.text !== undefined) {
        expect(response.content[0].text).toBe('Hello, test!');
    }
  });

  it('should handle unknown tool', async () => {
    await expect(server.callTool('unknown', {}))
      .rejects
      .toThrow('Unknown tool');
  });
});