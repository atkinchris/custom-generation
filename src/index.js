const express = require('express')
const path = require('path')

const gridWalk = require('./gridWalk')
const linesToSvg = require('./linesToSvg')

const app = express()
const port = process.env.PORT || 8080
const indexFile = path.resolve(__dirname, 'index.html')

const defaults = {
  width: 512,
  height: 512,
  gridSize: 10,
  scale: 0.85,
  start: '#48C0D3',
  end: '#211572',
}

app.get('/', (req, res) => {
  res.sendFile(indexFile)
})

app.get('/:rawName.svg', (req, res) => {
  const { rawName } = req.params
  const options = Object.assign({}, defaults, req.query)

  options.gridSize = parseInt(options.gridSize, 10)
  options.width = parseInt(options.width, 10)
  options.height = parseInt(options.height, 10)

  const name = String(rawName).replace('_', ' ').toUpperCase()
  const lines = gridWalk(name, options)
  const svg = linesToSvg(lines, options)

  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(svg)
})

app.listen(port, () => {
  console.log(`Server start on port ${port}`) // eslint-disable-line no-console
})
