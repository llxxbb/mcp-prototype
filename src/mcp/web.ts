import path from 'path';
import { initHtmlFiles } from './main/html.js';

// 动态导入 Vite 相关模块
async function loadViteModules() {
	const vite = await import('vite');
	const sveltekitModule = await import('@sveltejs/kit/vite');
	return {
		createServer: vite.createServer,
		sveltekit: sveltekitModule.sveltekit
	};
}

const start = async () => {
	const htmlPath = path.join(process.cwd(), 'test-prototype');
	initHtmlFiles(htmlPath);

	try {
		const { createServer, sveltekit } = await loadViteModules();
		const server = await createServer({
			plugins: [await sveltekit()] as any,
			server: {
				port: 3000,
				open: true
			}
		});

		await server.listen();
		console.log('Vite server started on http://localhost:3000');
	} catch (err) {
		console.error('Failed to start Vite server:', err);
		process.exit(1);
	}
};

start();
