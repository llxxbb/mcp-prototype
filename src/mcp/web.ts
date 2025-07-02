import { createServer } from 'vite'

const start = async () => {
  try {
    const server = await createServer({
      configFile: "vite.config.web.ts",
      server: {
        port: 3000,
        open: true
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