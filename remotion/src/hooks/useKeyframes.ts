import { useCurrentFrame, useVideoConfig } from "remotion"
import { getKeyframeValue } from "@/utils/getKeyframes"
import { Keyframe } from "@/schemas/index_2"

/**
 * React hook to get the interpolated value from a list of keyframes at the current video time.
 * Uses Remotion's useCurrentFrame and useVideoConfig for timing.
 *
 * @template T The type of the keyframe value (number or object).
 * @param keyframes Array of keyframes with time and value.
 * @param totalDurationSec Optional total duration in seconds (defaults to video duration).
 * @returns The interpolated value at the current time, or undefined if no keyframes.
 */
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
