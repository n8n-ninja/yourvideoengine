import { TransitionReveal } from "@/schemas"
import { clamp } from "./math"

/**
 * Returns a CSS blur filter string if the type is 'blur', otherwise undefined.
 * @param type The transition type.
 * @param progress The progress value (0 to 1).
 * @returns A CSS blur string or undefined.
 */
function getBlur(type: string, progress: number) {
  if (type !== "blur") return undefined
  progress = clamp(progress, 0, 1)
  return `blur(${20 * (1 - progress)}px)`
}

/**
 * Returns a CSS transform string for the given transition type and progress.
 * @param type The transition type.
 * @param progress The progress value (0 to 1).
 * @returns A CSS transform string or undefined.
 */
function getTransform(type: string, progress: number) {
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

/**
 * Computes the CSS style for a reveal transition based on the phase and progress.
 * @param params.transition The transition configuration (TransitionReveal).
 * @param params.phase The current phase: 'in', 'steady', or 'out'.
 * @param params.progressIn The progress value for the 'in' phase (0 to 1).
 * @param params.progressOut The progress value for the 'out' phase (0 to 1).
 * @returns A React.CSSProperties object representing the style for the transition.
 */
export const getRevealTransitionStyle = ({
  transition = {},
  phase,
  progressIn,
  progressOut,
}: {
  transition?: TransitionReveal
  phase: "in" | "steady" | "out"
  progressIn: number
  progressOut: number
}): React.CSSProperties => {
  const inType = transition.inType ?? transition.type ?? "fade"
  const outType = transition.outType ?? transition.type ?? "fade"
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
