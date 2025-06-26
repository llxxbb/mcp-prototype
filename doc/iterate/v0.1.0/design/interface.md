# 工具提供的接口

## 规范查询接口

**工具名**: getSpec

**说明**: 检索 MCP-Prototype 使用规范，了解如何在原型里增加**标记**和**页面辅助说明**。

**入参**: 无

**出参**：

```json
[
    {
        "specId":"navigateLevel",
        "content": "导航栏中的层级定义,与原型所在文件系统的目录结构一一对应。"
    },
    {
        "specId":"navigateName",
        "content": "导航栏中的原型名称定义，来源于原型页面<html>标签的 **data-nav-name**数据属性值"
    },
    {
        "specId":"navigateSeq",
        "content": "导航栏位置定义，来源于原型页面<html>标签的 **data-nav-seq**数据属性值"
    },
    {
        "specId":"pageNote",
        "content": "原型页面辅助说明定义，可选。文件名与原型页面文件一致，扩展名为'.annotation.md'"
    },
    {
        "specId":"marker",
        "content": "UI 元素增加标记定义，可选, 来源于元素标签的**data-marker**数据属性值，MCP-Prototype 将自动为元素绘制标记，鼠标悬浮显示标记内容。"
    }
]
```

## 初始化

**工具名**: init

**说明**: 告诉 MCP-Prototype 原型根路径、是否展示标记等初始化信息，可以多次调用。

**入参**: 字符串类型，值为 MCP-Prototype 配置文件的绝对路径。

```json
{
    "projectPath": "当前项目的路径",
    "configFile": "原型配置文件名，是 projectPath 的相对路径，缺省值为：prototypemcp.config.json"
}
```

**出参**：

```json
// 成功响应：
{
    "isOk": true,
    "message": "",
}
// 错误示例
{
    "isOk": false,
    "message": "[projectPath] must be set",
} 
```

## 展示原型

**工具名**: start

**说明**: 该工具将启动web服务并展示模型，调用成功后，请在浏览器里输入本地地址和`init`中指定的端口号进行查看。在调用此工具前，下面的事情需要就位，否则此工具可能无法正常工作：

- 遵循 `getSpec` 工具中的指示并进行了原型创造。
- 已经调用 `init` 进行了初始化。

**入参**: 无

**出参**：

```json
// 成功响应
{
    "isOk": true,
    "message": "",
}
// 错误示例
{
    "isOk": false,
    "message": "[init] must be called ok",
}
```

## 停止展示

**工具名**: stop

**入参**: 无

**出参**：

```json
{
    "isOk": true,
    "message": "",
}
```