import { useCurrentFrame, useVideoConfig } from "remotion"
import { getKeyframeValue } from "@/utils/getKeyframes"
import { Keyframe } from "@/schemas"

export function useKeyframes<T = number | Record<string, unknown>>(
  keyframes: Keyframe<T>[],
  totalDurationSec?: number,
): T | undefined {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const currentTime = frame / fps
  const duration = totalDurationSec ?? durationInFrames / fps
  return getKeyframeValue(keyframes, currentTime, duration)
}
