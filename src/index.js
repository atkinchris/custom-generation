const express = require('express')

const gridWalk = require('./gridWalk')
const linesToSvg = require('./linesToSvg')

const app = express()
const port = process.env.PORT || 8080

const defaults = {
  width: 512,
  height: 512,
  gridSize: 10,
  start: '#48C0D3',
  end: '#211572',
}

app.get('/:rawName.svg', (req, res) => {
  const { rawName } = req.params
  const options = Object.assign({}, defaults, req.query)

  const name = String(rawName).replace('_', ' ').toUpperCase()
  const lines = gridWalk(name, options)
  const svg = linesToSvg(lines, options)

  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(svg)
})

app.listen(port, () => console.log(`Server start on port ${port}`))
