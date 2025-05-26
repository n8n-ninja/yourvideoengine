import { z } from "zod"
import { AbsoluteFill, Composition, CalculateMetadataFunction } from "remotion"
import {
  CaptionBlockType,
  TitleBlockType,
  Word,
  TransitionType,
  EmojiBlockType,
  TrackType,
} from "@/schemas/project"
import { createCameraLayer } from "@/factories/camera"
import { RenderTrack } from "@/components/RenderTrack"
import { words, urls } from "./3shots-basic-defaultProps"
import { createCaptionLayer } from "@/factories/caption"
import { createTitleLayer } from "@/factories/title"
import { calculateDurations } from "@/utils/getDuration"
import { useState, useEffect } from "react"

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

const hookDefaultProps: Partial<TitleBlockType> = {
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
}

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
    ...hookDefaultProps,
    title: props.visualHook,
  })

  const introCamera = createCameraLayer({
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

  const bodyCamera = createCameraLayer({ url: props.bodyUrl })

  const bodyCaption = createCaptionLayer({
    ...captionDefaultProps,
    words: props.bodyCaptions,
  })

  const outroCamera = createCameraLayer({ url: props.outroUrl })

  const outroCaption = createCaptionLayer({
    ...captionDefaultProps,
    words: props.outroCaptions,
  })

  const transition: TransitionType = {
    type: "transition",
    duration: 0.4,
    animation: "wipe",
    sound: "woosh-3.mp3",
  }

  const emoji: EmojiBlockType = {
    type: "emoji",
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
  }

  const tracks: TrackType[] = [
    {
      id: "global",
      duration: Infinity,
      items: [
        {
          type: "scene",
          blocks: [
            {
              type: "audio",
              sound: props.musicUrl,
              volume: 0.1,
              reveal: {
                type: "fade",
                duration: 0.5,
              },
            },
          ],
        },
      ],
    },
    {
      id: "3shots-better",
      items: [
        {
          type: "scene",
          blocks: [introCamera, hook, introCaption],
        },
        transition,
        {
          type: "scene",
          blocks: [bodyCamera, bodyCaption, emoji],
        },
        transition,
        {
          type: "scene",
          blocks: [outroCamera, outroCaption],
        },
      ],
    },
  ]

  return await calculateDurations(tracks)
}

export const Component: React.FC<z.infer<typeof Schema>> = (props) => {
  const [tracks, setTracks] = useState<TrackType[]>([])

  useEffect(() => {
    const fetchTracks = async () => {
      const tracks = await getTracks(props)
      setTracks(tracks)
    }
    fetchTracks()
  }, [props])

  if (!tracks.length) return null

  return (
    <AbsoluteFill>
      {tracks.map((track) => (
        <RenderTrack key={track.id} track={track} />
      ))}
    </AbsoluteFill>
  )
}

export const calculateMetadata: CalculateMetadataFunction<
  z.infer<typeof Schema>
> = async ({ props, defaultProps, abortSignal }) => {
  const tracks = await getTracks(props)

  console.log(tracks)
  return {
    durationInFrames: Math.round(tracks[0].duration ?? 1) * (props.fps ?? 30),
  }
}

export const TemplateBasic3ShotsBetter = () => {
  return (
    <Composition
      id="3ShotBetter"
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
