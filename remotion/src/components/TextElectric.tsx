import {
  useCurrentFrame,
  random,
  staticFile,
  Sequence,
  useVideoConfig,
} from "remotion"
import { AudioWithFade } from "@components/AudioWithFade"
import { AnimatedText } from "@components/animations/AnimatedText"
import type { AnimatedTextProps } from "./animations/AnimatedText"

type TextElectricProps = Omit<AnimatedTextProps, "shadow"> & {
  withSound?: boolean
}
export const TextElectric: React.FC<TextElectricProps> = ({
  withSound = true,
  ...rest
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  // const flicker = Math.sin(frame * 0.8) * random(`flicker-${frame}`) * 0.2
  const flicker = Math.sin(frame * 0.8) * random(`flicker-${frame}`) * 0.2

  const from = rest.timing?.from ?? 0

  const duration = rest.timing?.duration ?? durationInFrames - from

  return (
    <>
      <AnimatedText
        withGlow={"intense"}
        glowColor={"#F8C734"}
        opacity={1 - flicker}
        style={{
          ...rest.style,
        }}
        {...rest}
      />
      {withSound && duration !== undefined && (
        <Sequence from={from} durationInFrames={duration}>
          <AudioWithFade
            src={staticFile("sound/electricity.mp3")}
            maxVolume={0.1}
            fadeInDuration={20}
            fadeOutDuration={35}
          />
        </Sequence>
      )}
    </>
  )
}
