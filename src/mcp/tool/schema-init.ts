import { z } from 'zod';

export const InitArgsSchema = z.object({
	prototypeRoot: z
		.string()
		.optional()
		.describe('mcp-prototype 工具用于展示的原型文件路径，为了与 mcp-prototype 自身的服务路径进行区别，只对其下的 html 子目录提供服务。'),
	port: z
		.number()
		.optional()
		.default(3000)
		.describe('MCP-Prototype 用于提供原型浏览的 web 服务端口号'),
});
