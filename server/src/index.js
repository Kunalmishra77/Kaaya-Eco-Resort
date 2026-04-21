// d:/kaaya eco resort/server/src/index.js
// Local development entry — imports the shared app and starts the HTTP server
import app from './app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🌿 Kaaya Eco Resort API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})
