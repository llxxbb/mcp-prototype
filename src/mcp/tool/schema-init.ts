import { z } from 'zod';

export const InitArgsSchema = z.object({
	prototypeRoot: z
		.string()
		.optional()
		.describe(
			'原型文件所在目录，要求最后一节目录必须是“html”，html 将作为 mcp-prototype web 服务的资源前缀。'
		),
	port: z
		.number()
		.optional()
		.default(3000)
		.describe('MCP-Prototype 用于提供原型浏览的 web 服务端口号')
});
