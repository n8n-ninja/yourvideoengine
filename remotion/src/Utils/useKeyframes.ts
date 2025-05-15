import { useCurrentFrame, useVideoConfig } from "remotion"

export type Keyframe<T = number | Record<string, unknown>> = {
  time: number // en secondes (peut être négatif)
  value: T
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function interpolateObject(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  t: number,
): Record<string, unknown> {
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

export function useKeyframes<T = number | Record<string, unknown>>(
  keyframes: Keyframe<T>[],
  totalDurationSec?: number,
): T | undefined {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const currentTime = frame / fps
  const duration = totalDurationSec ?? durationInFrames / fps

  console.log(durationInFrames)

  if (!keyframes.length) return undefined
  // Résolution des temps négatifs (en secondes)
  const resolved = keyframes.map((kf) => ({
    ...kf,
    time: kf.time < 0 ? duration + kf.time : kf.time,
  }))
  const sorted = [...resolved].sort((a, b) => a.time - b.time)

  // Trouver les deux keyframes entourant le temps courant
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

  // Si pas d'interpolation possible, retourne la valeur précédente
  return prev.value as T
}
