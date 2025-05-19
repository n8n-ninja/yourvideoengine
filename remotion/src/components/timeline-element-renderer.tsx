import React from "react"
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion"
import { TimelineElementSchema } from "@/schemas/timeline"
import { Camera } from "./Camera"
import { Caption } from "./Caption"
import { Sound } from "./Sound"
// import { Overlay } from './Overlay' // à ajouter plus tard
import { Title } from "./Title"
import { useTiming } from "@/hooks/useTiming"
import { useRevealTransition } from "@/hooks/useRevealTransition"
import { getPosition } from "@/utils/getPosition"
// TypeScript type
import type { z } from "zod"
import type { Transition } from "@/schemas/transition"
import type { TransitionReveal } from "@/schemas/transition-reveal"

// Helper pour convertir une transition générique en TransitionReveal compatible
const toRevealTransition = (
  transition: Transition | undefined,
): TransitionReveal => {
  if (!transition) return {}
  // Mappe les types connus
  if (transition.type === "fade") {
    return { type: "fade", duration: transition.duration }
  }
  if (transition.type === "slide") {
    // Par défaut slide-left, ou mappe direction si dispo
    let slideType: TransitionReveal["type"] = "slide-left"
    if (transition.direction === "from-right") slideType = "slide-right"
    if (transition.direction === "from-top") slideType = "slide-up"
    if (transition.direction === "from-bottom") slideType = "slide-down"
    return { type: slideType, duration: transition.duration }
  }
  // Les types suivants ne sont pas dans TransitionSchema, donc on ne les traite pas ici
  // if (
  //   transition.type === "zoom-in" ||
  //   transition.type === "zoom-out" ||
  //   transition.type === "blur"
  // ) {
  //   return { type: transition.type, duration: transition.duration }
  // }
  // fallback: pas de transition visuelle
  return {}
}

// Helper pour le rendu d'un élément
export const TimelineElementRenderer: React.FC<{
  element: z.infer<typeof TimelineElementSchema>
}> = ({ element }) => {
  const { fps, durationInFrames } = useVideoConfig()

  const timing = useTiming(
    element.timing
      ? {
          start: element.timing.start ?? 0,
          end: element.timing.end,
          duration: element.timing.duration,
        }
      : {
          start: 0,
          duration: durationInFrames / fps,
        },
  )
  const revealTransition = toRevealTransition(
    element.transition as Transition | undefined,
  )
  const { style: transitionStyle } = useRevealTransition({
    transition: revealTransition,
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })

  // Position (pour les éléments visuels)
  const positionStyle =
    "position" in element && element.position
      ? getPosition(element.position)
      : {}

  if (!timing.visible) return null

  // Dispatch sur le bon composant métier
  switch (element.type) {
    case "camera":
      return (
        <Sequence
          from={timing.startFrame}
          durationInFrames={timing.totalFrames}
        >
          <div style={{ ...transitionStyle, ...positionStyle }}>
            <Camera {...element} />
          </div>
        </Sequence>
      )
    case "caption":
      return (
        <Sequence
          from={timing.startFrame}
          durationInFrames={timing.totalFrames}
        >
          <AbsoluteFill style={{ ...transitionStyle, ...positionStyle }}>
            <Caption captions={element} />
          </AbsoluteFill>
        </Sequence>
      )
    case "title":
      return (
        <Sequence
          from={timing.startFrame}
          durationInFrames={timing.totalFrames}
        >
          <AbsoluteFill style={{ ...transitionStyle, ...positionStyle }}>
            <Title titles={[element]} />
          </AbsoluteFill>
        </Sequence>
      )
    case "sound":
      return (
        <Sequence
          from={timing.startFrame}
          durationInFrames={timing.totalFrames}
        >
          <Sound sounds={[element]} />
        </Sequence>
      )
    // case 'overlay':
    //   return ...
    default:
      return null
  }
}
