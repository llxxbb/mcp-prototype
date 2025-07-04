import { promises as fs } from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

interface HtmlFileInfo {
	filePath: string;
	relativePath: string;
	navName: string;
	navSeq: number;
}

export async function filterToEnv(rootDir: string){
    console.log('set env.MCP_PROTOTYPE_HTML_PATH', rootDir);
	process.env.MCP_PROTOTYPE_HTML_PATH = rootDir;
    let dir = path.join(rootDir, 'html');
    let rtn = await filter(dir);
    process.env.MCP_PROTOTYPE_FILES = JSON.stringify(rtn);
}

/**
 * 递归查找HTML文件并过滤符合条件的文件
 * @param rootDir 根目录路径
 * @param baseDir 相对路径基准目录(可选)
 * @returns 符合条件的HTML文件列表，按data-nav-seq 进行同级目录排序
 */
export async function filter(rootDir: string, baseDir: string = rootDir): Promise<HtmlFileInfo[]> {
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
				const subResults = await filter(fullPath, baseDir);
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
				const navName = htmlElement.attr('data-nav-name');
				const navSeq = parseInt(htmlElement.attr('data-nav-seq') || '0', 10);

				if (navName) {
					const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
					results.push({
						filePath: fullPath,
						relativePath,
						navName,
						navSeq
					});
					console.log(`找到符合条件的HTML文件: ${relativePath}`);
				}
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