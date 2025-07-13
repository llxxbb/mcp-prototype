import { startTool } from './webTool.js';
import { initTool, InitArgs } from './init.js';
import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';

describe('web.ts', () => {
	const testPort = 3001;
	const prototypeRoot = path.join(process.cwd(), 'test-prototype/html');

	beforeAll(async () => {
		// 初始化配置
		await initTool({
			prototypeRoot,
			port: testPort
		} as InitArgs);
	});

	describe('web can start', () => {
		it('should start server successfully', async () => {
			const result = await startTool();
			expect(result.isError).toBe(false);
			const url = 'http://localhost:3001';
			expect(result.content[0].text).toContain(url);

			// 实际访问URL验证内容
			const fetch = (await import('node-fetch')).default;
			const response = await fetch(url);
			const html = await response.text();
			expect(html).toContain('mcp-prototype');
		});
	});
});
