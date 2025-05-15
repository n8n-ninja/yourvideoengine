import { z } from "zod"
import { useProgressEasing } from "./useProgressEasing"
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

export function useRevealTransition({
  transition = {},
  startFrame = 0,
  endFrame = 1,
}: {
  transition?: z.infer<typeof TransitionSchema>
  startFrame: number
  endFrame: number
}) {
  const { phase, progressIn, progressOut } = useProgressEasing({
    transition,
    startFrame,
    endFrame,
  })

  const inType = transition.inType ?? transition.type ?? "fade"
  const outType = transition.outType ?? transition.type ?? "fade"

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

  return { style }
}
