// d:/kaaya eco resort/server/src/index.js
import { createServer } from 'http'
import { execSync }     from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename   = fileURLToPath(import.meta.url)
const __dirname    = path.dirname(__filename)
const projectRoot  = path.join(__dirname, '../..')
const PORT         = process.env.PORT || 5000

async function start() {
  if (process.env.NODE_ENV === 'production') {
    const schemaPath  = path.join(projectRoot, 'server/prisma/schema.prisma')
    const seedPath    = path.join(projectRoot, 'server/prisma/seed.js')
    // Try root node_modules first, then server node_modules
    const prismaBin   = path.join(projectRoot, 'node_modules/.bin/prisma')

    try {
      console.log('[startup] Running prisma db push...')
      const out = execSync(`"${prismaBin}" db push --schema="${schemaPath}" --accept-data-loss`, {
        cwd: projectRoot,
        env: { ...process.env },
      })
      console.log('[startup] db push done:', out.toString().trim())
    } catch (err) {
      console.error('[startup] db push STDERR:', err.stderr?.toString())
      console.error('[startup] db push STDOUT:', err.stdout?.toString())
    }

    try {
      console.log('[startup] Running seed...')
      const out = execSync(`node "${seedPath}"`, {
        cwd: projectRoot,
        env: { ...process.env },
      })
      console.log('[startup] seed done:', out.toString().trim())
    } catch (err) {
      console.error('[startup] seed STDERR:', err.stderr?.toString())
      console.error('[startup] seed STDOUT:', err.stdout?.toString())
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
