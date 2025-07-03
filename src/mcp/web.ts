import path from 'path'
import { createServer } from 'vite'

const start = async () => {
  try {
    const server = await createServer({
      configFile: "vite.config.web.ts",
      server: {
        port: 3000,
        open: true
      },
      define: {
        'import.meta.env.MCP_PROTOTYPE_ROOT': JSON.stringify(path.join(process.cwd(), 'prototype'))
      }
    })
    
    await server.listen()
    console.log('Vite server started on http://localhost:3000')
  } catch (err) {
    console.error('Failed to start Vite server:', err)
    process.exit(1)
  }
}

start()