import { z } from "zod"
import { Composition } from "remotion"
import {
  CaptionBlockType,
  TitleBlockType,
  Word,
  TrackType,
} from "@/schemas/project"
import { createCamera } from "@/factories/camera"
import { createTransition } from "@/factories/transition"
import { createEmoji } from "@/factories/emoji"
import { createAudio } from "@/factories/audio"
import { createScene } from "@/factories/scene"
import { words, urls } from "./3shots-basic-defaultProps"
import { createCaptionLayer } from "@/factories/caption"
import { createTitleLayer } from "@/factories/title"
import { createTrack } from "@/factories/track"
import { RenderTracks } from "@/components/RenderTracks"
import { createCalculateTracksMetadata } from "@/utils/calculateTracksMetadata"

export const Schema = z.object({
  visualHook: z.string(),
  introUrl: z.string(),
  introCaptions: z.array(Word),
  bodyUrl: z.string(),
  bodyCaptions: z.array(Word),
  outroUrl: z.string(),
  outroCaptions: z.array(Word),
  musicUrl: z.string(),
  fps: z.number().optional(),
})

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
  const hook = createTitleLayer({
    containerStyle: {
      background: "#042d5c80",
    },
    position: {
      bottom: 80,
    },
    reveal: {
      type: "slide-down",
      duration: 1,
    },

    title: props.visualHook,
  })

  const introCamera = await createCamera({
    url: props.introUrl,
    keyFrames: [
      {
        time: 0.2,
        value: {
          scale: 1,
        },
      },
      {
        time: 0.4,
        value: {
          scale: 1.4,
        },
      },
      {
        time: 1,
        value: {
          scale: 1.6,
        },
      },
      {
        time: -1,
        value: {
          scale: 1.4,
        },
      },
      {
        time: -0.01,
        value: {
          scale: 1,
        },
      },
    ],
    reveal: {
      inType: "zoom-out",
      inDuration: 1,
    },
  })

  const introCaption = createCaptionLayer({
    ...captionDefaultProps,
    words: props.introCaptions,
  })

  const bodyCamera = await createCamera({
    url: props.bodyUrl,
    timing: {
      duration: 3,
    },
  })

  const bodyCaption = createCaptionLayer({
    ...captionDefaultProps,
    words: props.bodyCaptions,
  })

  const outroCamera = await createCamera({ url: props.outroUrl })

  const outroCaption = createCaptionLayer({
    ...captionDefaultProps,
    words: props.outroCaptions,
  })

  const transition = createTransition({
    duration: 0.4,
    animation: "wipe",
    sound: "woosh-3.mp3",
  })

  const emoji = createEmoji({
    emoji: "100",
    position: {
      bottom: 40,
      left: 10,
      right: 10,
    },
    containerStyle: {
      overflow: "visible",
    },
    timing: {
      start: 1.5,
    },
    reveal: {
      type: "slide-down",
      duration: 0.5,
    },
  })

  const music = createAudio({
    sound: props.musicUrl,
    volume: 0.1,
    reveal: {
      type: "fade",
      duration: 0.5,
    },
  })

  const mainTrack = createTrack({
    id: "3shots-better",
    items: [
      createScene({
        id: "intro",
        blocks: [introCamera, hook, introCaption],
      }),
      // transition,
      createScene({
        id: "body",
        blocks: [bodyCamera, bodyCaption, emoji],
      }),
      transition,
      createScene({
        id: "outro",
        blocks: [outroCamera, outroCaption],
      }),
    ],
  })

  const musicTrack = createTrack({
    id: "global",
    items: [
      {
        type: "scene",
        blocks: [music],
      },
    ],
  })

  return [mainTrack, musicTrack]
}

export const Component = (props: z.infer<typeof Schema>) => (
  <RenderTracks getTracks={getTracks} props={props} />
)

export const calculateMetadata = createCalculateTracksMetadata(getTracks)

export const Template3shots = () => {
  return (
    <Composition
      id="3shots"
      component={Component}
      schema={Schema}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        visualHook: "Basic editing + caption template",
        introUrl: urls.intro,
        introCaptions: words[0].response.words,
        bodyUrl: urls.body,
        bodyCaptions: words[2].response.words,
        outroUrl: urls.outro,
        outroCaptions: words[1].response.words,
        musicUrl:
          "https://diwa7aolcke5u.cloudfront.net/uploads/1748099564616-mbgrk0.mp3",
      }}
    />
  )
}
