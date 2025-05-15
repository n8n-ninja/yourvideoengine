import { useCurrentFrame, useVideoConfig } from "remotion"
import { getTiming } from "@/utils/getTiming"
import { Timing } from "@/schemas"

/**
 * React hook to compute timing information for an animation segment at the current video frame.
 * Uses Remotion's useCurrentFrame and useVideoConfig for timing.
 *
 * @param timing The timing configuration (start, end, duration).
 * @returns An object with startFrame, endFrame, totalFrames, startSec, endSec, currentTime, progress, and visible.
 */
export function useTiming({ start, end, duration }: Timing) {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const currentTime = frame / fps

  return getTiming(currentTime, fps, durationInFrames, { start, end, duration })
}
