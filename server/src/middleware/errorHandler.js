// d:/kaaya eco resort/server/src/middleware/errorHandler.js
export default function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500
  const message    = err.message || 'Internal server error'

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.method}] ${req.path} →`, err.message)
  }

  // Prisma not-found
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found' })
  }

  // Prisma unique constraint
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field'
    return res.status(409).json({ message: `${field} already exists` })
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
