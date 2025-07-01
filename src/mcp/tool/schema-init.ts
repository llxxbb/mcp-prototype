import { z } from "zod";

export const InitArgsSchema = z.object({
  projectPath: z
    .string()
    .optional()
    .describe("当前项目的路径, 第一次调用时必须指定"),
  prototypeRoot: z
    .string()
    .optional()
    .default("")
    .describe("原型所在的路径（可选），是 projectPath 的相对路径"),
  logDisable: z
    .boolean()
    .optional()
    .default(false)
    .describe("是否禁用日志输出"),
  logFile: z
    .string()
    .optional()
    .default("mcp-prototype.log")
    .describe("日志文件路径，为空使用缺省值"),
  port: z
    .number()
    .optional()
    .default(3000)
    .describe("MCP-Prototype 用于提供原型浏览的 web 服务端口号"),
  marker: z
    .object({
      position: z
        .number()
        .optional()
        .default(0)
        .describe(
          "标记位置：0(左上),1(中上),2(右上),3(左下),4(中下),5(右下),6(左),7(右)",
        ),
      disable: z
        .boolean()
        .optional()
        .default(false)
        .describe("是否禁用所有标记"),
    })
    .optional()
    .default({})
    .describe("标记相关设置"),
});
