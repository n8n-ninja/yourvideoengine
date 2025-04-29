import { Img, useCurrentFrame, interpolate, useVideoConfig } from "remotion"
import { useTheme } from "@theme/ThemeContext"
import { AnimatedWrapper } from "@animations/AnimatedWrapper"
import type { TimingConfig } from "@utils/useTimedVisibility"

type ImageWithTitleProps = {
  image: string
  title: string
  timing?: TimingConfig
  imageWidth?: number | string
}

export const ImageWithTitle: React.FC<ImageWithTitleProps> = ({
  image,
  title,
  timing,
  imageWidth = 200,
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const theme = useTheme()

  const from = timing?.from ?? 0
  const duration = timing?.duration ?? durationInFrames

  const appear = from
  const disappear = from + duration

  const logoOpacity = interpolate(
    frame,
    [appear, appear + 15, disappear - 20, disappear],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  )

  const textOpacity = interpolate(
    frame,
    [appear + 10, appear + 25, disappear - 15, disappear],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  )

  const logoY = interpolate(frame, [appear, appear + 15], [30, 0], {
    extrapolateRight: "clamp",
  })

  const textY = interpolate(frame, [appear + 10, appear + 25], [20, 0], {
    extrapolateRight: "clamp",
  })

  return (
    <AnimatedWrapper timing={timing}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 24,
        }}
      >
        <Img
          src={image}
          alt="logo"
          style={{
            width: imageWidth,
            opacity: logoOpacity,
            transform: `translateY(${logoY}px)`,
          }}
        />

        <div
          style={{
            fontFamily: theme.fonts.title,
            fontSize: theme.fontSizes.md,
            color: theme.colors.text,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textShadow: theme.glows.intense(theme.colors.primary),
            lineHeight: 1.1,
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </div>
      </div>
    </AnimatedWrapper>
  )
}
