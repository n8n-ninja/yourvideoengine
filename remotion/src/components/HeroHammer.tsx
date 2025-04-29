import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Sequence,
  Audio,
} from "remotion"
import { AnimatedWrapper } from "@animations/AnimatedWrapper"
import { useTheme } from "@theme/ThemeContext"
import type { TimingConfig } from "@utils/useTimedVisibility"

type HeroHammerProps = {
  hammerWords: string[]
  timing?: TimingConfig
}

export const HeroHammer: React.FC<HeroHammerProps> = ({
  hammerWords,
  timing,
}) => {
  const frame = useCurrentFrame()
  const theme = useTheme()
  const from = timing?.from ?? 0

  return (
    <AnimatedWrapper timing={timing}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        {/* Sons de marteau */}
        {hammerWords.map((_, i) => {
          const delay = from + i * 10
          const numHits = 3
          return Array.from({ length: numHits }).map((_, j) => (
            <Sequence key={`hammer-${i}-${j}`} from={delay + j * 2}>
              <Audio src={staticFile("sound/hammer.mp3")} volume={0.07} />
            </Sequence>
          ))
        })}

        {/* Texte animé */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: theme.spacing.sm,
            marginTop: 24,
          }}
        >
          {hammerWords.map((word, i) => {
            const delay = i * 10
            const opacity = interpolate(
              frame,
              [from + delay, from + delay + 4],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )

            const scale = interpolate(
              frame,
              [from + delay, from + delay + 4],
              [2, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )

            return (
              <div
                key={i}
                style={{
                  fontSize: theme.fontSizes.xl,
                  color: theme.colors.text,
                  textShadow: theme.glows.medium(theme.colors.primary),
                  lineHeight: 1,
                  fontWeight: "900",
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                {word}
              </div>
            )
          })}
        </div>
      </div>
    </AnimatedWrapper>
  )
}
