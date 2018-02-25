const express = require('express')

const gridWalk = require('./gridWalk')

const app = express()

app.get('/:rawName.png', (req, res) => {
  const { rawName } = req.params
  const name = String(rawName).replace('_', ' ').toUpperCase()

  const canvas = gridWalk(name)

  res.writeHead(200, { 'Content-Type': 'image/png' })
  canvas.pngStream().pipe(res)
})

app.listen(8080, () => console.log('Example app listening on port 3000!'))
