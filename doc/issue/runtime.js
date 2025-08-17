var runtime = {
    root: 'D:/TEMP/mcp',
    plugins: [
        'vite:optimized-deps',
        'vite:watch-package-data',
        'vite:pre-alias',
        'alias',
        'vite-plugin-svelte',
        'vite-plugin-svelte-inspector',
        'vite-plugin-sveltekit-guard',
        'vite:modulepreload-polyfill',
        'vite:resolve',
        'vite:html-inline-proxy',
        'vite:css',
        'vite:esbuild',
        'vite:json',
        'vite:wasm-helper',
        'vite:worker',
        'vite:asset',
        'vite-plugin-sveltekit-setup',
        'vite-plugin-sveltekit-virtual-modules',
        'vite-plugin-sveltekit-compile',
        'vite:wasm-fallback',
        'vite:define',
        'vite:css-post',
        'vite:worker-import-meta-url',
        'vite:asset-import-meta-url',
        'vite:dynamic-import-vars',
        'vite:import-glob',
        'vite-plugin-svelte-module',
        'vite:client-inject',
        'vite:css-analysis',
        'vite:import-analysis'
    ],
    server: {
        port: 3000,
        strictPort: false,
        host: undefined,
        allowedHosts: [],
        https: undefined,
        open: true,
        proxy: undefined,
        cors: {
            origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\]) (?:: \d +)?$/,
            preflightContinue: true
        },
        headers: {},
        warmup: { clientFiles: [], ssrFiles: [] },
        middlewareMode: false,
        fs: {
            strict: true,
            deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**'],
            allow: [
                'D:/TEMP/mcp/node_modules/@llxxbb/mcp-prototype/src/lib',
                'D:/TEMP/mcp/node_modules/@llxxbb/mcp-prototype/src/routes',
                'D:/TEMP/mcp/node_modules/@llxxbb/mcp-prototype/.svelte-kit',
                'D:/TEMP/mcp/node_modules/@llxxbb/mcp-prototype/src',
                'D:/TEMP/mcp/node_modules/@llxxbb/mcp-prototype/node_modules',
                'D:/TEMP/mcp/node_modules'
            ]
        },
        preTransformRequests: true,
        perEnvironmentStartEndDuringDev: false,
        sourcemapIgnoreList: "Function: sourcemapIgnoreList",
        watch: {
            ignored: [
                'D:/TEMP/mcp/node_modules/@llxxbb/mcp-prototype/.svelte-kit/!(generated)'
            ]
        }
    },
    resolve: {
        externalConditions: ['node'],
        extensions: [
            '.mjs', '.js',
            '.mts', '.ts',
            '.jsx', '.tsx',
            '.json'
        ],
        dedupe: [
            'svelte',
            'svelte/animate',
            'svelte/attachments',
            'svelte/easing',
            'svelte/internal',
            'svelte/internal/client',
            'svelte/internal/disclose-version',
            'svelte/internal/flags/async',
            'svelte/internal/flags/legacy',
            'svelte/internal/flags/tracing',
            'svelte/internal/server',
            'svelte/legacy',
            'svelte/motion',
            'svelte/reactivity',
            'svelte/reactivity/window',
            'svelte/server',
            'svelte/store',
            'svelte/transition',
            'svelte/events'
        ],
        noExternal: [],
        external: [],
        preserveSymlinks: false,
        alias: [
            {
                find: '__SERVER__',
                replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\.svelte-kit\\generated\\server'
            },
            {
                find: '$app',
                replacement: 'D:/TEMP/mcp/node_modules/@sveltejs/kit/src/runtime/app'
            },
            {
                find: '$lib',
                replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src\\lib'
            },
            {
                find: '$app',
                replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src'
            },
            {
                find: '$img',
                replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\static\\img'
            },
            {
                find: /^\/?@vite\/env/,
                replacement: '/@fs/D:/TEMP/mcp/node_modules/vite/dist/client/env.mjs'
            },
            {
                find: /^\/?@vite\/client/,
                replacement: '/@fs/D:/TEMP/mcp/node_modules/vite/dist/client/client.mjs'
            }
        ],
        mainFields: ['svelte', 'browser', 'module', 'jsnext:main', 'jsnext'],
        conditions: ['module', 'browser', 'development|production', 'svelte'],
        builtins: []
    },
    optimizeDeps: {
        include: [
            'svelte',
            'svelte/animate',
            'svelte/attachments',
            'svelte/easing',
            'svelte/internal',
            'svelte/internal/client',
            'svelte/internal/disclose-version',
            'svelte/internal/flags/async',
            'svelte/internal/flags/legacy',
            'svelte/internal/flags/tracing',
            'svelte/legacy',
            'svelte/motion',
            'svelte/reactivity',
            'svelte/reactivity/window',
            'svelte/store',
            'svelte/transition',
            'svelte/events',
            'svelte > clsx'
        ],
        exclude: ['@sveltejs/kit', '$app', '$env'],
        needsInterop: [],
        extensions: ['.svelte'],
        disabled: undefined,
        holdUntilCrawlEnd: true,
        force: false,
        noDiscovery: false,
        esbuildOptions: {
            preserveSymlinks: false,
            plugins: [
                {
                    name: 'vite-plugin-svelte:optimize-svelte',
                    setup: "Function: setup"
                },
                {
                    name: 'vite-plugin-svelte-module:optimize-svelte',
                    setup: "Function: setup"
                }
            ]
        },
        entries: [
            'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src\\routes/**/+*.{svelte,js,ts}',
            '!D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src\\routes/**/+*server.*'
        ]
    },
    ssr: {
        target: 'node',
        optimizeDeps: {
            esbuildOptions: { preserveSymlinks: false },
            include: [],
            exclude: [],
            needsInterop: [],
            extensions: [],
            holdUntilCrawlEnd: true,
            force: false,
            noDiscovery: true
        },
        external: ['cookie', 'set-cookie-parser'],
        noExternal: [
            'svelte',
            /^svelte\//,
            'esm-env',
            'vitest-browser-svelte',
            'esm-env',
            '@sveltejs/kit/src/runtime'
        ],
        resolve: {
            conditions: ['module', 'node', 'development|production', 'svelte'],
            externalConditions: ['node']
        }
    },
    experimental: {
        importGlobRestoreExtension: false, hmrPartialAccept: true
    },
    preview: {
        port: 4173,
        strictPort: false,
        host: undefined,
        allowedHosts: [],
        https: undefined,
        open: true,
        proxy: undefined,
        cors: { preflightContinue: true },
        headers: {}
    },
    define: {
        __SVELTEKIT_APP_VERSION_POLL_INTERVAL__: '0',
        __SVELTEKIT_DEV__: 'true',
        __SVELTEKIT_EMBEDDED__: 'false',
        __SVELTEKIT_EXPERIMENTAL__REMOTE_FUNCTIONS__: 'false',
        __SVELTEKIT_CLIENT_ROUTING__: 'true',
        __SVELTEKIT_SERVER_TRACING_ENABLED__: 'false',
        __SVELTEKIT_PAYLOAD__: 'globalThis.__sveltekit_dev'
    },
    appType: 'custom',
    base: '/',
    build: {
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
        polyfillModulePreload: true,
        modulePreload: { polyfill: true },
        outDir: 'dist',
        assetsDir: 'assets',
        assetsInlineLimit: 4096,
        sourcemap: false,
        terserOptions: {},
        rollupOptions: {
            input: 'D:/TEMP/mcp/node_modules/@sveltejs/kit/src/runtime/client/entry.js'
        },
        commonjsOptions: {
            include: [/node_modules/], extensions: ['.js', '.cjs']
        },
        dynamicImportVarsOptions: {
            warnOnError: true, exclude: [/node_modules/]
        },
        write: true,
        emptyOutDir: null,
        copyPublicDir: true,
        manifest: false,
        lib: false,
        ssrManifest: false,
        ssrEmitAssets: false,
        reportCompressedSize: true,
        chunkSizeWarningLimit: 500,
        watch: null,
        cssCodeSplit: true,
        minify: 'esbuild',
        ssr: false,
        emitAssets: false,
        createEnvironment: "Function: createEnvironment",
        cssTarget: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
        cssMinify: true
    },
    publicDir: 'D:/TEMP/mcp/node_modules/@llxxbb/mcp-prototype/static',
    environments: {
        client: {
            define: {
                __SVELTEKIT_APP_VERSION_POLL_INTERVAL__: '0',
                __SVELTEKIT_DEV__: 'true',
                __SVELTEKIT_EMBEDDED__: 'false',
                __SVELTEKIT_EXPERIMENTAL__REMOTE_FUNCTIONS__: 'false',
                __SVELTEKIT_CLIENT_ROUTING__: 'true',
                __SVELTEKIT_SERVER_TRACING_ENABLED__: 'false',
                __SVELTEKIT_PAYLOAD__: 'globalThis.__sveltekit_dev'
            },
            resolve: {
                externalConditions: ['node'],
                extensions: [
                    '.mjs', '.js',
                    '.mts', '.ts',
                    '.jsx', '.tsx',
                    '.json'
                ],
                dedupe: [
                    'svelte',
                    'svelte/animate',
                    'svelte/attachments',
                    'svelte/easing',
                    'svelte/internal',
                    'svelte/internal/client',
                    'svelte/internal/disclose-version',
                    'svelte/internal/flags/async',
                    'svelte/internal/flags/legacy',
                    'svelte/internal/flags/tracing',
                    'svelte/internal/server',
                    'svelte/legacy',
                    'svelte/motion',
                    'svelte/reactivity',
                    'svelte/reactivity/window',
                    'svelte/server',
                    'svelte/store',
                    'svelte/transition',
                    'svelte/events'
                ],
                noExternal: [],
                external: [],
                preserveSymlinks: false,
                alias: [
                    {
                        find: '__SERVER__',
                        replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\.svelte-kit\\generated\\server'
                    },
                    {
                        find: '$app',
                        replacement: 'D:/TEMP/mcp/node_modules/@sveltejs/kit/src/runtime/app'
                    },
                    {
                        find: '$lib',
                        replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src\\lib'
                    },
                    {
                        find: '$app',
                        replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src'
                    },
                    {
                        find: '$img',
                        replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\static\\img'
                    },
                    {
                        find: /^\/?@vite\/env/,
                        replacement: '/@fs/D:/TEMP/mcp/node_modules/vite/dist/client/env.mjs'
                    },
                    {
                        find: /^\/?@vite\/client/,
                        replacement: '/@fs/D:/TEMP/mcp/node_modules/vite/dist/client/client.mjs'
                    }
                ],
                mainFields: ['svelte', 'browser', 'module', 'jsnext:main', 'jsnext'],
                conditions: ['module', 'browser', 'development|production', 'svelte'],
                builtins: []
            },
            keepProcessEnv: false,
            consumer: 'client',
            optimizeDeps: {
                include: [
                    'svelte',
                    'svelte/animate',
                    'svelte/attachments',
                    'svelte/easing',
                    'svelte/internal',
                    'svelte/internal/client',
                    'svelte/internal/disclose-version',
                    'svelte/internal/flags/async',
                    'svelte/internal/flags/legacy',
                    'svelte/internal/flags/tracing',
                    'svelte/legacy',
                    'svelte/motion',
                    'svelte/reactivity',
                    'svelte/reactivity/window',
                    'svelte/store',
                    'svelte/transition',
                    'svelte/events',
                    'svelte > clsx'
                ],
                exclude: ['@sveltejs/kit', '$app', '$env'],
                needsInterop: [],
                extensions: ['.svelte'],
                disabled: undefined,
                holdUntilCrawlEnd: true,
                force: false,
                noDiscovery: false,
                esbuildOptions: {
                    preserveSymlinks: false,
                    plugins: [
                        {
                            name: 'vite-plugin-svelte:optimize-svelte',
                            setup: "Function: setup"
                        },
                        {
                            name: 'vite-plugin-svelte-module:optimize-svelte',
                            setup: "Function: setup"
                        }
                    ]
                },
                entries: [
                    'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src\\routes/**/+*.{svelte,js,ts}',
                    '!D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src\\routes/**/+*server.*'
                ]
            },
            dev: {
                warmup: [],
                sourcemap: { js: true },
                sourcemapIgnoreList: "Function: isInNodeModules$1",
                preTransformRequests: true,
                createEnvironment: "Function: defaultCreateClientDevEnvironment",
                recoverable: true,
                moduleRunnerTransform: false
            },
            build: {
                target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
                polyfillModulePreload: true,
                modulePreload: { polyfill: true },
                outDir: 'dist',
                assetsDir: 'assets',
                assetsInlineLimit: 4096,
                sourcemap: false,
                terserOptions: {},
                rollupOptions: {
                    input: 'D:/TEMP/mcp/node_modules/@sveltejs/kit/src/runtime/client/entry.js'
                },
                commonjsOptions: {
                    include: [/node_modules/], extensions: ['.js', '.cjs']
                },
                dynamicImportVarsOptions: {
                    warnOnError: true, exclude: [/node_modules/]
                },
                write: true,
                emptyOutDir: null,
                copyPublicDir: true,
                manifest: false,
                lib: false,
                ssrManifest: false,
                ssrEmitAssets: false,
                reportCompressedSize: true,
                chunkSizeWarningLimit: 500,
                watch: null,
                cssCodeSplit: true,
                minify: 'esbuild',
                ssr: false,
                emitAssets: true,
                createEnvironment: "Function: createEnvironment",
                cssTarget: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
                cssMinify: true
            }
        },
        ssr: {
            define: {
                __SVELTEKIT_APP_VERSION_POLL_INTERVAL__: '0',
                __SVELTEKIT_DEV__: 'true',
                __SVELTEKIT_EMBEDDED__: 'false',
                __SVELTEKIT_EXPERIMENTAL__REMOTE_FUNCTIONS__: 'false',
                __SVELTEKIT_CLIENT_ROUTING__: 'true',
                __SVELTEKIT_SERVER_TRACING_ENABLED__: 'false',
                __SVELTEKIT_PAYLOAD__: 'globalThis.__sveltekit_dev'
            },
            resolve: {
                externalConditions: ['node'],
                extensions: [
                    '.mjs', '.js',
                    '.mts', '.ts',
                    '.jsx', '.tsx',
                    '.json'
                ],
                dedupe: [
                    'svelte',
                    'svelte/animate',
                    'svelte/attachments',
                    'svelte/easing',
                    'svelte/internal',
                    'svelte/internal/client',
                    'svelte/internal/disclose-version',
                    'svelte/internal/flags/async',
                    'svelte/internal/flags/legacy',
                    'svelte/internal/flags/tracing',
                    'svelte/internal/server',
                    'svelte/legacy',
                    'svelte/motion',
                    'svelte/reactivity',
                    'svelte/reactivity/window',
                    'svelte/server',
                    'svelte/store',
                    'svelte/transition',
                    'svelte/events'
                ],
                noExternal: [
                    'svelte',
                    /^svelte\//,
                    'esm-env',
                    'vitest-browser-svelte',
                    'esm-env',
                    '@sveltejs/kit/src/runtime'
                ],
                external: ['cookie', 'set-cookie-parser'],
                preserveSymlinks: false,
                alias: [
                    {
                        find: '__SERVER__',
                        replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\.svelte-kit\\generated\\server'
                    },
                    {
                        find: '$app',
                        replacement: 'D:/TEMP/mcp/node_modules/@sveltejs/kit/src/runtime/app'
                    },
                    {
                        find: '$lib',
                        replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src\\lib'
                    },
                    {
                        find: '$app',
                        replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\src'
                    },
                    {
                        find: '$img',
                        replacement: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype\\static\\img'
                    },
                    {
                        find: /^\/?@vite\/env/,
                        replacement: '/@fs/D:/TEMP/mcp/node_modules/vite/dist/client/env.mjs'
                    },
                    {
                        find: /^\/?@vite\/client/,
                        replacement: '/@fs/D:/TEMP/mcp/node_modules/vite/dist/client/client.mjs'
                    }
                ],
                mainFields: ['svelte', 'module', 'jsnext:main', 'jsnext'],
                conditions: ['module', 'node', 'development|production', 'svelte'],
                builtins: [
                    '_http_agent', '_http_client', '_http_common',
                    '_http_incoming', '_http_outgoing', '_http_server',
                    '_stream_duplex', '_stream_passthrough', '_stream_readable',
                    '_stream_transform', '_stream_wrap', '_stream_writable',
                    '_tls_common', '_tls_wrap', 'assert',
                    'assert/strict', 'async_hooks', 'buffer',
                    'child_process', 'cluster', 'console',
                    'constants', 'crypto', 'dgram',
                    'diagnostics_channel', 'dns', 'dns/promises',
                    'domain', 'events', 'fs',
                    'fs/promises', 'http', 'http2',
                    'https', 'inspector', 'inspector/promises',
                    'module', 'net', 'os',
                    'path', 'path/posix', 'path/win32',
                    'perf_hooks', 'process', 'punycode',
                    'querystring', 'readline', 'readline/promises',
                    'repl', 'stream', 'stream/consumers',
                    'stream/promises', 'stream/web', 'string_decoder',
                    'sys', 'timers', 'timers/promises',
                    'tls', 'trace_events', 'tty',
                    'url', 'util', 'util/types',
                    'v8', 'vm', 'wasi',
                    'worker_threads', 'zlib', /^node:/,
                    /^npm:/, /^bun:/
                ]
            },
            keepProcessEnv: true,
            consumer: 'server',
            optimizeDeps: {
                include: [],
                exclude: [],
                needsInterop: [],
                extensions: [],
                disabled: undefined,
                holdUntilCrawlEnd: true,
                force: false,
                noDiscovery: true,
                esbuildOptions: { preserveSymlinks: false }
            },
            dev: {
                warmup: [],
                sourcemap: { js: true },
                sourcemapIgnoreList: "Function: isInNodeModules$1",
                preTransformRequests: false,
                createEnvironment: "Function: defaultCreateDevEnvironment",
                recoverable: false,
                moduleRunnerTransform: true
            },
            build: {
                target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
                polyfillModulePreload: true,
                modulePreload: { polyfill: true },
                outDir: 'dist',
                assetsDir: 'assets',
                assetsInlineLimit: 4096,
                sourcemap: false,
                terserOptions: {},
                rollupOptions: {
                    input: 'D:/TEMP/mcp/node_modules/@sveltejs/kit/src/runtime/client/entry.js'
                },
                commonjsOptions: {
                    include: [/node_modules/], extensions: ['.js', '.cjs']
                },
                dynamicImportVarsOptions: {
                    warnOnError: true, exclude: [/node_modules/]
                },
                write: true,
                emptyOutDir: null,
                copyPublicDir: true,
                manifest: false,
                lib: false,
                ssrManifest: false,
                ssrEmitAssets: false,
                reportCompressedSize: true,
                chunkSizeWarningLimit: 500,
                watch: null,
                cssCodeSplit: true,
                minify: false,
                ssr: true,
                emitAssets: false,
                createEnvironment: "Function: createEnvironment",
                cssTarget: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
                cssMinify: 'esbuild'
            }
        }
    },
    configFile: undefined,
    configFileDependencies: [],
    inlineConfig: {
        root: 'D:\\TEMP\\mcp\\node_modules\\@llxxbb\\mcp-prototype',
        plugins: [
            [
                {
                    name: 'vite-plugin-svelte',
                    enforce: 'pre',
                    api: {
                        options: {
                            compilerOptions: {
                                css: 'external',
                                dev: true,
                                hmr: true,
                                hydratable: undefined
                            },
                            extensions: ['.svelte'],
                            emitCss: true,
                            prebundleSvelteLibraries: true,
                            configFile: false,
                            preprocess: [
                                {
                                    name: 'vite-preprocess',
                                    style: "AsyncFunction: style"
                                },
                                {
                                    script: "Function: script",
                                    markup: "Function: markup"
                                }
                            ],
                            onwarn: undefined,
                            root: 'D:/TEMP/mcp',
                            isBuild: false,
                            isServe: true,
                            isDebug: true,
                            isProduction: false,
                            stats: {}
                        }
                    },
                    config: "AsyncFunction: config",
                    configEnvironment: "Function: configEnvironment",
                    configResolved: "AsyncFunction: configResolved",
                    buildStart: "AsyncFunction: buildStart",
                    configureServer: "Function: configureServer",
                    load: "AsyncFunction: load",
                    resolveId: "AsyncFunction: resolveId",
                    transform: "AsyncFunction: transform",
                    handleHotUpdate: "Function: handleHotUpdate",
                    buildEnd: "AsyncFunction: buildEnd"
                },
                {
                    name: 'vite-plugin-svelte-module',
                    enforce: 'post',
                    configResolved: "AsyncFunction: configResolved",
                    transform: "AsyncFunction: transform"
                },
                {
                    name: 'vite-plugin-svelte-inspector',
                    apply: 'serve',
                    enforce: 'pre',
                    configResolved: "Function: configResolved",
                    resolveId: "AsyncFunction: resolveId",
                    load: "AsyncFunction: load",
                    transform: "Function: transform"
                },
                {
                    name: 'vite-plugin-sveltekit-setup',
                    config: "Function: config",
                    configResolved: "Function: configResolved"
                },
                {
                    name: 'vite-plugin-sveltekit-virtual-modules',
                    resolveId: "Function: resolveId",
                    load: "Function: load"
                },
                {
                    name: 'vite-plugin-sveltekit-guard',
                    enforce: 'pre',
                    resolveId: "AsyncFunction: resolveId",
                    load: "Function: load"
                },
                {
                    name: 'vite-plugin-sveltekit-compile',
                    config: "Function: config",
                    configureServer: "AsyncFunction: configureServer",
                    configurePreviewServer: "Function: configurePreviewServer",
                    buildStart: "Function: buildStart",
                    renderChunk: "Function: renderChunk",
                    generateBundle: "Function: generateBundle",
                    writeBundle: {
                        sequential: true, handler: "AsyncFunction: handler"
                    },
                    closeBundle: {
                        sequential: true, handler: "AsyncFunction: handler"
                    }
                }
            ]
        ],
        server: { port: 3000, open: true }
    },
    decodedBase: '/',
    rawBase: '/',
    cacheDir: 'D:/TEMP/mcp/node_modules/.vite',
    command: 'serve',
    mode: 'development',
    isWorker: false,
    mainConfig: null,
    bundleChain: [],
    isProduction: false,
    css: {
        transformer: 'postcss',
        preprocessorMaxWorkers: 0,
        devSourcemap: false
    },
    json: { namedExports: true, stringify: 'auto' },
    esbuild: { jsxDev: true },
    builder: undefined,
    envDir: 'D:/TEMP/mcp',
    env: {
        BASE_URL: '/', MODE: 'development', DEV: true, PROD: false
    },
    assetsInclude: "Function: assetsInclude",
    logger: {
        hasWarned: false,
        info: "Function: info",
        warn: "Function: warn",
        warnOnce: "Function: warnOnce",
        error: "Function: error",
        clearScreen: "Function: clearScreen",
        hasErrorLogged: "Function: hasErrorLogged"
    },
    packageCache: {
        'fnpd_D:/TEMP/mcp': {
            dir: 'D:/TEMP/mcp',
            data: {
                dependencies: {
                    '@llxxbb/mcp-prototype': 'file:llxxbb-mcp-prototype-0.1.5.tgz'
                }
            },
            hasSideEffects: "Function: hasSideEffects",
            setResolvedCache: "Function: setResolvedCache",
            getResolvedCache: "Function: getResolvedCache"
        }
    },
    worker: {
        format: 'iife', plugins: '() => plugins', rollupOptions: {}
    },
    future: undefined,
    dev: {
        warmup: [],
        sourcemap: { js: true },
        sourcemapIgnoreList: "Function: isInNodeModules$1",
        preTransformRequests: false,
        createEnvironment: "Function: defaultCreateDevEnvironment",
        recoverable: false,
        moduleRunnerTransform: false
    },
    webSocketToken: 'hmZ6yPnhaJQx',
    getSortedPlugins: "Function: getSortedPlugins",
    getSortedPluginHooks: "Function: getSortedPluginHooks",
    createResolver: "Function: createResolver",
    fsDenyGlob: "Function: arrayMatcher",
    safeModulePaths: "Set(0)",
    additionalAllowedHosts: []
}