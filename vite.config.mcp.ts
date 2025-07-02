import { defineConfig } from 'vite';

// 所有 Node.js 内置模块列表
const NODE_BUILTINS = [
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
  'node:diagnostics_channel'
];

export default defineConfig({
  resolve: {
    alias: {
      path: 'path-browserify'
    }
  },
  plugins: [],
	build: {
		target: 'node16',
		lib: {
			entry: {
				index: 'src/mcp/index.ts',
				web: 'src/mcp/web.ts'
			},
			formats: ['es'],
			fileName: '[name]'
		},
		rollupOptions: {
			external: [
				...NODE_BUILTINS,
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
				/^safe-buffer/,
				/^fsevents$/
			],
			output: {
				format: 'es',
				interop: 'auto'
			}
		},
		outDir: 'dist/mcp',
		minify: false // 禁用压缩以便调试
	},
	optimizeDeps: {
		exclude: [
			...NODE_BUILTINS,
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