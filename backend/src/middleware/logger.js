module.exports = (req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const durationMs = Date.now() - start
    const timestamp = new Date().toISOString()

    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs} ms`)
  })

  next()
}
