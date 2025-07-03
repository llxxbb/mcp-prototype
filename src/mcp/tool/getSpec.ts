import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { logger } from '../utils/logger.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export async function getSpecTool(): Promise<CallToolResult> {
	logger.info('Generating specification');
	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(
					[
						{
							specId: 'navigateLevel',
							content: '导航栏中的层级定义,与原型所在文件系统的目录结构一一对应。'
						},
						{
							specId: 'navigateName',
							content: '导航栏中的原型名称定义，来源于原型页面<html>标签的 data-nav-name 数据属性值'
						},
						{
							specId: 'navigateSeq',
							content: '导航栏位置定义，来源于原型页面<html>标签的 data-nav-seq 数据属性值'
						},
						{
							specId: 'pageNote',
							content:
								"原型页面辅助说明定义，可选。文件名与原型页面文件一致，扩展名为'.annotation.md'"
						},
						{
							specId: 'marker',
							content:
								'UI 元素增加标记定义，可选, 来源于元素标签的data-marker数据属性值，MCP-Prototype 将自动为元素绘制标记，鼠标悬浮显示标记内容。'
						}
					],
					null,
					2
				)
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
