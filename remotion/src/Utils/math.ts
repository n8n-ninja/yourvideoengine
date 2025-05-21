/**
 * Clamp a value between a minimum and a maximum.
 * @param val The value to clamp.
 * @param min The minimum allowed value.
 * @param max The maximum allowed value.
 * @returns The clamped value.
 */
export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val))
}

/**
 * Linear interpolation between two numbers.
 * @param a The start value.
 * @param b The end value.
 * @param t The interpolation factor (0 = a, 1 = b).
 * @returns The interpolated value.
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t
}

/**
 * Interpolate between two objects with numeric properties.
 * Only numeric properties are interpolated; others are copied from the first object.
 * @param a The start object.
 * @param b The end object.
 * @param t The interpolation factor (0 = a, 1 = b).
 * @returns The interpolated object.
 */
export const interpolateObject = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  t: number,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  const parseValueWithUnit = (val: string) => {
    const match = val.trim().match(/^(-?\d+(?:\.\d+)?)([a-zA-Z%]+)$/)
    if (!match) return null
    return { num: parseFloat(match[1]), unit: match[2] }
  }
  for (const key of Object.keys(a)) {
    const aVal = a[key]
    const bVal = b[key]
    if (typeof aVal === "number" && typeof bVal === "number") {
      result[key] = lerp(aVal as number, bVal as number, t)
    } else if (
      typeof aVal === "string" &&
      typeof bVal === "string" &&
      aVal.trim().endsWith("%") &&
      bVal.trim().endsWith("%")
    ) {
      // No interpolation for percent strings, just pick closest
      result[key] = t < 0.5 ? aVal : bVal
    } else if (typeof aVal === "string" && typeof bVal === "string") {
      const aParsed = parseValueWithUnit(aVal)
      const bParsed = parseValueWithUnit(bVal)
      if (aParsed && bParsed && aParsed.unit === bParsed.unit) {
        // Interpolate numeric part, keep unit
        const interpolatedNum = lerp(aParsed.num, bParsed.num, t)
        result[key] = `${interpolatedNum}${aParsed.unit}`
      } else {
        // Fallback: always pick aVal
        result[key] = aVal
      }
    } else {
      // Fallback: always pick aVal
      result[key] = aVal
    }
  }
  return result
}
