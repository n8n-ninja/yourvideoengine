import { useProgressEasing } from "../hooks/useProgressEasing"
import { getRevealTransitionStyle } from "@/utils/getRevealTransition"
import { TransitionReveal } from "@/schemas"

/**
 * React hook to compute the CSS style for a reveal transition at the current video frame.
 * Combines useProgressEasing and getRevealTransitionStyle.
 *
 * @param params.transition The reveal transition configuration (TransitionReveal).
 * @param params.startFrame The start frame of the transition.
 * @param params.endFrame The end frame of the transition.
 * @returns An object with a style property (React.CSSProperties) for the transition.
 */
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
