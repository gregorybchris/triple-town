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

export { computeStarPoints }