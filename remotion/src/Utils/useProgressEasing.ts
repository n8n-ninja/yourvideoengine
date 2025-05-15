import { useCurrentFrame, interpolate, useVideoConfig, Easing } from "remotion"
import { z } from "zod"

export const ProgressEasingSchema = z.object({
  easing: z.string().optional(),
  duration: z.number().optional(),

  inEasing: z.string().optional(),
  inDuration: z.number().optional(),

  outEasing: z.string().optional(),
  outDuration: z.number().optional(),
})

function getEasingFn(easing?: string) {
  switch (easing) {
    case "easeIn":
      return Easing.in(Easing.ease)
    case "easeOut":
      return Easing.out(Easing.ease)
    case "easeInOut":
      return Easing.inOut(Easing.ease)
    case "linear":
    default:
      return Easing.linear
  }
}

function getBounds(
  startFrame: number,
  inDuration: number,
  totalFrames: number,
  outDuration: number,
) {
  const inEnd = Math.max(startFrame, startFrame + inDuration)
  let outStart = Math.max(0, totalFrames - outDuration)
  if (outStart < inEnd) outStart = inEnd + 1
  if (outStart > totalFrames) outStart = totalFrames - 1
  return { inEnd, outStart }
}

function getPhase(
  frame: number,
  inEnd: number,
  outStart: number,
): "in" | "steady" | "out" {
  if (frame < inEnd) return "in"
  if (frame >= outStart) return "out"
  return "steady"
}

function getProgress(
  frame: number,
  start: number,
  end: number,
  from: number,
  to: number,
  duration: number,
  easingFn: (x: number) => number,
) {
  const progress =
    duration > 0
      ? interpolate(frame, [start, end], [from, to], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : to
  return easingFn(progress)
}

export function useProgressEasing({
  transition = {},
  startFrame = 0,
  endFrame = 1,
}: {
  transition?: z.infer<typeof ProgressEasingSchema>
  startFrame: number
  endFrame: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Duration (in frames)
  const inDuration = Math.max(
    0,
    (transition.inDuration ?? transition.duration ?? 0) * fps,
  )
  const outDuration = Math.max(
    0,
    (transition.outDuration ?? transition.duration ?? 0) * fps,
  )

  // Easings
  const inEasingFn = getEasingFn(
    transition.inEasing ?? transition.easing ?? "easeInOut",
  )
  const outEasingFn = getEasingFn(
    transition.outEasing ?? transition.easing ?? "easeInOut",
  )

  // Bounds
  const { inEnd, outStart } = getBounds(
    startFrame,
    inDuration,
    endFrame,
    outDuration,
  )

  // Progress in/out
  const progressIn = getProgress(
    frame,
    startFrame,
    inEnd,
    0,
    1,
    inDuration,
    inEasingFn,
  )
  const progressOut = getProgress(
    frame,
    outStart,
    endFrame,
    1,
    0,
    outDuration,
    outEasingFn,
  )

  // Phase
  const phase = getPhase(frame, inEnd, outStart)

  return {
    phase,
    progressIn,
    progressOut,
  }
}
