import { TimingSchema } from "@/schemas/timing"
import { z } from "zod"

/**
 * Computes timing information for an animation segment based on start, end, and duration.
 * Handles negative (relative) start/end values, and returns frame/second boundaries, progress, and visibility.
 *
 * @param currentTime The current time (in seconds).
 * @param fps Frames per second.
 * @param durationInFrames Total duration in frames.
 * @param timing Timing configuration (start, end, duration) from TimingSchema.
 * @returns An object with startFrame, endFrame, totalFrames, startSec, endSec, currentTime, progress, and visible.
 */
export function getTiming(
  currentTime: number,
  fps: number,
  durationInFrames: number,
  { start, end, duration }: z.infer<typeof TimingSchema>,
) {
  // Convertit start/end relatifs (négatifs) en absolus (secondes)
  const totalDurationSec = durationInFrames / fps
  const startSec = start < 0 ? totalDurationSec + start : start
  let endSec: number
  if (typeof duration === "number") {
    endSec = startSec + duration
  } else if (typeof end === "number") {
    endSec = end < 0 ? totalDurationSec + end : end
  } else {
    endSec = totalDurationSec
  }

  // Frame de début et de fin
  const startFrame = Math.round(startSec * fps)
  const endFrame = Math.round(endSec * fps)
  const totalFrames = Math.max(0, endFrame - startFrame)

  // Progress (0 avant, 1 après, linéaire entre start et end)
  let progress = 0
  if (currentTime <= startSec) progress = 0
  else if (currentTime >= endSec) progress = 1
  else progress = (currentTime - startSec) / (endSec - startSec)

  // Visible ?
  const visible = currentTime >= startSec && currentTime < endSec

  return {
    startFrame,
    endFrame,
    totalFrames,
    startSec,
    endSec,
    currentTime,
    progress,
    visible,
  }
}
