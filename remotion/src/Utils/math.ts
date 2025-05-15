export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val))
}

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t
}

export const interpolateObject = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  t: number,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(a)) {
    if (typeof a[key] === "number" && typeof b[key] === "number") {
      result[key] = lerp(a[key] as number, b[key] as number, t)
    } else {
      result[key] = a[key]
    }
  }
  return result
}
