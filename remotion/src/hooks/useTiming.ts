import { useCurrentFrame, useVideoConfig } from "remotion"
import { getTiming } from "@/utils/getTiming"
import type { Timing } from "@/schemas/timing"

/**
 * React hook to compute timing information for an animation segment at the current video frame.
 * Uses Remotion's useCurrentFrame and useVideoConfig for timing.
 *
 * @param timing The timing configuration (start, end, duration). Peut être undefined ou partiel.
 * @returns Un objet avec startFrame, endFrame, totalFrames, startSec, endSec, currentTime, progress, visible.
 */
export function useTiming(timing?: Partial<Timing>) {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const start = timing?.start ?? 0
  const duration = timing?.duration ?? 0

  return getTiming(frame, fps, durationInFrames, start, duration)
}
