import { Composition } from "remotion"
import { z } from "zod"
import { CaptionBlockType, TrackType } from "@/schemas/project"
import { createCamera } from "@/factories/camera"
import { createTransition } from "@/factories/transition"
import { createEmoji } from "@/factories/emoji"
import { createAudio } from "@/factories/audio"
import { createScene } from "@/factories/scene"
import { defaultProps } from "./Sample.props"
import { createCaptionLayer } from "@/factories/caption"
import { createTitleLayer } from "@/factories/title"
import { createTrack } from "@/factories/track"
import { RenderTracks } from "@/components/RenderTracks"
import { createCalculateTracksMetadata } from "@/utils/calculateTracksMetadata"
import { Schema, CompositionName } from "./Sample.props"
import { Video } from "remotion"

const captionDefaultProps: Partial<CaptionBlockType> = {
  position: {
    top: 50,
    left: 10,
    right: 10,
  },
  boxStyle: {
    backgroundColor: "transparent",
  },
  containerStyle: {
    overflow: "visible",
  },
  textStyle: {
    margin: "0 15px",
    textTransform: "uppercase",
  },
  activeWord: {
    style: {
      color: "white",
      transform: "skew(-10deg) scale(1.1)",
    },
    background: {
      style: {
        backgroundColor: "#0377fc",
        border: "5px solid #042d5c",
        borderRadius: 30,
        transform: "skew(-10deg) scale(1.1)",
      },
      padding: {
        x: 50,
        y: 10,
      },
    },
  },
  dynamicFontSize: {
    min: 4,
    moy: 5,
    max: 7,
  },
  effects: [
    {
      type: "float",
      options: {
        speed: 0.1,
        amplitude: 0.4,
      },
    },
  ],
}

export const getTracks = async (
  props: z.infer<typeof Schema>,
): Promise<TrackType[]> => {
  const camera = await createCamera({
    url: props.url,
  })

  const hook = createTitleLayer({
    containerStyle: {
      background: "#042d5c80",
    },
    position: {
      bottom: 80,
    },
    timing: {
      start: 0.2,
      duration: -0.2,
    },
    reveal: {
      type: "slide-down",
      duration: 0.4,
    },

    title: props.title,
  })

  const mainTrack = createTrack({
    id: "title",
    items: [
      createScene({
        id: "intro",

        blocks: [camera],
      }),
    ],
  })

  return [mainTrack]
}

export const Component = (props: z.infer<typeof Schema>) => {
  return <Video src={props.url} />
  // <RenderTracks getTracks={getTracks} props={props} />
}
export const calculateMetadata = createCalculateTracksMetadata(getTracks)

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
