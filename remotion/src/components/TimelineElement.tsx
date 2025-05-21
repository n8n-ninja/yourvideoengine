import React from "react"
import { Sequence, useVideoConfig, useCurrentFrame } from "remotion"
import { TimelineElementSchema } from "@/schemas/timeline"
import { Camera } from "./Camera"
import { Caption } from "./Caption"
import { Sound } from "./Sound"
import { Overlay } from "./Overlay"
import { Title } from "./Title"
import { useTiming } from "@/hooks/useTiming"
import { useRevealTransition } from "@/hooks/useRevealTransition"
import { getPosition } from "@/utils/getPosition"
import { TRANSITION_REVEAL_TYPES } from "@/schemas/transition-reveal"
import type { z } from "zod"
import { Overlay as OverlayType } from "@/schemas/overlay"
import { Image } from "./Image"
import { applyEffects } from "@/utils/effects"
import { parseStyleString } from "@/utils/getStyle"
import { timelineElementContainerStyle } from "@/styles/default-style"
import { useKeyframes } from "@/hooks/useKeyframes"

const elementComponentMap = {
  camera: (element: any) => <Camera {...element} />,
  caption: (element: any) => <Caption captions={element} />,
  title: (element: any) => <Title title={element} />,
  sound: (element: any) => <Sound sounds={[element]} />,
  scanline: (element: any) => <Overlay overlay={element as OverlayType} />,
  vignette: (element: any) => <Overlay overlay={element as OverlayType} />,
  color: (element: any) => <Overlay overlay={element as OverlayType} />,
  image: (element: any) => <Image image={element} />,
} as const

type ElementType = keyof typeof elementComponentMap

// Typage propre pour containerStyle
type TimelineElementWithStyle = z.infer<typeof TimelineElementSchema> & {
  containerStyle?: React.CSSProperties | string
}

export const TimelineElementRenderer: React.FC<{
  element: TimelineElementWithStyle
}> = ({ element }) => {
  const { fps, durationInFrames } = useVideoConfig()
  const frame = useCurrentFrame()

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

  const allowedRevealTypes = [...TRANSITION_REVEAL_TYPES]

  const safeRevealTransition =
    element.transition &&
    typeof element.transition === "object" &&
    allowedRevealTypes.includes((element.transition as any).type)
      ? (element.transition as any)
      : {}

  const { style: transitionStyle } = useRevealTransition({
    transition: safeRevealTransition,
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })

  const positionStyle =
    "position" in element && element.position
      ? (() => {
          const basePosition = getPosition(element.position)
          const keyframes = element.position.keyframes
          if (!keyframes?.length) return basePosition

          const interpolated: Record<string, number | string> =
            useKeyframes<Record<string, number | string>>(keyframes) || {}
          return getPosition({ ...element.position, ...interpolated })
        })()
      : getPosition({})

  const rawContainerStyle = element.containerStyle
  const containerStyle =
    typeof rawContainerStyle === "string"
      ? parseStyleString(rawContainerStyle)
      : (rawContainerStyle ?? {})

  // Appliquer les effets si présents
  const effects = (element as any).effects
  const styleWithEffects = applyEffects(effects, frame)

  if (!timing.visible) return null

  const renderVisualElement = (key: ElementType, child: React.ReactNode) => {
    return (
      <Sequence from={timing.startFrame} durationInFrames={timing.totalFrames}>
        <div
          style={{
            ...timelineElementContainerStyle,
            ...transitionStyle,
            ...positionStyle,
            ...containerStyle,
            ...styleWithEffects,
          }}
        >
          {child}
        </div>
      </Sequence>
    )
  }

  const type = element.type as ElementType
  if (type in elementComponentMap) {
    return renderVisualElement(type, elementComponentMap[type](element))
  }

  return null
}
