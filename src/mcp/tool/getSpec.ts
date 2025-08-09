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
						content: '导航栏层级：与文件系统的目录结构一一对应。'
					},
					{
						specId: 'navigateName',
						content:
							'导航栏原型名称：通过<html>标签的 data-nav-name 属性进行定义，如省略则使用文件名。'
					},
					{
						specId: 'navigateSeq',
						content: '导航栏位置：通过<html>标签的 data-nav-seq 属性进行定义'
					},
					{
						specId: 'baseInject',
						content: 'base注入：MCP-Prototype 会在页面 header 中注入 <base href="/html/"> '
					},
					{
						specId: 'jsInject',
						content:
							'JS注入：MCP-Prototype 回在页面的 header 中注入 mcp-prototype-inject.js 文件，用于展示标记。'
					},
					{
						specId: 'fileEncoding',
						content: '文件编码：原型文件使用 utf-8 编码格式存储'
					},
					{
						specId: 'marker',
						content:
							'标记：可**增强**使用者对UI元素的理解，可选。如元素本身意义已经非常明显，则不建议配置。通过元素的 data-marker 属性进行定义'
					},
					{
						specId: 'pageNote',
						content:
							'页面附加说明：用于表达页面无法表达的内容，如设计理念，拖拽，注意事项等。markdown 格式，文件名格式为：[原型页面文件名].annotation.md'
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
			description: '检索 MCP-Prototype 规范，ai 助手可以参考此规范来创建 html 原型页面',
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
