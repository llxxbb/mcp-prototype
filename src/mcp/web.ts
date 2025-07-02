import { createServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const start = async () => {
  try {
    const server = await createServer({
      root: path.join(__dirname, '../.svelte-kit'),
      server: {
        port: 3000,
        open: false
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