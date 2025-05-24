import React from "react"
import { Sequence, useCurrentFrame } from "remotion"
import { TimelineElement } from "@/schemas/timeline-element"
import { Camera } from "./Camera"
import { Caption } from "./Caption"
import { Audio } from "./Audio"
import { Title } from "./Title"
import { useTiming } from "@/hooks/useTiming"
import { getPosition } from "@/utils/getPosition"
import { Image } from "./Image"
import { applyEffects } from "@/utils/effects"
import { parseStyleString } from "@/utils/getStyle"
import { timelineElementContainerStyle } from "@/styles/default-style"
import { useKeyframes } from "@/hooks/useKeyframes"
import { useElementReveal } from "@/hooks/useElementReveal"
import type { Position } from "@/schemas/position"

const getPositionStyle = (position?: Position) => {
  if (position) {
    const basePosition = getPosition(position)
    const keyframes = position.keyframes
    if (!keyframes?.length) return basePosition
    const interpolated: Record<string, number | string> =
      useKeyframes<Record<string, number | string>>(keyframes) || {}
    return getPosition({ ...position, ...interpolated })
  }
  return getPosition({})
}

// Composant de routage dédié
const TimelineElementRouter: React.FC<{
  element: TimelineElement
  revealProgress?: number
}> = ({ element, revealProgress }) => {
  switch (element.type) {
    case "camera":
      return <Camera camera={element} />
    case "caption":
      return <Caption captions={element} />
    case "title":
      return <Title title={element} />
    case "audio":
      return <Audio audio={element} revealProgress={revealProgress} />
    case "image":
      return <Image image={element} />
    default:
      return null
  }
}

export const TimelineElementRenderer: React.FC<{
  element: TimelineElement
}> = ({ element }) => {
  const frame = useCurrentFrame()
  const timing = useTiming(element.timing)
  const { style: transitionStyle, revealProgress } = useElementReveal({
    reveal: element.reveal,
    timing: timing,
  })
  const positionStyle = element.position
    ? getPositionStyle(element.position)
    : {}
  const rawContainerStyle = (element as { containerStyle?: string })
    .containerStyle
  const containerStyle =
    typeof rawContainerStyle === "string"
      ? parseStyleString(rawContainerStyle)
      : (rawContainerStyle ?? {})
  const effects = (element as any).effects
  const styleWithEffects = applyEffects(effects, frame)
  if (!timing.visible) return null
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
        <TimelineElementRouter
          element={element}
          revealProgress={revealProgress}
        />
      </div>
    </Sequence>
  )
}
