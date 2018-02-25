const express = require('express')

const gridWalk = require('./gridWalk')

const app = express()
const port = process.env.PORT || 8080

app.get('/:rawName.svg', (req, res) => {
  const { rawName } = req.params
  const name = String(rawName).replace('_', ' ').toUpperCase()
  const svg = gridWalk(name)

  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(svg)
})

app.listen(port, () => console.log(`Server start on port ${port}`))
