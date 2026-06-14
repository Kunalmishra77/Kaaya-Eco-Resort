// d:/kaaya eco resort/server/src/index.js
import { createServer } from 'http'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const PORT = process.env.PORT || 5000

async function start() {
  // Run DB setup once on startup (idempotent — safe to run every restart)
  if (process.env.NODE_ENV === 'production') {
    try {
      const schemaPath = path.join(__dirname, '../../server/prisma/schema.prisma')
      const seedPath   = path.join(__dirname, '../../server/prisma/seed.js')
      console.log('[startup] Running prisma db push...')
      execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, { stdio: 'inherit' })
      console.log('[startup] Running seed...')
      execSync(`node "${seedPath}"`, { stdio: 'inherit' })
    } catch (err) {
      console.error('[startup] DB setup error (non-fatal):', err.message)
    }
  }

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
