const express = require('express')
const { createCanvas } = require('canvas')

const app = express()

app.get('/:rawName.png', (req, res) => {
  const { rawName } = req.params
  const name = String(rawName).replace('_', ' ').toUpperCase()

  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d')

  // Write "Awesome!"
  ctx.font = '30px Impact'
  ctx.rotate(0.1)
  ctx.fillText(name, 50, 100)

  // Draw line under text
  const text = ctx.measureText(name)
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.lineTo(50, 102)
  ctx.lineTo(50 + text.width, 102)
  ctx.stroke()

  res.writeHead(200, { 'Content-Type': 'image/png' })

  canvas.pngStream().pipe(res)
})

app.listen(8080, () => console.log('Example app listening on port 3000!'))
