import { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { logger } from '../utils/logger';

export async function callTool(args?: Record<string, any>): Promise<CallToolResult> {
  if (!args || !args.name || typeof args.name !== 'string') {
    logger.warn('Invalid arguments for hello_world tool', args);
    return {
      content: [{
        type: 'text',
        text: 'Invalid arguments: name must be a string'
      }],
      isError: true
    };
  }

  logger.info(`Generating greeting for ${args.name}`);
  return {
    content: [{
      type: 'text',
      text: `Hello, ${args.name}!`
    }]
  };
}