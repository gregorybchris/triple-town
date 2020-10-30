const interleave = (as, bs) => {
  return [].concat(as.map((a, i) => [a, bs[i]]))
}

const computeStarPoints = (n, r1, r2, x = 0, y = 0, a = 0) => {
  const pi = Math.PI
  const basicRange = [...Array(n).keys()]
  const outerAngles = basicRange.map((i) => i * (2 * pi / n) - pi / 2 - a)
  const innerAngles = outerAngles.map((t) => t + 2 * pi / n / 2)
  const outerPoints = outerAngles.map((t) => [Math.cos(t) * r1 + x, Math.sin(t) * r1 + y])
  const innerPoints = innerAngles.map((t) => [Math.cos(t) * r2 + x, Math.sin(t) * r2 + y])
  return interleave(outerPoints, innerPoints)
}

function shadeColor(color, percent) {
  let r = parseInt(color.substring(1, 3), 16)
  let g = parseInt(color.substring(3, 5), 16)
  let b = parseInt(color.substring(5, 7), 16)

  // Scale
  r = parseInt(r * (percent + 100) / 100)
  g = parseInt(g * (percent + 100) / 100)
  b = parseInt(b * (percent + 100) / 100)

  // Clip
  r = (r < 255) ? r : 255
  g = (g < 255) ? g : 255
  b = (b < 255) ? b : 255

  // Convert to strings
  let rStr = r.toString(16)
  let gStr = g.toString(16)
  let bStr = b.toString(16)

  // Format strings
  rStr = rStr.length == 1 ? `0${rStr}` : rStr
  gStr = gStr.length == 1 ? `0${gStr}` : gStr
  bStr = bStr.length == 1 ? `0${bStr}` : bStr

  return `#${rStr}${gStr}${bStr}`
}

export { computeStarPoints, shadeColor }
