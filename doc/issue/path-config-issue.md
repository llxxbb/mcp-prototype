# Svelte 运行时路径配置问题分析

## 问题描述

在 Svelte 运行过程中，出现了以下错误：

```
Error: Failed to load url /src/routes/+page.server.js (resolved id: /src/routes/+page.server.js). Does the file exist?
```

## 问题原因

通过分析 `doc/runtime.js` 中的运行时配置，发现了路径不一致的问题：

### 路径配置不一致

1. **顶层 `root`**: `'D:/TEMP/mcp'`
2. **`inlineConfig.root`**: `'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype'`
3. **Svelte 插件中的 `root`**: `'D:/TEMP/mcp'`

### 路径解析冲突

当 Vite 尝试加载 `/src/routes/+page.server.js` 时：

- **Vite 使用**: `inlineConfig.root` + `/src/routes/+page.server.js`
  - 实际路径: `D:\TEMP\mcp\node_modules\@llxxbb\mcp-prototype\src\routes\+page.server.js`
  
- **SvelteKit 期望**: `顶层 root` + `/src/routes/+page.server.js`
  - 期望路径: `D:/TEMP/mcp/src/routes/+page.server.js`

## 解决方案

### 1. 修改工作目录

在 `webTool.ts` 中，确保在创建 Vite 服务器前切换到正确的包根目录：

```typescript
// 保存当前工作目录
const originalCwd = process.cwd();

// 切换到包根目录
process.chdir(packageRoot as string);
```

### 2. 统一配置

确保 Vite 配置中的路径设置一致：

```typescript
serverInstance = createServer({
    root: packageRoot,
    plugins: [sveltekitPlugin] as any, // 使用类型断言解决版本冲突
    server: {
        port: globalConfig.port,
        open: true
    },
    configFile: false, // 禁用外部配置文件，使用内联配置
    envDir: packageRoot // 显式设置工作目录
});
```

### 3. 验证配置

使用测试脚本验证路径配置：

```bash
npm run test:path
```

## 调试方法

### 1. 运行时信息查看

- **浏览器调试页面**: 访问 `http://localhost:3000/debug`
- **API 接口**: `GET /api/debug`
- **命令行工具**: `npm run test:runtime`

### 2. 路径配置测试

```bash
npm run test:path
```

### 3. 关键文件检查

确保以下文件存在且路径正确：

- `svelte.config.js`
- `src/routes/+page.svelte`
- `src/routes/+page.server.js`
- `package.json`

## 预防措施

1. **统一路径格式**: 使用正斜杠 `/` 而不是反斜杠 `\`
2. **环境变量检查**: 确保 `MCP_PROTOTYPE_PATH` 设置正确
3. **工作目录管理**: 在启动服务前切换到正确的目录
4. **配置验证**: 定期运行路径配置测试

## 相关文件

- `src/mcp/tool/webTool.ts` - 主要修复文件
- `src/mcp/test-path-config.js` - 路径配置测试
- `doc/runtime.js` - 运行时配置分析
- `svelte.config.js` - Svelte 配置文件
