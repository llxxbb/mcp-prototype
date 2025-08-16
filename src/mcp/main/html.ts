import { promises as fs } from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

interface HtmlFileInfo {
	relativePath: string;
	navName: string;
	navSeq: number;
}

export async function initHtmlFiles(rootDir: string) {
	console.log('set env.MCP_PROTOTYPE_HTML_PATH', rootDir);
	process.env.MCP_PROTOTYPE_HTML_PATH = rootDir;
	const prefix = 'html';
	const dir = path.join(rootDir, prefix);
	const rtn = await filter(dir, prefix);
	const jsFile = 'mcp-prototype-inject.js';
	await injectHeader(rtn, `js/${jsFile}`, prefix);
	process.env.MCP_PROTOTYPE_FILES = JSON.stringify(rtn);
	console.log('set env.MCP_PROTOTYPE_FILES', rtn);
	// 复制 mcp-prototype-inject.js 到 dir 目录下
	const sourceFile = await findLibFile(jsFile);
	await copyFile(sourceFile, path.join(dir, 'js', jsFile));
}

/**
 * 查找库文件
 * 在多个可能的路径中搜索指定的文件
 * @param fileName 要查找的文件名
 * @returns 找到的文件的完整路径
 * @throws 如果找不到文件则抛出错误
 */
async function findLibFile(fileName: string): Promise<string> {
	// 获取当前模块的目录路径
	const currentFilePath = fileURLToPath(import.meta.url);
	const mcpPath = path.join(currentFilePath, '..', '..', '..', '..');
	process.env.MCP_PROTOTYPE_PATH = mcpPath;
	const sourcePath = path.join(mcpPath, 'src', 'lib', fileName);

	try {
		await fs.access(sourcePath);
		console.log(`找到 ${fileName} 文件: ${sourcePath}`);
		return sourcePath;
	} catch {
	}
	throw new Error(`无法找到 ${fileName} 文件`);
}

/**
 * 复制文件
 * 要求：
 * - 目标目标如不存在则创建。
 * - 目标文件如果已经存在则覆盖。
 * @param from 源文件路径
 * @param to 目标文件路径
 */
export async function copyFile(from: string, to: string) {
	// 创建目标目录（如不存在）
	await fs.mkdir(path.dirname(to), { recursive: true });

	// 复制文件（覆盖已存在的文件）
	await fs.copyFile(from, to);
	console.log(`文件复制成功: ${from} -> ${to}`);
}

/**
 * 递归查找HTML文件并过滤符合条件的文件
 * @param rootDir 根目录路径
 * @param baseDir 相对路径基准目录(可选)
 * @param prefix 相对路径前缀(可选)
 * @returns 符合条件的HTML文件列表，按data-nav-seq 进行同级目录排序
 */
export async function filter(
	rootDir: string,
	prefix: string = '',
	baseDir: string = rootDir
): Promise<HtmlFileInfo[]> {
	const results: HtmlFileInfo[] = [];
	const sortedResults: HtmlFileInfo[] = [];

	try {
		console.log(`开始扫描目录: ${rootDir}`);
		const files = await fs.readdir(rootDir);

		for (const file of files) {
			const fullPath = path.join(rootDir, file);
			const stat = await fs.stat(fullPath);

			if (stat.isDirectory()) {
				// 递归处理子目录
				const subResults = await filter(fullPath, prefix, baseDir);
				results.push(...subResults);
				continue;
			}

			if (!file.endsWith('.html')) {
				continue;
			}

			try {
				const content = await fs.readFile(fullPath, 'utf-8');
				const $ = cheerio.load(content);
				const htmlElement = $('html');
				let navName = htmlElement.attr('data-nav-name');
				if (!navName) {
					const filename = path.basename(fullPath, path.extname(fullPath));
					navName = filename;
				}
				const navSeq = parseInt(htmlElement.attr('data-nav-seq') || '0', 10);

				const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
				const finalPath = prefix ? `${prefix}/${relativePath}` : relativePath;
				results.push({
					relativePath: finalPath,
					navName,
					navSeq
				});
				console.log(`找到符合条件的HTML文件: ${finalPath}`);
			} catch (error) {
				console.error(`处理文件 ${fullPath} 时出错:`, error);
			}
		}

		// 按目录分组后分别排序
		const dirMap = new Map<string, HtmlFileInfo[]>();

		// 按目录分组
		for (const file of results) {
			const dir = path.dirname(file.relativePath);
			if (!dirMap.has(dir)) {
				dirMap.set(dir, []);
			}
			dirMap.get(dir)?.push(file);
		}

		// 对每个目录的文件按data-nav-seq排序
		for (const [, files] of dirMap) {
			files.sort((a, b) => a.navSeq - b.navSeq);
			sortedResults.push(...files);
		}
	} catch (error) {
		console.error(`处理目录 ${rootDir} 时出错:`, error);
		throw error;
	}

	return sortedResults;
}

/**
 * 注入 Header
 *
 * 具体方法为：
 * - 如没有 header 则创建 header 并插入对入 JS 文件的引用 和 <base href="/html/">
 * - 如有 header 则检测是否已经引用了 js 文件，如没有则插入对入 JS 文件的引用和 <base href="/html/">
 *
 * @param files HTML文件信息数组
 * @param jsPath 要注入的JS文件路径
 */
export async function injectHeader(files: HtmlFileInfo[], jsPath: string, baseDir: string) {
	try {
		console.log(`开始注入Header: ${jsPath}`);

		for (const file of files) {
			try {
				const fullPath = path.join(process.env.MCP_PROTOTYPE_HTML_PATH || '', file.relativePath);
				const content = await fs.readFile(fullPath, 'utf-8');
				const $ = cheerio.load(content);

				// 检查是否已经引用了该JS文件
				const existingScript = $(`script[src="${jsPath}"]`);
				if (existingScript.length > 0) {
					console.log(`文件 ${file.relativePath} 已处理过`);
					continue;
				}

				// 检查是否有head元素
				if ($('head').length === 0) {
					$('html').prepend('<head></head>');
					console.log(`文件 ${file.relativePath} 创建了head元素`);
				}

				// 添加base标签
				$('head').append(`<base href="/${baseDir}/">`);
				console.log(`文件 ${file.relativePath} 添加了JS引用: ${jsPath}`);
				// 添加JS引用
				$('head').append(`<script src="${jsPath}" defer></script>`);
				console.log(`文件 ${file.relativePath} 添加了JS引用: ${jsPath}`);

				// 写入修改后的内容
				await fs.writeFile(fullPath, $.html());
			} catch (error) {
				const errMsg = `处理文件 ${file.relativePath} 时出错: ${error instanceof Error ? error.message : String(error)}`;
				console.error(errMsg);
				throw new Error(errMsg);
			}
		}

		console.log('Header注入完成');
	} catch (error) {
		const errMsg = `注入Header时发生错误: ${error instanceof Error ? error.message : String(error)}`;
		console.error(errMsg);
		throw new Error(errMsg);
	}
}
