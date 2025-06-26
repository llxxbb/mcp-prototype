# MCP-Prototype

基于Model Context Protocol(MCP)协议开发的AI辅助工具，旨在帮助开发者快速构建软件原型。

当前的 AI 可以生成原型，但不够专业，如：

- 无法区分**原型导航**与功能导航。

- **标记**与原型耦合，不利于代码生成阶段的剥离。

- 不能附加**页面的整体说明**。

通过此工具，AI 可以专注于生成干净的原型，原型导航、标注展示和额外说明等支撑能力由 MCP-Prototype 来承载。

## 使用方法

本地调试

```json
    "mcp-prototype": {
      "command": "npm",
      "args": [
        "--prefix",
        "path/to/mcp-prototype",
        "start"
      ]
    }
```

## 其他文档

v0.1.0

[需求](doc/iterate/v0.1.0/index.md)

接口
