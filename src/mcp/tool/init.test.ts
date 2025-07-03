import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { globalConfig, initialized, resetConfig } from './init.js';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('initTool', () => {
	var currentPath = process.cwd();
	var prototypeRoot = 'tmp/prototype';
	var tempDir = path.join(currentPath, prototypeRoot);
	afterEach(async () => {
		// Clean up temp directory
		await fs.rm(tempDir, { recursive: true, force: true });
	});
	let initTool;
	beforeEach(async () => {
		// Dynamically import the module after mocks are set up
		const initModule = await import('./init.js');
		initTool = initModule.initTool;
		// Reset globalConfig before each test
		resetConfig();
	});
	it('should require projectPath', async () => {
		const result = await initTool({});
		expect(result.content[0].text).toContain(`[projectPath] must be set for first time`);
	});
	it('projectPath path invalid', async () => {
		const result = await initTool({
			projectPath: '/test/path'
		});
		expect(result.content[0].text).toContain(`Invalid project path: /test/path`);
	});
	it('should require prototypeRoot', async () => {
		expect(initialized).toBe(false);
		const result = await initTool({
			projectPath: currentPath
		});
		expect(result.content[0].text).toContain('[prototypeRoot] must be set for first time');
	});

	it('should adjust prototypeRoot when ends with html (absolute path)', async () => {
		const htmlPath = path.join(tempDir, 'html');
		const result = await initTool({
			projectPath: currentPath,
			prototypeRoot: htmlPath
		});
		expect(result.content[0].text).toContain('Initialization succeeded');
		expect(globalConfig.prototypeRoot).toBe(tempDir);
	});

	it('should adjust prototypeRoot when ends with html (relative path)', async () => {
		const htmlPath = path.join(prototypeRoot, 'html');
		const result = await initTool({
			projectPath: currentPath,
			prototypeRoot: htmlPath
		});
		expect(result.content[0].text).toContain('Initialization succeeded');
		expect(globalConfig.prototypeRoot).toBe(tempDir);
	});

	it("should return error when prototypeRoot doesn't end with html", async () => {
		const result = await initTool({
			projectPath: currentPath,
			prototypeRoot: prototypeRoot
		});
		expect(result.content[0].text).toContain('Invalid prototypeRoot: end dir must be "html');
	});

	it('old should be retain', async () => {
		const htmlPath = path.join(prototypeRoot, 'html');
		await initTool({
			projectPath: currentPath,
			prototypeRoot: htmlPath
		});
		await initTool();
		expect(globalConfig.projectPath).toBe(currentPath);
		expect(globalConfig.prototypeRoot).toBe(tempDir);
		expect(initialized).toBe(true);
	});
});
//# sourceMappingURL=init.test.js.map
