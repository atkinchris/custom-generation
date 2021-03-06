const vectorizeText = require('vectorize-text')
const { createCanvas } = require('canvas')

const Triangle = require('./triangle')

const buildText = (width, height, scale, text) => {
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  const { positions, cells } = vectorizeText(text, {
    font: 'Sans-serif',
    triangles: true,
    textBaseline: 'hanging',
    canvas,
    context,
    width: width * scale,
  })

  const bounds = positions.reduce((out, [x, y]) => ({
    top: y < out.top ? y : out.top,
    bottom: y > out.bottom ? y : out.bottom,
    left: x < out.left ? x : out.left,
    right: x > out.right ? x : out.right,
  }), {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  bounds.height = bounds.bottom - bounds.top
  bounds.width = bounds.right - bounds.left

  let yScale = 1
  let yMargin = 0

  if (bounds.height > height) {
    yScale = (height / bounds.height) * scale
    yMargin = ((1 - yScale) * height) / 2
  }

  const offsetPositions = positions.map(position => [
    position[0] + ((width / 2) - Math.round(bounds.right / 2)),
    position[1] + ((height / 2) - Math.round(bounds.bottom / 2)),
  ]).map(position => [
    (position[0] * yScale) + yMargin,
    (position[1] * yScale) + yMargin,
  ])

  const triangles = cells.map(cell => new Triangle([
    offsetPositions[cell[0]],
    offsetPositions[cell[1]],
    offsetPositions[cell[2]],
  ]))

  return {
    inText: point => triangles.some(tri => tri.contains([point.x, point.y])),
    triangles,
    bounds,
  }
}

module.exports = buildText
