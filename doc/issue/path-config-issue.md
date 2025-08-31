# Svelte 运行时路径配置问题分析

## 问题描述

在 Svelte 运行过程中，出现了以下错误：

```
Error: Failed to load url /src/routes/+page.server.js (resolved id: /src/routes/+page.server.js). Does the file exist?
```

## 问题原因

vite 要使用配置文件，否则root会被重置为启动时的位置！
