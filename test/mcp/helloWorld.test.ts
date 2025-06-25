import { callTool } from '../../src/mcp/helloWorld';
import { ToolResponse } from '../../src/mcp/types';

describe('helloWorld', () => {
  describe('callTool', () => {
    it('should return greeting message with valid name', async () => {
      const result = await callTool({ name: 'Test' });
      expect(result.content[0].text).toBe('Hello, Test!');
      expect(result.isError).toBeUndefined();
    });

    it('should return error with missing name', async () => {
      const result = await callTool({});
      expect(result.content[0].text).toContain('Invalid arguments');
      expect(result.isError).toBe(true);
    });

    it('should return error with invalid name type', async () => {
      const result = await callTool({ name: 123 });
      expect(result.content[0].text).toContain('Invalid arguments');
      expect(result.isError).toBe(true);
    });
  });
});