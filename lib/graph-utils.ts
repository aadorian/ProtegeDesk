export function calculateNodeAngle(index: number, total: number) {
  return (index / total) * Math.PI * 2
}

export function calculateCircularPosition(
  cx: number,
  cy: number,
  radius: number,
  angle: number
) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  }
}
