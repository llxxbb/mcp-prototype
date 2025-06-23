# 配置文件

文件格式如下：

```json
[
    "prototypeRoot": "原型所在的路径（必须存在），是 projectPath 的相对路径",
    "port": 3000, // MCP-Prototype 用于提供原型浏览的 web 服务端口号
    "marker": {
        "position": 0, // 标记位置：0(左上),1(中上),2(右上),3(左下),4(中下),5(右下),6(左),7(右)，缺省值为 0。
        "disable": false, // 是否禁用所有标记，缺省值为 false
    }
]
```
