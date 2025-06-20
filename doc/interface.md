# 工具提供的接口

## 使用说明接口

AI与此 MCP-Prototype 协作流程如下：

- AI 检索 MCP-Prototype 使用规范

- 基于使用规范， AI 生成一组 HTML+CSS+JS 原型文件及原型辅助说明文件。

- AI 生成原型描述配置文件，并调用 MCP-Prototype 工具进行原型展示。

- MCP-Prototype 组件依据原型配置文件进行展示。

## 规范查询接口

返回下面的内容：

```markdown
## 原型辅助说明文件（可选）

每个原型文件可以对应一个辅助说明文件。文件名与原型文件一致，后缀为".annotation.md"
```

## 提交配置

如果处于运行状态则重启原型

入参内容如下：

```json
{
    "prototypeBasePath": "原型所在的根目录，所有的原型文件相对于此路径进行说明",
    "nav":[ // 一级导航，可递归树结构
        {
            "navTitle":"导航名称",
            "page": "原型页面的相对路径",
            "marker": [    // 元素对应的序号标记说明
                {
                    "id": "元素ID",
                    "text": "对该元素进行说明，如值的范围，格式等。"
                },
                ...
            ]
            "nav":[], // 二级导航, 可选
        },
        ...
    ],
    "option":{
        "marker":{
            "position": 0, // 0缺省，左上；1中上；2右上；3坐下，4中下；5右下。暂不支持
            "disable": false， // 关闭标签显示，缺省显示。
        }
    }
}
```

## 启动原型

## 停止原型
