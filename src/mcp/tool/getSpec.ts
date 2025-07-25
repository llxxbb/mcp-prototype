import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { logger } from '../utils/logger.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export async function getSpecTool(): Promise<CallToolResult> {
	logger.info('Generating specification');
	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify([
					{
						specId: 'navigateLevel',
						content: '导航栏中的层级定义,与原型所在文件系统的目录结构一一对应。'
					},
					{
						specId: 'navigateName',
						content:
							'导航栏中的原型名称定义，来源于原型页面<html>标签的 data-nav-name 数据属性值，如省略则使用文件名。'
					},
					{
						specId: 'navigateSeq',
						content: '导航栏位置定义，来源于原型页面<html>标签的 data-nav-seq 数据属性值'
					},
					{
						specId: 'baseInject',
						content:
							'系统会为每个 HTML 页面注入 <base href="/html/"> 标签，注意"引用"路径的正确性。'
					},
					{
						specId: 'jsInject',
						content: '系统会为每个 HTML 页面注入 mcp-prototype-inject.js 文件，用于展示标记。'
					},
					{
						specId: 'fileEncoding',
						content: '原型文件使用 utf-8 编码格式存储'
					},
					{
						specId: 'marker',
						content:
							'UI 元素增加标记定义，可选, 来源于元素标签的data-marker数据属性值，MCP-Prototype 将自动为元素绘制标记，鼠标悬浮显示标记内容。'
					}
				])
			}
		]
	};
}

export function registerGetSpecTool(server: McpServer) {
	server.registerTool(
		'getSpec',
		{
			title: 'Get Specification',
			description: '检索 MCP-Prototype 使用规范，了解如何在原型里增加**标记**和**页面辅助说明**',
			inputSchema: {}
		},
		async () => {
			const response = await getSpecTool();
			return {
				content: response.content
			};
		}
	);
}
