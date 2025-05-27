import React from "react"
import { Sequence, useCurrentFrame } from "remotion"

import { BlockType, EmojiBlockType } from "@/schemas/project"
import { Audio } from "./blocks/Audio"
import { Camera } from "./blocks/Camera"
import { Caption } from "./blocks/Caption"
import { Image } from "./blocks/Image"
import { Title } from "./blocks/Title"
import { Emoji } from "./blocks/Emoji"

import { useTiming } from "@/hooks/useTiming"

import { useElementReveal } from "@/hooks/useElementReveal"
import { applyEffects } from "@/utils/effects"
import { getPosition } from "@/utils/getPosition"
import { getStyle } from "@/utils/getStyle"

import { timelineElementContainerStyle } from "@/styles/default-style"

const LayerRouter: React.FC<{
  element: BlockType
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
    case "emoji":
      return <Emoji emoji={element as EmojiBlockType} />
    default:
      return null
  }
}

export const Block: React.FC<{
  element: BlockType
}> = ({ element }) => {
  const frame = useCurrentFrame()

  const timing = useTiming(element.timing)

  const { style: transitionStyle, revealProgress } = useElementReveal({
    reveal: element.reveal,
    timing: timing,
  })
  const positionStyle = getPosition(element.position)

  const rawContainerStyle = (
    element as { containerStyle?: string | Record<string, string | number> }
  ).containerStyle
  const containerStyle = getStyle(rawContainerStyle)
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
