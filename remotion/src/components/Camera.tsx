import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion"
import { z } from "zod"
import React, { useMemo } from "react"
import { resolveTime } from "@/Utils/time"
import { interpolateValue, getEasingFn } from "@/Utils/time"
import { parseFilter, buildFilter } from "@/Utils/filter"

/**
 * CameraSchema: zod schema for camera props validation.
 */
export const CameraSchema = z.object({
  videoUrl: z.string(),
  keyframes: z.array(
    z.object({
      start: z.number(),
      scale: z.number().optional(),
      blur: z.number().optional(),
      top: z.number().optional(),
      left: z.number().optional(),
      easing: z.string().optional(),
      shake: z
        .object({
          duration: z.number(),
          intensity: z.number(),
        })
        .optional(),
      rotation: z.number().optional(),
      filter: z.string().optional(),
      mirror: z
        .object({
          horizontal: z.boolean().optional(),
          vertical: z.boolean().optional(),
        })
        .optional(),
    }),
  ),
})

// Type for a resolved keyframe (with absTime)
type ResolvedKeyframe = z.infer<typeof CameraSchema>["keyframes"][number] & {
  absTime: number
}

/**
 * Hook to interpolate between keyframes for camera movement and effects.
 */
function useCameraInterpolation({
  keyframes,
  fps,
  durationInFrames,
  frame,
}: {
  keyframes: z.infer<typeof CameraSchema>["keyframes"]
  fps: number
  durationInFrames: number
  frame: number
}) {
  // --- Resolve relative keyframe times to absolute seconds (memoized) ---
  const resolvedKeyframes: ResolvedKeyframe[] = useMemo(
    () =>
      keyframes
        .map((kf) => ({
          ...kf,
          absTime: resolveTime(kf.start, fps, durationInFrames),
        }))
        .sort((a, b) => a.absTime - b.absTime),
    [keyframes, fps, durationInFrames],
  )

  const currentTime = frame / fps

  // --- Find the two keyframes to interpolate between ---
  let prev = resolvedKeyframes[0]
  let next = resolvedKeyframes[resolvedKeyframes.length - 1]
  for (let i = 0; i < resolvedKeyframes.length - 1; i++) {
    if (
      currentTime >= resolvedKeyframes[i].absTime &&
      currentTime < resolvedKeyframes[i + 1].absTime
    ) {
      prev = resolvedKeyframes[i]
      next = resolvedKeyframes[i + 1]
      break
    }
  }

  // --- Interpolation factor and easing ---
  let t = 0
  if (next.absTime !== prev.absTime) {
    t = (currentTime - prev.absTime) / (next.absTime - prev.absTime)
    t = Math.max(0, Math.min(1, t))
  }
  const easingName = next.easing || prev.easing || "linear"
  const easingFn = getEasingFn(easingName)
  const te = easingFn(t)

  // --- Interpolate scale, blur, rotation ---
  const prevScale = prev.scale ?? 1
  const nextScale = next.scale ?? prevScale
  const scale = interpolateValue(prevScale, nextScale, te)
  const prevBlur = prev.blur ?? 0
  const nextBlur = next.blur ?? 0
  const blur = interpolateValue(prevBlur, nextBlur, te)
  const prevRotation = prev.rotation ?? 0
  const nextRotation = next.rotation ?? prevRotation
  const baseRotation = interpolateValue(prevRotation, nextRotation, te)

  // --- Smooth filter interpolation between keyframes ---
  let prevFilterStr = ""
  let nextFilterStr = ""
  let prevFilterTime = 0
  let nextFilterTime = 0
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime && kf.filter) {
      prevFilterStr = kf.filter || ""
      prevFilterTime = kf.absTime
    }
    if (kf.absTime > currentTime && kf.filter) {
      nextFilterStr = kf.filter || ""
      nextFilterTime = kf.absTime
      break
    }
  }
  let filterString = ""
  if (prevFilterStr && nextFilterStr && nextFilterTime > prevFilterTime) {
    const tFilter =
      (currentTime - prevFilterTime) / (nextFilterTime - prevFilterTime)
    const prevObj = parseFilter(prevFilterStr)
    const nextObj = parseFilter(nextFilterStr)
    const keys = Array.from(
      new Set([...Object.keys(prevObj), ...Object.keys(nextObj)]),
    )
    const interp: Record<string, number> = {}
    for (const k of keys) {
      const a = prevObj[k] ?? 1
      const b = nextObj[k] ?? 1
      interp[k] = interpolateValue(a, b, tFilter)
    }
    filterString = buildFilter(interp)
  } else if (prevFilterStr) {
    filterString = prevFilterStr
  } else {
    filterString = ""
  }

  // --- Mirror effect ---
  let mirror = undefined as ResolvedKeyframe["mirror"] | undefined
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime && kf.mirror) {
      mirror = kf.mirror
    }
    if (kf.absTime > currentTime) break
  }
  let mirrorTransform = ""
  if (mirror) {
    if (mirror.horizontal && mirror.vertical) mirrorTransform = "scale(-1,-1)"
    else if (mirror.horizontal) mirrorTransform = "scaleX(-1)"
    else if (mirror.vertical) mirrorTransform = "scaleY(-1)"
  }

  return {
    scale,
    blur,
    baseRotation,
    filterString,
    mirrorTransform,
  }
}

