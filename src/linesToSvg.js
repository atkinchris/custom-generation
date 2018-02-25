const linesToSvg = (lines, options) => {
  const { height, width, start, end } = options

  const path = lines.map(({ x1, x2, y1, y2 }) => `M${x1} ${y1}L${x2} ${y2}`)

  const output = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
        <mask id="lines">
          <path d="${path.join('')}" fill="transparent" stroke="white" stroke-linecap="round" stroke-width="2" />
        </mask>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" mask="url(#lines)" fill="url(#grad)" />
    </svg>
  `

  return output
}

module.exports = linesToSvg
