// d:/kaaya eco resort/server/src/index.js
import { createServer } from 'http'

const PORT = process.env.PORT || 5000

async function start() {
  try {
    console.log(`[startup] Loading app... NODE_ENV=${process.env.NODE_ENV} PORT=${PORT}`)
    const { default: app } = await import('./app.js')
    console.log('[startup] App loaded successfully')

    const server = createServer(app)
    server.listen(PORT, () => {
      console.log(`🌿 Kaaya Eco Resort API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
    })

    server.on('error', (err) => {
      console.error('[server error]', err.message)
      process.exit(1)
    })
  } catch (err) {
    console.error('[FATAL STARTUP ERROR]', err.message)
    console.error(err.stack)
    process.exit(1)
  }
}

start()
