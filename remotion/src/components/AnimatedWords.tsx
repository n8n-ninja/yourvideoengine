import { interpolate, useVideoConfig } from "remotion"
import { useTimedVisibility } from "@utils/useTimedVisibility"
import type { TimingConfig } from "@utils/useTimedVisibility"
import { AnimatedText } from "@animations/AnimatedText"

type GlowLevel = "soft" | "medium" | "intense"

type AnimatedWordsProps = {
  text: string
  delayPerWord?: number
  glowColor?: string
  withGlow?: boolean | GlowLevel
  timing?: TimingConfig
  style?: React.CSSProperties
  className?: string
}

export const AnimatedWords: React.FC<AnimatedWordsProps> = ({
  text,
  delayPerWord = 3,
  glowColor,
  withGlow = false,
  timing,
  style = {},
  className = "",
}) => {
  const { durationInFrames } = useVideoConfig()
  const { frame: localFrame, opacity } = useTimedVisibility(
    timing,
    durationInFrames,
  )

  const from = timing?.from ?? 0
  const duration = timing?.duration ?? durationInFrames

  const words = text.split(" ")
  const baseFadeOutStart = duration - 15 + from

  const getRandomOffset = (index: number, max: number) =>
    Math.abs((index * 2654435761) % max)

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        textAlign: "center",
        opacity,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const delay = i * delayPerWord + from

        const fadeIn = interpolate(localFrame, [delay, delay + 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })

        const randomOffset = getRandomOffset(i, 7)
        const fadeOutStart = baseFadeOutStart - randomOffset

        const fadeOut = interpolate(
          localFrame,
          [fadeOutStart, fadeOutStart + 10],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )

        const wordOpacity = Math.min(fadeIn, fadeOut)
        const translateY = interpolate(
          localFrame,
          [delay, delay + 5],
          [10, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )

        return (
          <AnimatedText
            key={i}
            withGlow={withGlow}
            glowColor={glowColor}
            style={{
              opacity: wordOpacity,
              transform: `translateY(${translateY}px)`,
              marginRight: "0.3ch",
              ...style,
            }}
          >
            {word}
          </AnimatedText>
        )
      })}
    </div>
  )
}
