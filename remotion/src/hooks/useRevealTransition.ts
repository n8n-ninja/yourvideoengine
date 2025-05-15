import { useProgressEasing } from "../hooks/useProgressEasing"
import { getRevealTransitionStyle } from "@/utils/getRevealTransition"
import { TransitionReveal } from "@/schemas"

export function useRevealTransition({
  transition = {},
  startFrame = 0,
  endFrame = 1,
}: {
  transition?: TransitionReveal
  startFrame: number
  endFrame: number
}) {
  const { phase, progressIn, progressOut } = useProgressEasing({
    transition,
    startFrame,
    endFrame,
  })

  const style = getRevealTransitionStyle({
    transition,
    phase,
    progressIn,
    progressOut,
  })

  return { style }
}
