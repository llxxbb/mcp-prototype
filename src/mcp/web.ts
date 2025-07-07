import path from 'path';
import { createServer } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { initHtmlFiles } from './main/html.js';

const start = async () => {
	const htmlPath = path.join(process.cwd(), 'test-prototype');
	initHtmlFiles(htmlPath);

	try {
		const server = await createServer({
			plugins: [sveltekit()],
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
