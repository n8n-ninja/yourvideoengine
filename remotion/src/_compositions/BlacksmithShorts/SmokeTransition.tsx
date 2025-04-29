import { Video, staticFile, useCurrentFrame, interpolate } from "remotion"
import { useVideoConfig } from "remotion"
import type { TimingConfig } from "@utils/useTimedVisibility"

type SmokeTransitionProps = {
  src?: string
  timing?: TimingConfig
  style?: React.CSSProperties
}

export const SmokeTransition: React.FC<SmokeTransitionProps> = ({
  src = "video/forge.mp4",
  timing,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const from = timing?.from ?? 0
  const duration = timing?.duration ?? durationInFrames
  const fadeIn = timing?.fadeIn ?? 20
  const fadeOut = timing?.fadeOut ?? 30

  const end = from + duration
  const opacity = interpolate(
    frame,
    [from, from + fadeIn, end - fadeOut, end],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  )

  const scale = interpolate(frame, [from, from + fadeIn], [1.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <Video
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "200%",
        height: "200%",
        top: "-80%",
        left: "-50%",
        objectFit: "cover",
        mixBlendMode: "screen", // adoucit sur fond noir
        opacity,
        transform: `scale(${scale})`,

        ...style,
      }}
    />
  )
}
