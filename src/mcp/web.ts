import path from 'path';
import { createServer } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

const start = async () => {
	const htmlPath = path.join(process.cwd(), 'test-prototype');
	console.log('web starter: env.MCP_PROTOTYPE_HTML_PATH', htmlPath);
	process.env.MCP_PROTOTYPE_HTML_PATH = htmlPath;

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
