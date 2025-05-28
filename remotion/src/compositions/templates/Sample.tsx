import { z } from "zod"
import { Composition } from "remotion"
import { AbsoluteFill } from "remotion"
import { TransitionSeries } from "@remotion/transitions"
import { defaultProps } from "./Sample.props"
import { Schema, CompositionName } from "./Sample.props"
import { Video } from "remotion"
import { getTransition } from "@/utils/getTransition"
import { Camera } from "@/components/Camera"
import { Title } from "@/components/Title"
import { Caption } from "@/components/Caption"
import { Audio } from "@/components/Audio"
import { Emoji } from "@/components/Emoji"
import { Image } from "@/components/Image"

const FPS = 30

export const Component = (props: z.infer<typeof Schema>) => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence
          key={"intro"}
          durationInFrames={props.introDuration * FPS}
        >
          <Camera
            url={props.intro}
            keyFrames={[
              { time: 0, value: { scale: 1 } },
              { time: 1, value: { scale: 1.5 } },
            ]}
          />

          <Title
            title={props.title}
            timing={{
              start: 1,
              duration: 3,
            }}
            position={{
              bottom: 60,
            }}
            reveal={{
              type: "fade",
            }}
          />

          <Image
            url={
              "https://diwa7aolcke5u.cloudfront.net/uploads/1747833791251-CleanShot%202025-05-21%20at%2015.23.00.png@2x.png"
            }
            position={{
              top: 20,
              left: 10,
              right: 50,
              bottom: 20,
            }}
            timing={{
              start: 1,
              duration: 3,
            }}
            reveal={{
              type: "swipe",
              duration: 1,
            }}
          />

          <Caption
            words={props.introCaption}
            position={{
              top: 60,
            }}
            activeWord={{
              background: {
                style: "background-color: rgba(200,0,0,0.7)",
                padding: {
                  x: 30,
                  y: 10,
                },
              },
            }}
            multiColors={["#000000", "#ffffff"]}
            dynamicFontSize={{
              min: 1,
              moy: 1.5,
              max: 4,
            }}
          />
        </TransitionSeries.Sequence>

        {getTransition({
          animation: "wipe",
          direction: "from-bottom",
          duration: 0.4 * FPS,
        })}

        <TransitionSeries.Sequence
          key={"body"}
          durationInFrames={props.bodyDuration * FPS}
        >
          <Video src={props.body} />
          <Emoji
            emoji={"smile"}
            timing={{
              start: 1,
              duration: 1,
            }}
            position={{
              top: 20,
              left: 10,
              right: 50,
              bottom: 20,
            }}
          />
        </TransitionSeries.Sequence>

        {getTransition({
          animation: "wipe",
          direction: "from-top",
          duration: 0.4 * FPS,
        })}

        <TransitionSeries.Sequence
          key={"outro"}
          durationInFrames={props.outroDuration * FPS}
        >
          <Video src={props.outro} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Audio
        url={props.music}
        volume={0.2}
        loop={true}
        timing={{
          start: 1,
          duration: 3,
        }}
        fadeInDuration={0.5}
        fadeOutDuration={0.5}
      />
    </AbsoluteFill>
  )
}

export const calculateMetadata = ({
  props,
}: {
  props: z.infer<typeof Schema>
}) => {
  const duration =
    props.introDuration + props.bodyDuration + props.outroDuration - 0.4 - 0.4
  return {
    durationInFrames: Math.round(duration * FPS),
  }
}

export const TemplateSample = () => {
  return (
    <Composition
      id={CompositionName}
      component={Component}
      schema={Schema}
      fps={FPS}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        ...defaultProps,
      }}
    />
  )
}
