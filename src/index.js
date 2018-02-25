const express = require('express')

const gridWalk = require('./gridWalk')

const app = express()
const port = 8080

app.get('/:rawName.png', (req, res) => {
  const { rawName } = req.params
  const name = String(rawName).replace('_', ' ').toUpperCase()

  const canvas = gridWalk(name)

  res.writeHead(200, { 'Content-Type': 'image/png' })
  canvas.pngStream().pipe(res)
})

app.listen(port, () => console.log('Server start'))
