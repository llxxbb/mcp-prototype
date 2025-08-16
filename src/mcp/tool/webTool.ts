import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { logger } from '../utils/logger.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { globalConfig, initialized } from './init.js';
import { response } from '../utils/response.js';
import { createServer } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { initHtmlFiles } from '../main/html.js';
import { fileURLToPath } from 'url';
import path from 'path';

export let serverInstance: Promise<any> | null = null;

export async function startTool(): Promise<CallToolResult> {
	// 检查是否已初始化
	if (!initialized) {
		return response.error('服务未初始化，请先调用 init 工具');
	}

	logger.info('正在启动Vite服务...');

	// 检查prototypeRoot是否定义
	if (!globalConfig.prototypeRoot) {
		return response.error('prototypeRoot未配置，请先调用init工具设置原型根目录');
	}

	try {
		initHtmlFiles(globalConfig.prototypeRoot);

		// 获取包根目录
		const currentFilePath = fileURLToPath(import.meta.url);
		const packageRoot = path.join(currentFilePath, '..', '..', '..', '..');
		console.log('packageRoot:', packageRoot);

		// 保存当前工作目录
		const originalCwd = process.cwd();
		
		try {
			// 切换到包根目录
			process.chdir(packageRoot);
			console.log('切换到工作目录:', process.cwd());

			// 创建Vite服务器
			serverInstance = createServer({
				root: packageRoot,
				plugins: [sveltekit()] as any, // SvelteKit 会自动查找 svelte.config.js
				server: {
					port: globalConfig.port,
					open: true
				}
			});
		} finally {
			// 恢复原始工作目录
			process.chdir(originalCwd);
			console.log('恢复工作目录:', process.cwd());
		}

		const viteServer = await serverInstance;
		// 启动服务
		await viteServer.listen();
		const address = `http://localhost:${globalConfig.port}`;
		logger.info(`服务启动成功，地址: ${address}`);

		return response.success(address);
	} catch (error) {
		logger.error('服务启动失败:', error);
		if (serverInstance) {
			try {
				const viteServer = await serverInstance;
				await viteServer.close();
			} catch (closeError) {
				logger.error('服务关闭失败:', closeError);
			}
			serverInstance = null;
		}
		return response.error(error instanceof Error ? error.message : String(error));
	}
}

export async function stopTool(): Promise<CallToolResult> {
	try {
		if (serverInstance) {
			logger.info('正在停止服务...');
			const viteServer = await serverInstance;
			await viteServer.close();
			serverInstance = null;
			logger.info('服务已停止');
		}

		return response.success('服务已停止');
	} catch (error) {
		logger.error('服务停止失败:', error);
		return response.error(error instanceof Error ? error.message : String(error));
	}
}

export function registerWebTools(server: McpServer) {
	// 注册启动工具
	server.registerTool(
		'start',
		{
			title: 'Start Service',
			description: `
该工具将启动web服务并展示模型，启动后会后台运行，所以避免重复调用！

调用成功后，请在浏览器里输入本地地址和 init 中指定的端口号进行查看。

在调用此工具前，下面的事情需要就位，否则此工具可能无法正常工作：

- 遵循 getSpec 工具中的指示并进行了原型创造。
- 已经调用 init 工具进行了初始化。
`,
			inputSchema: {}
		},
		async () => {
			try {
				const response = await startTool();
				return response;
			} catch (error) {
				logger.error('启动工具出错:', error);
				return response.error(
					`服务启动失败: ${error instanceof Error ? error.message : String(error)}`
				);
			}
		}
	);

	// 注册停止工具
	server.registerTool(
		'stop',
		{
			title: 'Stop Service',
			description: '停止展示原型，并关闭web服务器',
			inputSchema: {}
		},
		async () => {
			try {
				const response = await stopTool();
				return {
					content: response.content
				};
			} catch (error) {
				logger.error('停止工具出错:', error);
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(
								{
									isOk: false,
									message: `服务停止失败: ${error instanceof Error ? error.message : String(error)}`
								},
								null,
								2
							)
						}
					],
					isError: true
				};
			}
		}
	);
}
