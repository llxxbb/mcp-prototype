# MCP-Prototype

可以让 AI 基于HTML直接进行原型设计的 MCP 工具，即使没有 figma、axure和 可快速构建软件原型。

工具能力：

- 提供导航栏。

- 将**标记**与原型解耦。

- 支持**页面附加说明**。

## 配置方法

AI MCP 配置增加下面的内容

```json
    "mcp-prototype": {
      "command": "npx",
      "args": [
        "-y",
        "@llxxbb/mcp-prototype"
      ]
    }
```

本地调试

```json
    "mcp-prototype": {
      "command": "npm",
      "args": [
        "--prefix",
        "path/to/mcp-prototype",
        "start:mcp"
      ]
    }
```

## AI 提示词建议

在原型设计前：

> 要求：
> 
> - 请按原型工具规范进行原型设计。
> 
> - 需求：abcd...

使用过程中，如想展示原型，直接输入：

> 展示原型

原型展示会启动一个后台，所以不需要多次输入指令，否则会启动多个实例。

如想关闭，可输入：

> 停止展示

或

> 关闭原型

## 使用规范

- 导航栏：
  
  - 层级定义：与原型所在文件系统的目录结构一一对应。
  
  - 原型名称：来源于原型页面标签的 data-nav-name 数据属性值，如省略则使用文件名。

- 功能注入，MCP-Prototype 会为每个 HTML 页面注入：
  
  - <base href="/html/"> 标签，注意"引用"路径的正确性。
  - mcp-prototype-inject.js 文件，用于展示标记。

- 标记：通过设置 UI 元素的 data-marker 数据属性来增强使用者对UI元素的理解，可选。如相关界面元素的意义已经非常明显，则不建议配置。
  
                        

- 页面的附加说明，用于表达原型页面无法表达的内容，如设计理念，元素拖拽，注意事项等。markdown 格式，文件名格式为[原型页面文件名].annotation.md

具体参考：[src\mcp\tool\getSpec.ts](src\mcp\tool\getSpec.ts) 文件

## 技术栈

- nodejs, SvelteKit, Vite，ts 