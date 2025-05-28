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
  frame: number,
  fps: number,
  durationInFrames: number,
  start: number,
  duration: number,
) {
  const currentTime = frame / fps

  const totalDurationSec = durationInFrames / fps
  let startSec = start >= 0 ? start : totalDurationSec + start
  let endSec: number
  if (duration === 0) {
    endSec = totalDurationSec
  } else if (duration > 0) {
    endSec = startSec + duration
  } else {
    endSec = totalDurationSec + duration
  }
  // Clamp startSec et endSec dans [0, totalDurationSec]
  startSec = Math.max(0, Math.min(totalDurationSec, startSec))
  endSec = Math.max(0, Math.min(totalDurationSec, endSec))
  // startSec ne peut pas être après endSec
  if (startSec >= endSec) {
    startSec = Math.max(0, endSec - 1 / fps)
  }
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
