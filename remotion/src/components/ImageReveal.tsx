import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
  useVideoConfig,
  Sequence,
} from "remotion"
import { AudioWithFade } from "@components/AudioWithFade"
import { AnimatedWrapper } from "@animations/AnimatedWrapper"
import type { TimingConfig } from "@utils/useTimedVisibility"

type ImageRevealProps = {
  image: string
  timing?: TimingConfig
  maxWidth?: number | string
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  image,
  timing,
  maxWidth = "90%",
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const from = timing?.from ?? 0
  const duration = timing?.duration ?? durationInFrames

  // === Image Animations ===
  const blur = interpolate(frame, [from, from + 10], [20, 0], {
    extrapolateRight: "clamp",
  })

  const scale = interpolate(
    frame,
    [from, from + 15, from + 30, from + duration - 5],
    [1.1, 1, 0.95, 0.83],
    {
      extrapolateRight: "clamp",
    },
  )

  const opacity = interpolate(
    frame,
    [from, from + 10, from + duration - 15, from + duration],
    [0, 1, 1, 0],
    {
      extrapolateRight: "clamp",
    },
  )

  return (
    <AnimatedWrapper timing={timing}>
      <Sequence from={from} durationInFrames={duration}>
        <AudioWithFade
          src={staticFile("sound/woosh-1.mp3")}
          maxVolume={0.3}
          fadeInDuration={5}
          fadeOutDuration={10}
        />
      </Sequence>

      <Img
        src={image}
        alt="forged-reveal"
        style={{
          position: "absolute",
          top: "33%",
          left: "50%",
          transform: `translate(-50%, -25%) scale(${scale})`,
          maxWidth,
          border: "6px solid #92400e",
          borderRadius: "8px",
          boxShadow: `0 0 40px rgba(255, 100, 0, 0.4)`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      />
    </AnimatedWrapper>
  )
}
