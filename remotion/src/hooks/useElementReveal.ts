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
    ("type" in (reveal as any) ||
      "inType" in (reveal as any) ||
      "outType" in (reveal as any))
  ) {
    const r = reveal as Record<string, any>
    return {
      inType: allowedTypes.includes(r.inType)
        ? r.inType
        : allowedTypes.includes(r.type)
          ? r.type
          : undefined,
      outType: allowedTypes.includes(r.outType)
        ? r.outType
        : allowedTypes.includes(r.type)
          ? r.type
          : undefined,
      inDuration: r.inDuration ?? r.duration,
      outDuration: r.outDuration ?? r.duration,
      inEasing: r.inEasing ?? r.easing,
      outEasing: r.outEasing ?? r.easing,
      // On garde aussi les props globales si jamais utilisées ailleurs
      type: allowedTypes.includes(r.type) ? r.type : undefined,
      duration: r.duration,
      easing: r.easing,
      // Ajoute les autres props éventuelles du reveal
      ...Object.fromEntries(
        Object.entries(r).filter(
          ([k]) =>
            ![
              "inType",
              "outType",
              "inDuration",
              "outDuration",
              "inEasing",
              "outEasing",
              "type",
              "duration",
              "easing",
            ].includes(k),
        ),
      ),
    }
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
