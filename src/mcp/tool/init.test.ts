import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { globalConfig, initialized, resetConfig, initTool, InitArgs } from './init.js';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('initTool', () => {
	const prototypeRoot = path.join(process.cwd(), 'tmp/prototype/html');
	const tempDir = path.dirname(prototypeRoot);
	afterEach(async () => {
		// Clean up temp directory
		await fs.rm(tempDir, { recursive: true, force: true });
	});
	beforeEach(async () => {
		// Reset globalConfig before each test
		resetConfig();
	});
	it('should require prototypeRoot', async () => {
		const result = await initTool({} as InitArgs);
		expect(result.content[0].text).toContain('[prototypeRoot] must be set for first time');
	});
	it('should require absolute prototypeRoot', async () => {
		const result = await initTool({ prototypeRoot: 'relative/path/html' } as InitArgs);
		expect(result.content[0].text).toContain('[prototypeRoot] must be an absolute path');
	});
	it('should adjust prototypeRoot when ends with html (absolute path)', async () => {
		const result = await initTool({ prototypeRoot } as InitArgs);
		expect(result.content[0].text).toContain('Initialization succeeded');
		expect(globalConfig.prototypeRoot).toBe(tempDir);
	});
	it("should return error when prototypeRoot doesn't end with html", async () => {
		const result = await initTool({ prototypeRoot: tempDir } as InitArgs);
		expect(result.content[0].text).toContain('Invalid prototypeRoot: end dir must be "html"');
	});
	it('old should be retain', async () => {
		await initTool({ prototypeRoot } as InitArgs);
		await initTool();
		expect(globalConfig.prototypeRoot).toBe(tempDir);
		expect(initialized).toBe(true);
	});
});
