import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// // 简单的日志过滤
// const originalStderr = process.stderr.write;

// process.stderr.write = function(chunk, encoding, callback) {
// 	const str = chunk.toString();
// 	if (str.includes('vite:resolve') 
// 		|| str.includes('connect:dispatcher')
// 		|| str.includes('vite:load')
// 		|| str.includes('vite:import-analysis')
// 		|| str.includes('vite:transform')
// 	) {
// 		return;
// 	}
// 	return originalStderr.call(this, chunk, encoding, callback);
// };

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	
	kit: {
		adapter: adapter(),
		files:{
			assets: process.env.MCP_PROTOTYPE_HTML_PATH
		},		
		alias: {
			$img: path.join(process.env.MCP_PROTOTYPE_PATH || '.', 'static','img')
		}
	}
};

console.log('当前 SvelteKit 配置:', JSON.stringify(config, null, 2));

export default config;
