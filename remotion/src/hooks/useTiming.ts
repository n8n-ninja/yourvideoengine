import { useCurrentFrame, useVideoConfig } from "remotion"
import { getTiming } from "@/utils/getTiming"
import type { Timing } from "@/schemas/project"

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
  const currentTime = frame / fps
  const start = timing?.start ?? 0
  const end = timing?.end
  const duration = timing?.duration ?? durationInFrames / fps
  return getTiming(currentTime, fps, durationInFrames, { start, end, duration })
}
