import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"
import React from "react"
import { titleThemes, letterAnimationPresets } from "./title/themes"
import { LetterAnimation, LetterAnimationConfig } from "./title/LetterAnimation"
import { useLetterAnimationConfig } from "./title/useLetterAnimationConfig"
import { LetterAnimationConfigSchema } from "./title/LetterAnimation"
import { TimingSchema } from "@/Utils/useTiming"
import { PositionSchema } from "@/Utils/usePosition"
import { useTiming } from "@/Utils/useTiming"
import { usePosition } from "@/Utils/usePosition"
import { TransitionSchema, useTransition } from "@/Utils/useTransition"

const themeNames = Object.keys(titleThemes)
const animationPresetNames = Object.keys(letterAnimationPresets)

const LetterAnimationSchema = LetterAnimationConfigSchema.extend({
  preset: z.enum(animationPresetNames as [string, ...string[]]).optional(),
})

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

const TitleItemDisplay: React.FC<{ title: TitleItem }> = ({ title }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  const timing = useTiming({ ...title.timing, start: title.timing?.start ?? 0 })
  const containerStyle = usePosition(title.position ?? {})
  const letterAnimationConfig = useLetterAnimationConfig(title.letterAnimation)

  // Animation de transition (apparition/disparition)
  const transitionStyle = useTransition({
    transition: title.transition,
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })

  // Load theme
  const themeStyle = titleThemes[title.theme ?? "minimal"]

  const style = {
    ...baseStyle,
    ...themeStyle,
    ...title.style,
    ...transitionStyle,
  }

  if (!timing.visible) return null

  return (
    <div style={containerStyle}>
      <h1 style={style}>
        {letterAnimationConfig ? (
          <LetterAnimation
            text={title.title}
            config={letterAnimationConfig as LetterAnimationConfig}
            currentTime={currentTime}
            titleStart={title.timing?.start ?? 0}
          />
        ) : (
          title.title
        )}
      </h1>
    </div>
  )
}

export const Title: React.FC<TitleProps> = ({ titles }) => {
  return (
    <AbsoluteFill>
      {titles.map((title, idx) => (
        <TitleItemDisplay key={idx} title={title} />
      ))}
    </AbsoluteFill>
  )
}
