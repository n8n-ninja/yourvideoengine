import { useCurrentFrame, interpolate, useVideoConfig, Easing } from "remotion"
import { z } from "zod"

export const TRANSITION_TYPES = [
  "fade",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "zoom-in",
  "zoom-out",
  "blur",
] as const

export type TransitionType = (typeof TRANSITION_TYPES)[number]

export const TransitionSchema = z.object({
  type: z.enum(TRANSITION_TYPES).optional(),
  easing: z.string().optional(),
  duration: z.number().optional(),

  inType: z.enum(TRANSITION_TYPES).optional(),
  inEasing: z.string().optional(),
  inDuration: z.number().optional(),

  outType: z.enum(TRANSITION_TYPES).optional(),
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

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

function getBlur(type: string, progress: number) {
  if (type !== "blur") return undefined
  progress = clamp(progress, 0, 1)
  return `blur(${20 * (1 - progress)}px)`
}

// Helpers for transform
function getTransform(type: string, progress: number) {
  // Clamp progress entre 0 et 1
  progress = clamp(progress, 0, 1)
  switch (type) {
    case "slide-up":
      return `translateY(${clamp((1 - progress) * 40, -100, 100)}%)`
    case "slide-down":
      return `translateY(${clamp((progress - 1) * 40, -100, 100)}%)`
    case "slide-left":
      return `translateX(${clamp((1 - progress) * 40, -100, 100)}%)`
    case "slide-right":
      return `translateX(${clamp((progress - 1) * 40, -100, 100)}%)`
    case "zoom-in":
      return `scale(${clamp(0.5 + 0.5 * progress, 0.01, 5)})`
    case "zoom-out":
      return `scale(${clamp(0.5 + (1 - 0.5 * progress), 0.01, 5)})`
    case "blur":
      return undefined
    default:
      return undefined
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

export function useTransition({
  transition = {},
  startFrame = 0,
  endFrame = 1,
}: {
  transition?: z.infer<typeof TransitionSchema>
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

  // Types & easings
  const inType = transition.inType ?? transition.type ?? "fade"
  const outType = transition.outType ?? transition.type ?? "fade"
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

  // Style
  const style: React.CSSProperties = {}
  if (phase === "in") {
    style.opacity = progressIn
    style.transform = getTransform(inType, progressIn)
    style.filter = getBlur(inType, progressIn)
  } else if (phase === "out") {
    style.opacity = progressOut
    style.transform = getTransform(outType, progressOut)
    style.filter = getBlur(outType, progressOut)
  } else {
    style.opacity = 1
    style.transform = "none"
    style.filter = "none"
  }

  return style
}
