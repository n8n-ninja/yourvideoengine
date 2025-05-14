// time.ts - Utilities for relative time management in Remotion
//
// Provides helpers to convert relative time values (positive = from start, negative = from end)
// and to compute frame ranges for sequences or effects.
//
// Usage:
//   import { resolveTime, useResolveTime, getTimeRange, useTimeRange } from "@/Utils/time"
//
// - resolveTime: pure function, converts a relative time to an absolute time (in seconds)
// - useResolveTime: React hook, same as resolveTime but uses current video config
// - getTimeRange: pure function, computes {from, frames, startSec, endSec} for a segment
// - useTimeRange: React hook, same as getTimeRange but uses current video config
//
// TODO: Add unit tests for all helpers

import { useVideoConfig } from "remotion"
import { Easing } from "remotion"

/**
 * Clamp a value between min and max.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

/**
 * Shared type for time range input.
 */
export type TimeRangeInput = {
  start: number
  end?: number
  duration?: number
}

/**
 * Converts a relative time value to an absolute time (in seconds).
 * Positive values are from the start, negative values are from the end.
 *
 * @param value - The relative time (seconds)
 * @param fps - Frames per second
 * @param durationInFrames - Total duration in frames
 * @returns The absolute time in seconds
 */
export function resolveTime(
  value: number,
  fps: number,
  durationInFrames: number,
): number {
  const totalDuration = durationInFrames / fps
  return value < 0 ? totalDuration + value : value
}

/**
 * React hook: Converts a relative time value to an absolute time (in seconds),
 * using the current video config (fps, durationInFrames).
 *
 * @param value - The relative time (seconds)
 * @returns The absolute time in seconds, or 0 if config is invalid
 */
export function useResolveTime(value: number) {
  const { fps, durationInFrames } = useVideoConfig()
  if (
    !Number.isFinite(fps) ||
    !Number.isFinite(durationInFrames) ||
    fps <= 0 ||
    durationInFrames <= 0
  ) {
    console.warn("[useResolveTime] Invalid fps or durationInFrames", {
      fps,
      durationInFrames,
    })
    return 0
  }
  return resolveTime(value, fps, durationInFrames)
}

/**
 * Computes the start frame (from), duration in frames (frames), and start/end in seconds for a segment,
 * given a start, end, and/or duration (all in seconds), and the video config.
 *
 * @param start - Start time (seconds, relative: positive = from start, negative = from end)
 * @param end - Optional end time (seconds, relative)
 * @param duration - Optional duration (seconds, takes precedence over end)
 * @param fps - Frames per second
 * @param durationInFrames - Total duration in frames
 * @returns { from, frames, startSec, endSec } - start frame, duration in frames, and start/end in seconds
 */
export function getTimeRange({
  start,
  end,
  duration,
  fps,
  durationInFrames,
}: TimeRangeInput & { fps: number; durationInFrames: number }) {
  if (!Number.isFinite(start)) {
    console.warn("[getTimeRange] start is not a finite number", start)
    return { from: 0, frames: 0, startSec: 0, endSec: 0 }
  }
  if (
    !Number.isFinite(fps) ||
    !Number.isFinite(durationInFrames) ||
    fps <= 0 ||
    durationInFrames <= 0
  ) {
    console.warn("[getTimeRange] Invalid fps or durationInFrames", {
      fps,
      durationInFrames,
    })
    return { from: 0, frames: 0, startSec: 0, endSec: 0 }
  }
  const totalDuration = durationInFrames / fps
  const startSec = resolveTime(start, fps, durationInFrames)
  let from = Math.round(startSec * fps)
  if (!Number.isFinite(from)) {
    console.warn("[getTimeRange] from is NaN", { start, startSec, fps })
    from = 0
  }
  let frames: number
  let endSec: number
  if (typeof duration === "number") {
    frames = Math.round(duration * fps)
    endSec = startSec + duration
  } else if (typeof end === "number") {
    endSec = resolveTime(end, fps, durationInFrames)
    frames = Math.round((endSec - startSec) * fps)
  } else {
    endSec = totalDuration
    frames = durationInFrames - from
  }
  frames = clamp(frames, 0, durationInFrames - from)
  if (!Number.isFinite(frames)) {
    console.warn("[getTimeRange] frames is NaN", {
      start,
      end,
      duration,
      fps,
      durationInFrames,
    })
    frames = 0
  }
  return { from, frames, startSec, endSec }
}

/**
 * React hook: Computes the start frame (from), duration in frames (frames), and start/end in seconds for a segment,
 * using the current video config (fps, durationInFrames).
 *
 * @param start - Start time (seconds, relative: positive = from start, negative = from end)
 * @param end - Optional end time (seconds, relative)
 * @param duration - Optional duration (seconds, takes precedence over end)
 * @returns { from, frames, startSec, endSec } - start frame, duration in frames, and start/end in seconds
 */
export function useTimeRange({ start, end, duration }: TimeRangeInput) {
  const { fps, durationInFrames } = useVideoConfig()
  return getTimeRange({ start, end, duration, fps, durationInFrames })
}

/**
 * Interpolates between two numeric values (linear interpolation by default).
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function interpolateValue(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Returns an easing function by name. Supports 'linear', 'easeIn', 'easeOut', 'easeInOut'.
 * Defaults to linear if unknown.
 */
export function getEasingFn(easingName?: string): (x: number) => number {
  if (!easingName || easingName === "linear") return (x) => x
  if (easingName === "easeIn") return Easing.in(Easing.ease)
  if (easingName === "easeOut") return Easing.out(Easing.ease)
  if (easingName === "easeInOut") return Easing.inOut(Easing.ease)
  // Add more custom easings here if needed
  return (x) => x
}

/**
 * Interpolates between two objects of numbers/strings, given a progress (0-1).
 * For numbers: linear interpolation. For strings: switches at halfway.
 */
export function interpolate(
  from: Record<string, number | string>,
  to: Record<string, number | string>,
  progress: number,
): Record<string, number | string> {
  const out: Record<string, number | string> = {}
  for (const key in from) {
    if (typeof from[key] === "number" && typeof to[key] === "number") {
      out[key] = from[key] + (to[key] - from[key]) * progress
    } else if (typeof from[key] === "string" && typeof to[key] === "string") {
      out[key] = progress < 0.5 ? from[key] : to[key]
    }
  }
  return out
}
