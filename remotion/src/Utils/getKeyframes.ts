import { Keyframe } from "@/schemas"
import { lerp, interpolateObject } from "./math"

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
