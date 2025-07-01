import Fastify from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url'
import fastifyStatic from '@fastify/static'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fastify = Fastify({
  logger: true
})

// 注册静态文件服务
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../../dist'),
  prefix: '/'
})

// 基本路由
fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html')
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log(`Server listening on http://localhost:3000`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()