import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const cachePath = process.env.npm_config_cache || '../..';
console.log('cachePath:', cachePath);

export default defineConfig({
	plugins: [sveltekit()] as any,
	server: {
		fs: {
			allow: [cachePath]
		},
		// 启用 CORS 支持
		cors: true
	}
});
