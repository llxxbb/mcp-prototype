import { helloWorldTool } from './helloWorld.js';
import { describe, it, expect } from 'vitest';

describe('helloWorld', () => {
	describe('callTool', () => {
		it('should return greeting message with valid name', async () => {
			const result = await helloWorldTool({ name: 'Test' });
			expect(result.content[0].text).toBe('Hello, Test!');
			expect(result.isError).toBeUndefined();
		});

		it('should return error with missing name', async () => {
			const result = await helloWorldTool({});
			expect(result.content[0].text).toContain('Invalid arguments');
			expect(result.isError).toBe(true);
		});
	});
});
