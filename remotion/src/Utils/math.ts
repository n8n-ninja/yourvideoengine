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
  for (const key of Object.keys(a)) {
    if (typeof a[key] === "number" && typeof b[key] === "number") {
      result[key] = lerp(a[key] as number, b[key] as number, t)
    } else {
      result[key] = a[key]
    }
  }
  return result
}
