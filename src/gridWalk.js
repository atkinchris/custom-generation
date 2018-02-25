const { knuthShuffle } = require('knuth-shuffle')

const buildText = require('./buildText')

const maxAttempts = 1000
const maxAdjacents = 2
const passes = 3

const distanceSqFrom = (a, b) => {
  const dX = (a.x - b.x) ** 2
  const dY = (a.y - b.y) ** 2
  return Math.round(dX + dY)
}

const buildLine = (list, discard, gridSize) => {
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

  return {
    x1: Math.round(a.x),
    x2: Math.round(b.x),
    y1: Math.round(a.y),
    y2: Math.round(b.y),
  }
}

const gridWalk = (name, options) => {
  const { height, width, gridSize } = options
  const points = []
  const lines = []
  const center = {
    x: width / 2,
    y: height / 2,
  }
  const radiusSq = (Math.min(width, height) / 2) ** 2

  const { inText } = buildText(width, height, 0.85, name)
  const inCircle = point => distanceSqFrom(point, center) <= radiusSq

  const rowHeight = gridSize
  const columnWidth = Math.sqrt((gridSize ** 2) - ((gridSize / 2) ** 2))
  let offset = false

  for (let x = 0; x < width + columnWidth; x += columnWidth) {
    const yOffset = offset ? gridSize / 2 : 0
    offset = !offset

    for (let y = yOffset; y < height; y += rowHeight) {
      const point = { x, y, adjacents: 0 }

      if (!inText(point) && inCircle(point)) {
        points.push(point)
      }
    }
  }

  for (let pass = 0; pass < passes; pass += 1) {
    const discard = []
    let attempts = 0

    while (attempts < maxAttempts) {
      const line = buildLine(points, discard, gridSize)

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

  return lines
}

module.exports = gridWalk
