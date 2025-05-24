import { useRevealTransition } from "@/hooks/useRevealTransition"
import { useProgressEasing } from "@/hooks/useProgressEasing"
import { TRANSITION_REVEAL_TYPES } from "@/schemas/reveal"

export const getSafeRevealTransition = (
  reveal: unknown,
  allowedTypes: string[],
) => {
  if (
    reveal &&
    typeof reveal === "object" &&
    "type" in (reveal as any) &&
    allowedTypes.includes((reveal as any).type)
  ) {
    return reveal as Record<string, unknown>
  }
  return {}
}

export const useElementReveal = ({
  reveal,
  timing,
  allowedTypes = [...TRANSITION_REVEAL_TYPES] as string[],
}: {
  reveal: unknown
  timing: { startFrame: number; endFrame: number }
  allowedTypes?: string[]
}) => {
  const safeRevealTransition = getSafeRevealTransition(reveal, allowedTypes)
  const { style } = useRevealTransition({
    transition: safeRevealTransition,
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })
  const { phase, progressIn, progressOut } = useProgressEasing({
    transition: safeRevealTransition,
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })
  const revealProgress =
    phase === "in" ? progressIn : phase === "out" ? progressOut : 1
  return {
    style,
    phase,
    progressIn,
    progressOut,
    revealProgress,
    safeRevealTransition,
  }
}
