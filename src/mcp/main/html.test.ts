import { describe, it, expect, vi } from 'vitest';
import { filter, injectJs } from './html.js';
import { promises as fs } from 'fs';
import path from 'path';

// 创建临时测试目录结构
async function setupTestDir() {
	const testDir = path.join(__dirname, 'tmp-test-dir');
	await fs.mkdir(testDir, { recursive: true });

	// 创建测试HTML文件
	const files = [
		{
			path: 'dir1/file1.html',
			content: `<html data-nav-name="File1" data-nav-seq="2"></html>`
		},
		{
			path: 'dir1/file2.html',
			content: `<html data-nav-name="File2" data-nav-seq="1"></html>`
		},
		{
			path: 'dir2/file3.html',
			content: `<html data-nav-name="File3" data-nav-seq="3"></html>`
		},
		{
			path: 'dir2/file4.html',
			content: `<html></html>` // 没有data-nav-name
		},
		{
			path: 'not-html.txt',
			content: `Not an HTML file`
		}
	];

	for (const file of files) {
		const filePath = path.join(testDir, file.path);
		await fs.mkdir(path.dirname(filePath), { recursive: true });
		await fs.writeFile(filePath, file.content);
	}

	return testDir;
}

describe('html filter function', () => {
	it('should filter and sort HTML files correctly', async () => {
		const testDir = await setupTestDir();

		try {
			const results = await filter(testDir);

			// 验证返回结果数量
			expect(results).toHaveLength(3);

			// 验证同级目录排序
			const dir1Files = results.filter((f) => f.relativePath.includes('dir1'));
			expect(dir1Files).toHaveLength(2);
			expect(dir1Files[0].navName).toBe('File2');
			expect(dir1Files[1].navName).toBe('File1');

			// 验证文件属性
			results.forEach((file) => {
				expect(file.navName).toBeDefined();
				expect(file.navSeq).toBeDefined();
				// 验证路径分隔符已替换为URL格式
				expect(file.relativePath).not.toContain('\\');
				expect(file.relativePath).toContain('/');
			});
		} finally {
			// 清理测试目录
			await fs.rm(testDir, { recursive: true, force: true });
		}
	});

	it('should handle non-existent directory', async () => {
		const consoleSpy = vi.spyOn(console, 'error');
		await expect(filter('/nonexistent/dir')).rejects.toThrow();
		expect(consoleSpy).toHaveBeenCalled();
	});
});

describe('injectJs function', () => {
	it('should inject JS file correctly', async () => {
		const testDir = await setupTestDir();
		process.env.MCP_PROTOTYPE_HTML_PATH = testDir;
		const jsPath = '/path/to/script.js';

		try {
			const files = await filter(testDir);
			const consoleSpy = vi.spyOn(console, 'log');

			await injectJs(files, jsPath);

			// 验证日志输出
			expect(consoleSpy).toHaveBeenCalledWith(`开始注入JS文件: ${jsPath}`);
			expect(consoleSpy).toHaveBeenCalledWith('JS文件注入完成');

			// 验证文件内容
			for (const file of files) {
				const fullPath = path.join(testDir, file.relativePath.replace('html/', ''));
				const content = await fs.readFile(fullPath, 'utf-8');
				expect(content).toContain(`<script src="${jsPath}"></script>`);
			}
		} finally {
			await fs.rm(testDir, { recursive: true, force: true });
		}
	});

	it('should handle HTML without head element', async () => {
		const testDir = await setupTestDir();
		process.env.MCP_PROTOTYPE_HTML_PATH = testDir;
		const jsPath = '/path/to/script.js';

		// 创建一个没有head元素的HTML文件
		const noHeadFile = path.join(testDir, 'no-head.html');
		await fs.writeFile(noHeadFile, '<html><body></body></html>');

		try {
			const files = [{ relativePath: 'no-head.html', navName: 'NoHead', navSeq: 1 }];
			const consoleSpy = vi.spyOn(console, 'log');

			await injectJs(files, jsPath);

			// 验证日志调用顺序
			expect(consoleSpy.mock.calls[0][0]).toBe('开始注入JS文件: /path/to/script.js');
			expect(consoleSpy.mock.calls[1][0]).toBe(
				'文件 no-head.html 添加了JS引用: /path/to/script.js'
			);
			expect(consoleSpy.mock.calls[2][0]).toBe('JS文件注入完成');

			// 验证文件内容
			const content = await fs.readFile(noHeadFile, 'utf-8');
			expect(content).toContain('<head>');
			expect(content).toContain(`<script src="${jsPath}"></script>`);
		} finally {
			await fs.rm(testDir, { recursive: true, force: true });
		}
	});

	it('should skip already injected JS file', async () => {
		const testDir = await setupTestDir();
		process.env.MCP_PROTOTYPE_HTML_PATH = testDir;
		const jsPath = '/path/to/script.js';

		// 创建一个已包含JS引用的HTML文件
		const existingFile = path.join(testDir, 'existing.html');
		await fs.writeFile(
			existingFile,
			'<html><head><script src="/path/to/script.js"></script></head></html>'
		);

		try {
			const files = [{ relativePath: 'existing.html', navName: 'Existing', navSeq: 1 }];
			const consoleSpy = vi.spyOn(console, 'log');

			await injectJs(files, jsPath);

			// 验证跳过了已存在的引用
			expect(consoleSpy).toHaveBeenCalledWith(
				'文件 existing.html 已包含JS引用: /path/to/script.js'
			);

			// 验证文件内容没有重复注入
			const content = await fs.readFile(existingFile, 'utf-8');
			const matches = content.match(new RegExp(`<script src="${jsPath}"></script>`, 'g'));
			expect(matches).toHaveLength(1);
		} finally {
			await fs.rm(testDir, { recursive: true, force: true });
		}
	});

	it('should handle file errors', async () => {
		const testDir = await setupTestDir();
		process.env.MCP_PROTOTYPE_HTML_PATH = testDir;
		const jsPath = '/path/to/script.js';
		const invalidFile = 'nonexistent.html';

		try {
			const files = [{ relativePath: invalidFile, navName: 'Invalid', navSeq: 1 }];
			const consoleSpy = vi.spyOn(console, 'error');

			await expect(injectJs(files, jsPath)).rejects.toThrow();
			expect(consoleSpy).toHaveBeenCalled();
		} finally {
			await fs.rm(testDir, { recursive: true, force: true });
		}
	});
});
