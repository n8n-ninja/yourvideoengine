import { useCurrentFrame, useVideoConfig } from "remotion"
import { getProgressEasing } from "@/utils/getProgressEasing"
import { ProgressEasing } from "@/schemas"

/**
 * React hook to compute progress and phase for an animation with easing at the current video frame.
 * Uses Remotion's useCurrentFrame and useVideoConfig for timing.
 *
 * @param params.transition The transition configuration (ProgressEasing).
 * @param params.startFrame The start frame of the animation.
 * @param params.endFrame The end frame of the animation.
 * @returns An object with phase ('in' | 'steady' | 'out'), progressIn, and progressOut (numbers between 0 and 1).
 */
export function useProgressEasing({
  transition = {},
  startFrame = 0,
  endFrame = 1,
}: {
  transition?: ProgressEasing
  startFrame: number
  endFrame: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return getProgressEasing({ transition, startFrame, endFrame, frame, fps })
}
