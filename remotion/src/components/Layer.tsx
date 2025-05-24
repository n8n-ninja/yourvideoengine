import React from "react"
import { Sequence, useCurrentFrame } from "remotion"

import { LayerType } from "@/schemas/project"
import type { Position } from "@/schemas/position"

import { Audio } from "./Audio"
import { Camera } from "./Camera"
import { Caption } from "./Caption"
import { Image } from "./Image"
import { Title } from "./Title"

import { useTiming } from "@/hooks/useTiming"

import { useElementReveal } from "@/hooks/useElementReveal"
import { useKeyframes } from "@/hooks/useKeyframes"

import { applyEffects } from "@/utils/effects"
import { getPosition } from "@/utils/getPosition"
import { parseStyleString } from "@/utils/getStyle"

import { timelineElementContainerStyle } from "@/styles/default-style"

// Composant de routage dédié
const LayerRouter: React.FC<{
  element: LayerType
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

export const Layer: React.FC<{
  element: LayerType
}> = ({ element }) => {
  const frame = useCurrentFrame()
  const timing = useTiming(element.timing)
  const { style: transitionStyle, revealProgress } = useElementReveal({
    reveal: element.reveal,
    timing: timing,
  })
  const positionStyle = getPosition(element.position)

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
        <LayerRouter element={element} revealProgress={revealProgress} />
      </div>
    </Sequence>
  )
}
