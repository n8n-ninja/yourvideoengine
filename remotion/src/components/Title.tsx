import React from "react"
import { AbsoluteFill } from "remotion"
import { z } from "zod"
import { titleThemes, letterAnimationPresets } from "./title/themes"
import {
  LetterAnimation,
  LetterAnimationConfigSchema,
} from "./title/LetterAnimation"
import { TimingSchema, useTiming } from "@/Utils/useTiming"
import { PositionSchema, usePosition } from "@/Utils/usePosition"
import {
  TransitionSchema,
  useRevealTransition,
} from "@/Utils/useRevealTransition"

const themeNames = Object.keys(titleThemes)
const animationPresetNames = Object.keys(letterAnimationPresets)

// Schema for letter animation config with preset
const LetterAnimationSchema = LetterAnimationConfigSchema.extend({
  preset: z.enum(animationPresetNames as [string, ...string[]]).optional(),
})

/**
 * TitlesSchema: zod schema for an array of title items.
 */
export const TitlesSchema = z.array(
  z.object({
    title: z.string(),
    theme: z.enum(themeNames as [string, ...string[]]).optional(),
    timing: TimingSchema.optional(),
    position: PositionSchema.optional(),
    style: z.object({}).passthrough().optional(),
    transition: TransitionSchema.optional(),
    letterAnimation: LetterAnimationSchema.optional(),
  }),
)

type TitleItem = z.infer<typeof TitlesSchema>[number]

type TitleProps = {
  titles: TitleItem[]
}

// Base style for all titles
const baseStyle: React.CSSProperties = {
  color: "#fff",
  fontFamily: "Montserrat, sans-serif",
  fontSize: 90,
  textAlign: "center",
  fontWeight: 900,
  margin: 50,
  textWrap: "balance",
  textShadow: "0 2px 30px #000, 0 1px 10px #000",
  lineHeight: 1.1,
}

/**
 * TitleItemDisplay: renders a single title with theme, animation, and transition.
 */
const TitleItemDisplay: React.FC<{ title: TitleItem }> = ({ title }) => {
  const timing = useTiming({ ...title.timing, start: title.timing?.start ?? 0 })
  const containerStyle = usePosition(title.position ?? {})
  const { style: transitionStyle } = useRevealTransition({
    transition: title.transition,
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })
  const themeStyle = titleThemes[title.theme ?? "minimal"]
  const style = {
    ...baseStyle,
    ...themeStyle,
    ...title.style,
    ...transitionStyle,
  }
  let letterAnimationConfig = null
  if (title.letterAnimation) {
    const config = title.letterAnimation
    const presetConfig = config.preset
      ? letterAnimationPresets[
          config.preset as keyof typeof letterAnimationPresets
        ]
      : undefined
    letterAnimationConfig = {
      duration: config.duration ?? presetConfig?.duration ?? 0.3,
      easing: config.easing ?? presetConfig?.easing ?? "easeOut",
      stagger: config.stagger ?? presetConfig?.staggerDelay ?? 0.05,
      translateY: config.translateY ?? 20,
    }
  }
  if (!timing.visible) return null
  return (
    <div style={containerStyle}>
      <h1 style={style}>
        {letterAnimationConfig ? (
          <LetterAnimation
            text={title.title}
            config={letterAnimationConfig}
            titleStart={title.timing?.start ?? 0}
          />
        ) : (
          title.title
        )}
      </h1>
    </div>
  )
}

/**
 * Title: renders a list of titles.
 */
export const Title: React.FC<TitleProps> = ({ titles }) => {
  return (
    <AbsoluteFill>
      {titles.map((title, idx) => (
        <TitleItemDisplay key={idx} title={title} />
      ))}
    </AbsoluteFill>
  )
}
