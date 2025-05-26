import type { Keyframe } from "@/schemas/project"
import { lerp, interpolateObject } from "./math"

/**
 * Returns the interpolated value for the given keyframes at the specified time.
 * Supports both numeric and object values. Handles negative keyframe times (relative to duration).
 * If currentTime is before the first keyframe, returns its value. If after the last, returns its value.
 * If no interpolation is possible, returns the previous value.
 *
 * @template T The type of the keyframe value (number or object).
 * @param keyframes Array of keyframes with time and value.
 * @param currentTime The current time (in seconds or frames).
 * @param duration The total duration (in seconds or frames).
 * @returns The interpolated value at the given time, or undefined if no keyframes.
 */
export function getKeyframeValue<T = number | Record<string, unknown>>(
  keyframes: Keyframe<T>[],
  currentTime: number,
  duration: number,
): T | undefined {
  if (!keyframes.length) return undefined
  // Resolve negative times (in seconds)
  const resolved = keyframes.map((kf) => ({
    ...kf,
    time: kf.time < 0 ? duration + kf.time : kf.time,
  }))
  const sorted = [...resolved].sort((a, b) => a.time - b.time)

  // Find the two keyframes surrounding the current time
  let prev = sorted[0]
  let next = sorted[sorted.length - 1]
  for (let i = 0; i < sorted.length; i++) {
    if (currentTime < sorted[i].time) {
      next = sorted[i]
      prev = sorted[Math.max(0, i - 1)]
      break
    }
  }

  if (typeof prev.value === "number" && typeof next.value === "number") {
    if (next.time === prev.time) return prev.value as T
    const t = Math.min(
      Math.max((currentTime - prev.time) / (next.time - prev.time), 0),
      1,
    )
    return lerp(prev.value as number, next.value as number, t) as T
  }

  if (
    typeof prev.value === "object" &&
    typeof next.value === "object" &&
    prev.value !== null &&
    next.value !== null
  ) {
    if (next.time === prev.time) return prev.value as T
    const t = Math.min(
      Math.max((currentTime - prev.time) / (next.time - prev.time), 0),
      1,
    )
    return interpolateObject(
      prev.value as Record<string, unknown>,
      next.value as Record<string, unknown>,
      t,
    ) as T
  }

  // If no interpolation possible, return previous value
  return prev.value as T
}
