const { McpServer } = require('../src/mcpServer');
const { jest } = require('@jest/globals');

describe('McpServer', () => {
  let server: McpServer;

  beforeAll(() => {
    server = new McpServer();
  });

  afterAll(async () => {
    await server.server.close();
  });

  it('should initialize successfully', () => {
    expect(server).toBeInstanceOf(McpServer);
    expect(server.server).toBeDefined();
  });

  it('should list available tools', async () => {
    const tools = await server.server.listTools();
    expect(tools.tools).toContainEqual({
      name: 'example_tool',
      description: 'Example tool for SSE MCP server'
    });
  });

  it('should execute example tool', async () => {
    const result = await server.server.callTool({
      name: 'example_tool',
      arguments: {}
    });
    expect(result.content[0].text).toContain('Example tool executed successfully');
  });
});