/**
 * Hook to compute camera shake effect.
 */
function useCameraShake({
  keyframes,
  frame,
  currentTime,
}: {
  keyframes: ResolvedKeyframe[]
  frame: number
  currentTime: number
}) {
  // --- Camera shake effect (chaotic rotation, scale, blur) ---
  let shake = undefined as ResolvedKeyframe["shake"] | undefined
  for (let i = 0; i < keyframes.length; i++) {
    const kf = keyframes[i]
    if (kf.absTime <= currentTime && kf.shake) {
      const shakeEnd = kf.absTime + kf.shake.duration
      if (currentTime < shakeEnd) {
        shake = kf.shake
      } else {
        shake = undefined
      }
    }
    if (kf.absTime > currentTime) break
  }
  let shakeRotate = 0
  let shakeScale = 1
  let shakeBlur = 0
  if (shake) {
    const intensity = shake.intensity
    const baseFreq = 18 + intensity * 12
    const t = frame
    const rot = 2 + intensity * 6
    const scaleAmount = 0.03 * intensity
    const blurAmount = 6 * intensity
    shakeRotate =
      Math.sin(t * baseFreq * 0.13 + 42) * rot * 0.7 +
      Math.sin(t * (baseFreq * 0.21) + 13) * rot * 0.3 +
      Math.cos(t * (baseFreq * 0.17) + 99) * rot * 0.2
    shakeScale =
      1 +
      Math.abs(Math.sin(t * baseFreq * 0.07)) * scaleAmount * 0.7 +
      Math.abs(Math.cos(t * baseFreq * 0.11 + 13)) * scaleAmount * 0.5 +
      (random(`shake-scale-${frame}`) - 0.5) * scaleAmount * 0.2
    shakeBlur =
      Math.abs(Math.sin(t * baseFreq * 0.11 + 13)) * blurAmount * 0.7 +
      Math.abs(Math.cos(t * baseFreq * 0.19 + 7)) * blurAmount * 0.5 +
      (random(`shake-blur-${frame}`) - 0.5) * blurAmount * 0.2
  }
  return { shakeRotate, shakeScale, shakeBlur }
}

/**
 * Camera component: interpolates keyframes for camera movement and effects.
 */
export const Camera: React.FC<z.infer<typeof CameraSchema>> = ({
  videoUrl,
  keyframes,
}) => {
  // Runtime props validation in development
  if (process.env.NODE_ENV !== "production") {
    CameraSchema.parse({ videoUrl, keyframes })
  }

  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const currentTime = frame / fps

  // --- Camera interpolation (scale, blur, rotation, filter, mirror) ---
  const { scale, blur, baseRotation, filterString, mirrorTransform } =
    useCameraInterpolation({ keyframes, fps, durationInFrames, frame })

  // --- Camera shake effect ---
  const { shakeRotate, shakeScale, shakeBlur } = useCameraShake({
    keyframes: useMemo(
      () =>
        keyframes.map((kf) => ({
          ...kf,
          absTime: resolveTime(kf.start, fps, durationInFrames),
        })),
      [keyframes, fps, durationInFrames],
    ),
    frame,
    currentTime,
  })

  // --- Compose video style ---
  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: `scale(${scale * shakeScale}) rotate(${baseRotation + shakeRotate}deg)`,
    filter: `${filterString} blur(${blur + shakeBlur}px)`,
    transformOrigin: `50% 50%`,
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video
        src={videoUrl}
        style={{
          ...videoStyle,
          transform: `${videoStyle.transform} ${mirrorTransform}`.trim(),
        }}
      />
    </AbsoluteFill>
  )
}
