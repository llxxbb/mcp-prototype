import { defineConfig } from 'vite';
export default defineConfig({
	build: {
		target: 'node16',
		lib: {
			entry: {
				index: 'src/mcp/index.ts',
				web: 'src/mcp/web.ts'
			},
			formats: ['cjs'],
			fileName: '[name]'
		},
		rollupOptions: {
			external: [
				'node:fs',
				'node:path',
				'node:console',
				'node:fs/promises',
				'node:process',
				'node:url',
				'node:assert',
				'node:events',
				'node:stream',
				'node:util',
				'node:http',
				'node:https',
				'node:http2',
				'node:dns',
				'node:os',
				'node:async_hooks',
				'node:crypto',
				'node:string_decoder',
				'node:diagnostics_channel',
				/@modelcontextprotocol\/sdk/,
				/^avvio/,
				/^fastify/,
				/^find-my-way/,
				/^light-my-request/,
				/^@fastify\/static/,
				/^@fastify\/send/,
				/^minipass/,
				/^glob/,
				/^path-scurry/,
				/^safe-buffer/
			],
			output: {
				format: 'cjs',
				interop: 'auto',
				exports: 'named'
			}
		},
		outDir: 'dist/mcp',
		minify: false // 禁用压缩以便调试
	},
	optimizeDeps: {
		exclude: [
			'node:fs',
			'node:path',
			'node:console',
			'node:fs/promises',
			'node:process',
			'node:url',
			'node:assert',
			'node:events',
			'node:stream',
			'node:util',
			'node:http',
			'node:https',
			'node:http2',
			'node:dns',
			'node:os',
			'node:async_hooks',
			'node:crypto',
			'node:string_decoder',
			'node:diagnostics_channel',
			/@modelcontextprotocol\/sdk/,
			/^avvio/,
			/^fastify/,
			/^find-my-way/,
			/^light-my-request/,
			/^@fastify\/static/,
			/^@fastify\/send/,
			/^minipass/,
			/^glob/,
			/^path-scurry/,
			/^safe-buffer/
		]
	}
});
