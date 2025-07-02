import { EnhancedMcpServer } from './index';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('McpServer', () => {
  let server: EnhancedMcpServer;

  beforeAll(async () => {
    server = new EnhancedMcpServer();
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