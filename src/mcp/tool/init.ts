import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { logger } from '../utils/logger.js';
import { response } from '../utils/response.js';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { InitArgsSchema } from './schema-init.js';
import { checkDirectory } from '../utils/directory.js';
import path from 'node:path';
import * as fs from 'node:fs/promises';

// Global configuration object
export let globalConfig: Partial<InitArgs> = {};
export let initialized = false;

export type InitArgs = z.infer<typeof InitArgsSchema>;

export async function initTool(args?: InitArgs): Promise<CallToolResult> {
	if (!args || typeof args !== 'object') {
		logger.warn('Invalid arguments for init tool', args);
		return response.error('Invalid arguments: expected object');
	}

	const parsedArgs = InitArgsSchema.parse(args);

	// prototypeRoot is required
	if (
		globalConfig.prototypeRoot === undefined &&
		(parsedArgs?.prototypeRoot === undefined || parsedArgs?.prototypeRoot === '')
	) {
		let msg = 'Init failed: [prototypeRoot] must be set for first time';
		logger.warn(msg);
		return response.error(msg);
	}
	// Verify prototypeRoot exists and is a directory
	if (parsedArgs.prototypeRoot) {
		try {
			// Handle relative path
			if (!path.isAbsolute(parsedArgs.prototypeRoot)) {
				let msg = 'Init failed: [prototypeRoot] must be an absolute path';
				logger.warn(msg);
				return response.error(msg);
			}

			// Check or create prototypeRoot directory
			const dirResult = await checkDirectory(parsedArgs.prototypeRoot);
			if (dirResult.isErr()) {
				logger.info(`Creating prototype root directory: ${parsedArgs.prototypeRoot}`);
				await fs.mkdir(parsedArgs.prototypeRoot, { recursive: true });
			}

			// Special handling when last path segment is "html"
			const pathSegments = parsedArgs.prototypeRoot.split(path.sep);
			if (pathSegments[pathSegments.length - 1].toLowerCase() === 'html') {
				parsedArgs.prototypeRoot = path.dirname(parsedArgs.prototypeRoot);
				logger.info(`Adjusted prototypeRoot to parent directory: ${parsedArgs.prototypeRoot}`);
			} else {
				return response.error(`Invalid prototypeRoot: end dir must be "html`);
			}
		} catch (error) {
			logger.error(`Failed to process prototypeRoot: ${error}`);
			return response.error(
				`Failed to process prototypeRoot: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	// Update globalConfig with parsed args (partial update)
	globalConfig = { ...globalConfig, ...parsedArgs };
	return response.success('Initialization succeeded');
}

export function registerInitTool(server: McpServer) {
	server.registerTool(
		'init',
		{
			title: 'Initialize Tool',
			description: '告诉 MCP-Prototype 原型根路径、是否展示标记等初始化信息，可以多次调用',
			inputSchema: InitArgsSchema.shape
		},
		async (args: InitArgs) => {
			const rep = await initTool(args);
			return {
				content: rep.content
			};
		}
	);
}

export function resetConfig() {
	globalConfig = {};
	initialized = false;
}
