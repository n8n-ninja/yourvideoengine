import React from "react"
import { Sequence, useCurrentFrame } from "remotion"

import { Effects } from "@/schemas/effect"
import { useTiming } from "@/hooks/useTiming"

import { useElementReveal } from "@/hooks/useElementReveal"
import { applyEffects } from "@/utils/effects"
import { getPosition } from "@/utils/getPosition"
import { getStyle } from "@/utils/getStyle"

import { timelineElementContainerStyle } from "@/styles/default-style"
import { Timing } from "@/schemas/timing"
import { Reveal } from "@/schemas/reveal"
import { Position } from "@/schemas/position"
import { Style } from "@/schemas/style"

export const Layout: React.FC<{
  children: React.ReactNode
  timing?: Timing
  reveal?: Reveal
  position?: Position
  effects?: Effects
  style?: Style
}> = ({ children, reveal, position, timing, effects, style }) => {
  const frame = useCurrentFrame()

  const calculatedTiming = useTiming(timing)

  const { style: transitionStyle } = useElementReveal({
    reveal: reveal,
    timing: calculatedTiming,
  })
  const positionStyle = getPosition(position)

  const layoutStyle = getStyle(style)

  const effectStyle = applyEffects(effects, frame)

  if (!calculatedTiming.visible) return null
  return (
    <Sequence
      from={calculatedTiming.startFrame}
      durationInFrames={calculatedTiming.totalFrames}
    >
      <div
        style={{
          ...timelineElementContainerStyle,
          ...layoutStyle,
          ...transitionStyle,
          ...positionStyle,
          ...effectStyle,
        }}
      >
        {children}
      </div>
    </Sequence>
  )
}
