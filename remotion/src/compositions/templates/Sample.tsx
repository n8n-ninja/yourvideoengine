import { z } from "zod"
import { Composition } from "remotion"
import { AbsoluteFill } from "remotion"
import { TransitionSeries } from "@remotion/transitions"
import { defaultProps } from "./Sample.props"
import { Schema, CompositionName } from "./Sample.props"
import { Video } from "remotion"
import { getTransition } from "@/neoutils/getTransition"
import { Title } from "@/components/blocks/Title"
import { Caption } from "@/components/blocks/Caption"

export const Component = (props: z.infer<typeof Schema>) => {
  const fps = 30

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence
          key={"intro"}
          durationInFrames={props.introDuration * fps}
        >
          <Video src={props.intro} />

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
          duration: 0.4 * fps,
        })}

        <TransitionSeries.Sequence
          key={"body"}
          durationInFrames={props.bodyDuration * fps}
        >
          <Video src={props.body} />
        </TransitionSeries.Sequence>

        {getTransition({
          animation: "wipe",
          direction: "from-top",
          duration: 0.4 * fps,
        })}

        <TransitionSeries.Sequence
          key={"outro"}
          durationInFrames={props.outroDuration * fps}
        >
          <Video src={props.outro} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
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
    durationInFrames: Math.round(duration * 30),
  }
}

export const TemplateSample = () => {
  return (
    <Composition
      id={CompositionName}
      component={Component}
      schema={Schema}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        ...defaultProps,
      }}
    />
  )
}
