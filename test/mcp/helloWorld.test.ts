import { callTool } from '../../src/mcp/helloWorld';
import { ToolResponse } from '@modelcontextprotocol/sdk/types';

describe('helloWorld', () => {
  describe('callTool', () => {
    it('should return greeting message with valid name', () => {
      const result = callTool({ name: 'Test' });
      expect(result.content[0].text).toBe('Hello, Test!');
      expect(result.isError).toBeUndefined();
    });

    it('should return error with missing name', () => {
      const result = callTool({});
      expect(result.content[0].text).toContain('Invalid arguments');
      expect(result.isError).toBe(true);
    });

    it('should return error with invalid name type', () => {
      const result = callTool({ name: 123 });
      expect(result.content[0].text).toContain('Invalid arguments');
      expect(result.isError).toBe(true);
    });
  });
});