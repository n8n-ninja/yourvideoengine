import React from "react"
import { Sequence, useVideoConfig } from "remotion"
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
      ? getPosition(element.position)
      : {}

  const containerStyle = (element as any).containerStyle ?? {}

  if (!timing.visible) return null

  const renderVisualElement = (key: ElementType, child: React.ReactNode) => {
    return (
      <Sequence from={timing.startFrame} durationInFrames={timing.totalFrames}>
        <div
          style={{ ...transitionStyle, ...positionStyle, ...containerStyle }}
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
