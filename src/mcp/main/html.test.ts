import { describe, it, expect, vi } from 'vitest';
import { filter } from './html.js';
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
			const dir1Files = results.filter((f) => f.relativePath.startsWith('dir1'));
			expect(dir1Files[0].navName).toBe('File2');
			expect(dir1Files[1].navName).toBe('File1');

			// 验证文件属性
			results.forEach((file) => {
				expect(file.navName).toBeDefined();
				expect(file.navSeq).toBeDefined();
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
