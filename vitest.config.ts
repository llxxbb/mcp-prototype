import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node', // Node 环境
		include: ['**/*.test.ts'], // 测试文件匹配模式
		globals: true, // 全局导入 describe/test/expect
		root: './src' // 与 tsconfig.json 中的 root 保持一致
	}
});
