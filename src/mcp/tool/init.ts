import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { logger } from '../utils/logger.js';
import { response } from '../utils/response.js';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { InitArgsSchema } from './schema-init.js';
import { checkDirectory } from '../utils/directory.js';
import path from 'node:path';
import * as fs from 'node:fs/promises';
import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';

// Global configuration object
export let globalConfig: Partial<InitArgs> = {};
export let initialized = false;

// 动态安装依赖到包本地目录
async function ensureLocalDependencies(packageRoot: string): Promise<void> {
	const localNodeModules = path.join(packageRoot, 'node_modules');
	const markerFile = path.join(packageRoot, '.runtime-deps-installed');

	// 检查是否已经安装了本地依赖
	try {
		await fs.access(markerFile);
		logger.info('✅ 本地依赖已存在，跳过安装');
		logger.info('标记文件路径:', markerFile);
		return;
	} catch (error) {
		// 依赖不存在，需要安装
		logger.info('❌ 本地依赖不存在，开始安装...');
		logger.info('标记文件路径:', markerFile);
		logger.info('标记文件不存在原因:', error instanceof Error ? error.message : String(error));
	}

	// 创建本地 node_modules 目录
	logger.info('创建本地 node_modules 目录:', localNodeModules);
	await fs.mkdir(localNodeModules, { recursive: true });
	logger.info('✅ 本地 node_modules 目录创建成功');

	// 从 package.json 读取运行时依赖版本
	const packageJsonPath = path.join(packageRoot, 'package.json');
	logger.info('读取 package.json 文件:', packageJsonPath);
	
	let packageJson;
	try {
		const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
		packageJson = JSON.parse(packageJsonContent);
		logger.info('✅ package.json 读取成功');
		logger.info('包名:', packageJson.name);
		logger.info('版本:', packageJson.version);
	} catch (error) {
		logger.error('❌ 无法读取 package.json:', error instanceof Error ? error.message : String(error));
		throw new Error('无法读取 package.json');
	}

	// 构建依赖列表
	const dependencies = Object.entries(packageJson.optionalDependencies || {})
		.map(([name, version]) => `${name}@${version}`)
		.filter(
			(dep) => dep.startsWith('svelte') || dep.startsWith('@sveltejs') || dep.startsWith('vite')
		);

	// 批量安装依赖
	logger.info('批量安装运行时依赖...');
	logger.info('依赖列表: ' + dependencies.join(', '));
	
	await new Promise<void>((resolve, reject) => {
		logger.info('开始执行 npm install 命令...');
		logger.info('工作目录:', packageRoot);
		logger.info('命令: npm install ' + dependencies.join(' ') + ' --no-save');
		
		// 使用 spawn 启动 npm install，捕获输出
		const child = spawn('npm', ['install', ...dependencies, '--no-save'], {
			stdio: ['pipe', 'pipe', 'pipe'], // 捕获所有输出
			shell: true, // Windows 上需要 shell 来找到 npm
			cwd: packageRoot
		});

		let stdout = '';
		let stderr = '';

		// 监听标准输出
		child.stdout.on('data', (data) => {
			const text = data.toString();
			stdout += text;
			logger.info('npm install stdout:', text.trim());
		});

		// 监听标准错误
		child.stderr.on('data', (data) => {
			const text = data.toString();
			stderr += text;
			logger.warn('npm install stderr:', text.trim());
		});

		// 监听进程结束
		child.on('close', (code) => {
			logger.info(`npm install 进程退出，退出码: ${code}`);
			logger.info('完整 stdout:', stdout);
			if (stderr) {
				logger.warn('完整 stderr:', stderr);
			}
			
			if (code === 0) {
				logger.info('✅ 运行时依赖安装成功');
				// 创建标记文件
				fs.writeFile(markerFile, new Date().toISOString()).catch(() => {});
				resolve();
			} else {
				reject(new Error(`安装运行时依赖失败，退出码: ${code}`));
			}
		});

		child.on('error', (error) => {
			logger.error('npm install 进程错误:', error);
			reject(new Error(`npm install 进程错误: ${error.message}`));
		});

		// 每秒检测一次进程状态
		const checkInterval = setInterval(() => {
			// 检查进程是否还在运行
			if (child.killed) {
				clearInterval(checkInterval);
				return;
			}

			// 检查是否已经安装了依赖
			try {
				const sveltePath = path.join(localNodeModules, 'svelte');
				fs.access(sveltePath).then(() => {
					logger.info('检测到依赖已安装，等待进程完成...');
				}).catch(() => {
					// 依赖还未安装
				});
			} catch {
				// 忽略检查错误
			}
		}, 1000);

		// 清理定时器
		child.on('close', () => {
			clearInterval(checkInterval);
		});
	});
}

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
		const msg = 'Init failed: [prototypeRoot] must be set for first time';
		logger.warn(msg);
		return response.error(msg);
	}
	// Verify prototypeRoot exists and is a directory
	if (parsedArgs.prototypeRoot) {
		try {
			// Handle relative path
			if (!path.isAbsolute(parsedArgs.prototypeRoot)) {
				const msg = 'Init failed: [prototypeRoot] must be an absolute path';
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
				return response.error(`Invalid prototypeRoot: end dir must be "html"`);
			}

			// 安装运行时依赖
			try {
				// 尝试多种方法找到包根目录
				let packageRoot: string | null = null;
				
				// 方法1: 从当前工作目录开始查找
				let searchDir = process.cwd();
				const maxDepth = 10; // 增加查找深度
				
				logger.info('开始方法1查找包根目录...');
				logger.info('当前工作目录:', searchDir);
				
				for (let i = 0; i < maxDepth; i++) {
					logger.info(`方法1第 ${i + 1} 次查找，当前路径:`, searchDir);
					
					try {
						const packageJsonPath = path.join(searchDir, 'package.json');
						await fs.access(packageJsonPath);
						const content = await fs.readFile(packageJsonPath, 'utf-8');
						const pkg = JSON.parse(content);
						logger.info('找到 package.json，包名:', pkg.name);
						
						if (pkg.name === '@llxxbb/mcp-prototype') {
							packageRoot = searchDir;
							logger.info('✅ 方法1找到包根目录:', packageRoot);
							break;
						}
					} catch (error) {
						logger.info('当前路径没有 package.json 或读取失败:', error instanceof Error ? error.message : String(error));
					}
					
					const parentDir = path.dirname(searchDir);
					if (parentDir === searchDir) {
						logger.info('方法1已到达根目录，停止查找');
						break; // 到达根目录
					}
					searchDir = parentDir;
				}
				
				// 方法2: 如果方法1失败，从当前文件位置查找
				if (!packageRoot) {
					logger.info('方法1未找到包根目录，开始方法2...');
					const currentFilePath = fileURLToPath(import.meta.url);
					const currentDir = path.dirname(currentFilePath);
					searchDir = currentDir;
					
					logger.info('当前文件路径:', currentFilePath);
					logger.info('当前文件目录:', currentDir);
					
					for (let i = 0; i < maxDepth; i++) {
						logger.info(`方法2第 ${i + 1} 次查找，当前路径:`, searchDir);
						
						try {
							const packageJsonPath = path.join(searchDir, 'package.json');
							await fs.access(packageJsonPath);
							const content = await fs.readFile(packageJsonPath, 'utf-8');
							const pkg = JSON.parse(content);
							logger.info('找到 package.json，包名:', pkg.name);
							
							if (pkg.name === '@llxxbb/mcp-prototype') {
								packageRoot = searchDir;
								logger.info('✅ 方法2找到包根目录:', packageRoot);
								break;
							}
						} catch (error) {
							logger.info('当前路径没有 package.json 或读取失败:', error instanceof Error ? error.message : String(error));
						}
						
						const parentDir = path.dirname(searchDir);
						if (parentDir === searchDir) {
							logger.info('方法2已到达根目录，停止查找');
							break; // 到达根目录
						}
						searchDir = parentDir;
					}
				}
				
				// 如果还是找不到，抛出错误
				if (!packageRoot) {
					throw new Error('无法找到包根目录，请确保在正确的项目目录中运行');
				}

				// 验证找到的包根目录是否正确
				const packageJsonPath = path.join(packageRoot, 'package.json');
				try {
					await fs.access(packageJsonPath);
					const content = await fs.readFile(packageJsonPath, 'utf-8');
					const pkg = JSON.parse(content);
					if (pkg.name !== '@llxxbb/mcp-prototype') {
						throw new Error('包根目录验证失败');
					}
				} catch {
					throw new Error('无法验证包根目录');
				}

				logger.info('开始安装运行时依赖... , packageRoot:', packageRoot);
				await ensureLocalDependencies(packageRoot);
				logger.info('运行时依赖安装完成');
			} catch (error) {
				logger.error('运行时依赖安装失败:', error);
				return response.error(`运行时依赖安装失败: ${error instanceof Error ? error.message : String(error)}`);
			}

			initialized = true;
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
			description: '提供原型根路径和展示服务的端口号，可以多次调用。注意此过程需检测并安装运行 web 服务所需的包，可能时间较长',
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
