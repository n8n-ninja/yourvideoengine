import { useMemo } from "react"
import { z } from "zod"
import { getEasingFn } from "@/Utils/time"
import { applyAnimationToStyle } from "@/Utils/style"

export const TRANSITION_TYPES = [
  "fade",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
] as const

export type TransitionType = (typeof TRANSITION_TYPES)[number]

export type UseTransitionProps = {
  start: number
  end?: number
  duration?: number
  inDuration?: number
  outDuration?: number
  easing?: string
  type?: TransitionType
  currentTime: number
}

export function useTransition({
  start,
  end,
  duration,
  inDuration = 0,
  outDuration = 0,
  easing = "linear",
  type = "fade",
  currentTime,
}: UseTransitionProps) {
  // Calcul du timing
  const resolvedEnd =
    end ?? (duration !== undefined ? start + duration : start + 1)
  const inEnd = start + inDuration
  const outStart = resolvedEnd - outDuration
  const visible = currentTime >= start && currentTime < resolvedEnd

  // Progress global (0 = avant, 1 = après in, 0 = après out)
  let progress = 1
  if (inDuration > 0 && currentTime < inEnd) {
    progress = Math.min(1, Math.max(0, (currentTime - start) / inDuration))
  } else if (outDuration > 0 && currentTime > outStart) {
    progress = Math.max(0, 1 - (currentTime - outStart) / outDuration)
  } else if (currentTime < start) {
    progress = 0
  } else if (currentTime >= resolvedEnd) {
    progress = 0
  } else {
    progress = 1
  }

  // Easing
  const eased = getEasingFn(easing)(progress)

  // Style selon le type
  const style = useMemo(() => {
    const s: Record<string, number | string> = {}
    if (type === "fade") {
      s.opacity = eased
    } else if (type === "slide-up") {
      s.opacity = eased
      s.translateY = (1 - eased) * 40
    } else if (type === "slide-down") {
      s.opacity = eased
      s.translateY = (eased - 1) * 40
    } else if (type === "slide-left") {
      s.opacity = eased
      s.translateX = (1 - eased) * 40
    } else if (type === "slide-right") {
      s.opacity = eased
      s.translateX = (eased - 1) * 40
    }
    return s
  }, [eased, type])

  return useMemo(
    () => ({
      visible,
      progress,
      style: applyAnimationToStyle({}, style),
    }),
    [visible, progress, style],
  )
}

export const TransitionSchema = z.object({
  start: z.number(),
  end: z.number().optional(),
  duration: z.number().optional(),
  inDuration: z.number().optional(),
  outDuration: z.number().optional(),
  easing: z.string().optional(),
  type: z.enum(TRANSITION_TYPES).optional(),
})
