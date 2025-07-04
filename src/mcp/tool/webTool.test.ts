import { startTool, stopTool } from './webTool.js';
import { initTool, InitArgs } from './init.js';
import { join } from 'path';
import { writeFileSync, rmSync } from 'fs';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('web.ts', () => {
	const testPort = 3001;
	const projectPath = process.cwd();
	const prototypeRoot = './test-prototype';
	const testRoot = join(projectPath, prototypeRoot);

	beforeAll(async () => {
		// 初始化配置
		await initTool({
			projectPath: projectPath,
			prototypeRoot,
			port: testPort
		} as InitArgs);

		// 创建测试静态文件目录
		writeFileSync(join(testRoot, 'index.html'), '<h1>Test</h1>');
	});

	afterAll(async () => {
		// 清理测试目录
		try {
			await stopTool();
			rmSync(testRoot, { recursive: true, force: true });
		} catch (e) {
			console.error('Cleanup error:', e);
		}
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
