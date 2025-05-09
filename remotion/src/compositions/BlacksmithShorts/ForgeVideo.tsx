import { Video, staticFile, interpolate, useCurrentFrame } from "remotion"
import { AnimatedWrapper } from "@animations/AnimatedWrapper"
import type { TimingConfig } from "@utils/useTimedVisibility"

type ForgeVideoProps = {
  src?: string
  height?: number
  maskHeight?: number
  style?: React.CSSProperties
  timing?: TimingConfig
}

export const ForgeVideo: React.FC<ForgeVideoProps> = ({
  src = "video/forge.mp4",
  height = 1000,
  maskHeight = 900,
  style = {},
  timing = { from: 0, fadeIn: 120 },
}) => {
  const frame = useCurrentFrame()
  const from = timing?.from ?? 0
  const slideOffset = 30 // px
  const fadeIn = 120 // frames

  const translateY = interpolate(
    frame,
    [from, from + fadeIn],
    [slideOffset, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  )

  return (
    <AnimatedWrapper timing={timing}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",

          transform: ` translateY(${translateY}px)`,
          height,
          overflow: "hidden",
          zIndex: 0,
          ...style,
        }}
      >
        <Video
          src={staticFile(src)}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "auto",
            transform: "translateY(0%)",
            objectFit: "cover",
            maskImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${maskHeight}px)`,
            WebkitMaskImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${maskHeight}px)`,
          }}
        />
      </div>
    </AnimatedWrapper>
  )
}
