import { z } from "zod"
import { Composition } from "remotion"
import { AbsoluteFill } from "remotion"
import { TransitionSeries } from "@remotion/transitions"
import { defaultProps } from "./Sample.props"
import { Schema, CompositionName } from "./Sample.props"
import { getTransition } from "@/utils/getTransition"
import { Camera } from "@/components/Camera"
import { Title } from "@/components/Title"
import { Caption } from "@/components/Caption"
import { Audio } from "@/components/Audio"
import { Emoji } from "@/components/Emoji"
import { Word } from "@/schemas/word"

const FPS = 30

const sepiaStyle = {
  filter: "saturate(0) contrast(2.5) brightness(.75) sepia(0.25)",
}

const getCaptions = (words: Word[]) => {
  return (
    <Caption
      words={words}
      combineTokensWithinMilliseconds={800}
      position={{
        top: 60,
        left: 25,
        right: 25,
      }}
      textStyle={{
        fontFamily: "Bangers",
      }}
      boxStyle={{
        background: "transparent",
      }}
      layoutStyle={{
        overflow: "visible",
      }}
      activeWord={{
        style: {
          color: "#F60002",
          transform: "scale(1.2) translateY(-10px) skewX(-10deg)",
        },
        // background: {
        //   style: {
        //     background: "rgba(200,0,0,0.9)",
        //     transform: "scale(1.2) translateY(-10px) skewX(-10deg)",
        //   },
        //   padding: {
        //     x: 20,
        //     y: 10,
        //   },
        // },
      }}
      dynamicFontSize={{
        min: 4,
        moy: 6,
        max: 7,
      }}
    />
  )
}

export const Component = (props: z.infer<typeof Schema>) => {
  return (
    <AbsoluteFill style={{ background: "#F60002" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          key={"intro"}
          durationInFrames={props.introDuration * FPS}
        >
          <Camera
            url={props.intro}
            style={{
              ...sepiaStyle,
            }}
            keyFrames={[
              { time: 0, value: { scale: 1.2 } },
              { time: 0.3, value: { scale: 1.05 } },
              { time: 0.43, value: { scale: 1 } },
              { time: 0.65, value: { scale: 1.5 } },
              { time: -0.01, value: { scale: 1 } },
            ]}
          />

          <Title
            title={props.title}
            style={{
              color: "#ffffff",
              fontSize: 100,
              fontWeight: "bold",
              textAlign: "center",
              textShadow: "0 0px 30px rgba(0,0,0,1)",
              textTransform: "uppercase",
              textDecoration: "none",
              background: "transparent",
              fontFamily: "Bangers",
            }}
            layoutStyle={{
              background: "#F60002",
            }}
            position={{
              bottom: 80,
              top: 5,
              left: 5,
              right: 5,
            }}
          />

          {getCaptions(props.introCaption)}

          {/* <Image
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
          /> */}
        </TransitionSeries.Sequence>

        {getTransition({
          animation: "wipe",
          direction: "from-left",
          duration: 0.4 * FPS,
          audio: "woosh-3.mp3",
        })}

        <TransitionSeries.Sequence
          key={"body"}
          durationInFrames={props.bodyDuration * FPS}
        >
          <Camera
            url={props.body}
            style={{
              ...sepiaStyle,
            }}
            keyFrames={[
              { time: 0, value: { top: 900, scale: 3 } },
              { time: props.bodyDuration / 2, value: { top: 0, scale: 2 } },
              { time: -0.01, value: { top: 0, scale: 1 } },
            ]}
          />
          <Emoji
            emoji={props.emoji as any}
            timing={{
              start: 1,
              duration: 1,
            }}
            position={{
              top: 0,
              left: 10,
              right: 10,
              bottom: 50,
            }}
          />

          {getCaptions(props.bodyCaption)}
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
          <Camera
            url={props.outro}
            style={{ ...sepiaStyle }}
            effects={[{ type: "pulse", options: { amplitude: 0.1 } }]}
          />

          {getCaptions(props.outroCaption)}
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Audio
        url={props.music}
        volume={0.1}
        loop={true}
        timing={{
          start: 1,
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
