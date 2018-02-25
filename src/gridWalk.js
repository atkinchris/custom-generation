const { createCanvas } = require('canvas')
const { knuthShuffle } = require('knuth-shuffle')

const buildText = require('./buildText')

const width = 400
const height = 400
const gridSize = 6
const maxAttempts = 1000
const maxAdjacents = 2
const passes = 3

const distanceSqFrom = (a, b) => {
  const dX = (a.x - b.x) ** 2
  const dY = (a.y - b.y) ** 2
  return Math.round(dX + dY)
}

const buildLine = (list, discard) => {
  knuthShuffle(list)
  const aIndex = 0
  const bIndex = list.findIndex(point => distanceSqFrom(list[0], point) === gridSize ** 2)

  if (bIndex === -1) return null

  const b = list.splice(bIndex, 1)[0]
  const a = list.splice(aIndex, 1)[0]

  b.adjacents += 1
  a.adjacents += 1
  discard.push(a)
  discard.push(b)

  const colour = ((a.y / height) * 96) + 180

  return {
    x1: a.x,
    x2: b.x,
    y1: a.y,
    y2: b.y,
    colour,
  }
}

const gridWalk = (name) => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const points = []
  const lines = []

  const { inText } = buildText(canvas, name)

  const rowHeight = gridSize
  const columnWidth = Math.sqrt((gridSize ** 2) - ((gridSize / 2) ** 2))
  let offset = false

  for (let x = 0; x < width + columnWidth; x += columnWidth) {
    const yOffset = offset ? gridSize / 2 : 0
    offset = !offset

    for (let y = yOffset; y < height; y += rowHeight) {
      const point = { x, y, adjacents: 0 }

      if (!inText(point)) {
        points.push(point)
      }
    }
  }

  for (let pass = 0; pass < passes; pass += 1) {
    const discard = []
    let attempts = 0

    while (attempts < maxAttempts) {
      const line = buildLine(points, discard)

      if (line) {
        lines.push(line)
      } else {
        attempts += 1
      }
    }

    discard.forEach((point) => {
      if (point.adjacents < maxAdjacents) {
        points.push(point)
      }
    })
  }

  const output = []

  output.push(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`)

  lines.forEach(({ x1, x2, y1, y2, colour }) => {
    const stroke = `hsl(${colour}, 100%, 50%)`
    output.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="1" stroke="${stroke}"/>`)
  })

  output.push('</svg>')

  return output.join('\n')
}

module.exports = gridWalk
