# Cursor MCP 环境 403 Forbidden 错误解决方案

## 问题分析

在 Cursor MCP 环境中运行时出现 403 Forbidden 错误，而在直接运行 `test-remote-package.js` 时正常。通过对比分析，发现关键差异在于环境变量和工作目录设置。

## 根本原因

### 1. 环境变量缺失
Cursor MCP 环境缺少以下关键环境变量：
- `DEBUG: '*'` - 启用调试模式
- `NODE_ENV: 'development'` - 设置开发环境

### 2. 工作目录问题
- Cursor MCP 环境的工作目录可能与预期不符
- `MCP_PROTOTYPE_PATH` 环境变量可能未正确设置

### 3. 进程上下文差异
- Cursor MCP 直接在父进程中运行
- `test-remote-package.js` 通过 `spawn` 创建独立子进程

## 解决方案

### 1. 环境变量设置
在 `webTool.ts` 和 `web.ts` 中添加关键环境变量：

```typescript
// 设置关键环境变量，确保与 test-remote-package.js 一致
process.env.DEBUG = '*';
process.env.NODE_ENV = 'development';
```

### 2. 工作目录管理
改进工作目录切换逻辑：

```typescript
// 保存当前工作目录
const originalCwd = process.cwd();
console.log('原始工作目录:', originalCwd);

// 切换到包根目录
const packageRoot = process.env.MCP_PROTOTYPE_PATH;
if (packageRoot) {
    process.chdir(packageRoot);
    console.log('切换到包根目录:', packageRoot);
} else {
    console.log('警告: MCP_PROTOTYPE_PATH 未设置，使用当前目录');
}
```

### 3. Vite 配置优化
针对不同环境调整 Vite 配置：

```typescript
serverInstance = createServer({
    configFile: configFilePath,
    server: {
        port: globalConfig.port,
        open: true,
        fs: {
            // 在 npx 环境中禁用严格模式，允许更灵活的文件访问
            strict: !isNpxEnvironment,
            // 在 npx 环境中允许访问 npm-cache 目录
            ...(isNpxEnvironment && {
                allow: [process.env.npm_config_cache || 'C:/Users/llxxb/AppData/Local/npm-cache']
            })
        },
        // 启用 CORS 支持
        cors: true
    }
});
```

**注意**：移除了 `allow: ['..']` 配置，因为：
1. 工作目录已经通过 `process.chdir(packageRoot)` 切换到包的根目录
2. 通过 `configFile` 指定了外部配置文件路径
3. 在 npx 环境中只需要访问 npm-cache 目录即可

## 验证步骤

### 1. 检查环境变量
在 Cursor MCP 环境中运行时，确认以下环境变量已设置：
- `DEBUG: '*'`
- `NODE_ENV: 'development'`
- `MCP_PROTOTYPE_PATH: <包根目录路径>`

### 2. 检查工作目录
确认 Vite 服务器在正确的目录中启动：
- 应该切换到包的根目录
- 能够找到 `vite.config.web.ts` 文件

### 3. 检查文件访问
确认 Vite 能够访问必要的文件：
- SvelteKit 运行时文件
- 原型 HTML 文件
- 静态资源文件

## 调试方法

### 1. 运行时信息
使用 `getRuntimeInfo` 工具获取详细的运行时信息：
- 环境变量状态
- 工作目录
- 进程信息

### 2. 日志输出
启用调试模式查看详细日志：
```bash
DEBUG=* npx @llxxbb/mcp-prototype
```

### 3. 网络检查
在浏览器开发者工具中检查网络请求：
- 确认 `@fs` 协议的请求状态
- 查看具体的错误信息

## 预防措施

### 1. 环境一致性
确保 Cursor MCP 环境与测试环境保持一致：
- 相同的环境变量设置
- 相同的工作目录逻辑
- 相同的文件访问权限

### 2. 错误处理
添加更完善的错误处理和日志记录：
- 捕获并记录文件访问错误
- 提供详细的错误信息
- 自动重试机制

### 3. 配置验证
在启动前验证配置的完整性：
- 检查必要的环境变量
- 验证文件路径的有效性
- 确认依赖项的可访问性

## 总结

通过设置正确的环境变量、管理工作目录和优化 Vite 配置，可以解决 Cursor MCP 环境中的 403 Forbidden 错误。关键是要确保 Cursor MCP 环境与成功的测试环境保持一致。
