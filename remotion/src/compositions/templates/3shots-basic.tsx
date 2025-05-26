import { z } from "zod"
import { AbsoluteFill, Composition, CalculateMetadataFunction } from "remotion"
import { Word } from "@/schemas/project"
import { createCameraLayer } from "@/factories/camera"
import { RenderScenes } from "@/components/RenderTrack"
import { words, urls } from "./3shots-basic-defaultProps"
import { createCaptionLayer } from "@/factories/caption"
import { createTitleLayer } from "@/factories/title"
import { Audio } from "@/components/LayerAudio"
import { getSceneDuration } from "@/utils/getDuration"

export const Schema = z.object({
  visualHook: z.string(),
  introUrl: z.string(),
  introCaptions: z.array(Word),
  bodyUrl: z.string(),
  bodyCaptions: z.array(Word),
  outroUrl: z.string(),
  outroCaptions: z.array(Word),
  musicUrl: z.string(),
})

const hookDefaultProps = {
  containerStyle: {
    background: "rgba(0, 0, 0, 0.8)",
  },
  position: {
    bottom: 80,
  },
  textStyle: {
    color: "white",
    fontFamily: "Tahoma",
  },
}

const captionDefaultProps = {
  position: {
    top: 50,
  },

  boxStyle: {
    backgroundColor: "transparent",
  },
  textStyle: {
    color: "white",
    fontFamily: "Tahoma",
    fontSize: 50,
    fontWeight: 500,
  },
  activeWord: {
    style: {
      color: "white",
    },
  },
}

export const getTracks = (props: z.infer<typeof Schema>) => {
  const hook = createTitleLayer({
    title: props.visualHook,
    ...hookDefaultProps,
  })
  const introCamera = createCameraLayer({ url: props.introUrl })
  const introCaption = createCaptionLayer({
    words: props.introCaptions,
    ...captionDefaultProps,
  })
  const bodyCamera = createCameraLayer({ url: props.bodyUrl })
  const bodyCaption = createCaptionLayer({
    words: props.bodyCaptions,
    ...captionDefaultProps,
  })
  const outroCamera = createCameraLayer({ url: props.outroUrl })
  const outroCaption = createCaptionLayer({
    words: props.outroCaptions,
    ...captionDefaultProps,
  })

  return [
    { layers: [introCamera, hook, introCaption] },
    { layers: [bodyCamera, bodyCaption] },
    { layers: [outroCamera, outroCaption] },
  ]
}

export const Component: React.FC<z.infer<typeof Schema>> = (props) => {
  const tracks = getTracks(props)

  return (
    <AbsoluteFill>
      <RenderScenes scenes={tracks} />

      <Audio
        audio={{
          type: "audio",
          sound: props.musicUrl,
          volume: 0.1,
          reveal: {
            type: "fade",
            duration: 10,
          },
        }}
      />
    </AbsoluteFill>
  )
}

export const calculateMetadata: CalculateMetadataFunction<
  z.infer<typeof Schema>
> = async ({ props, defaultProps, abortSignal }) => {
  const tracks = getTracks(props)

  const sceneDurations = await Promise.all(
    tracks.map(async (track) => {
      return await getSceneDuration(track)
    }),
  )

  return {
    durationInFrames: Math.round(
      sceneDurations.reduce((acc, curr) => acc + curr, 0) * 30,
    ),
  }
}

export const TemplateBasic3Shots = () => {
  return (
    <Composition
      id="3shotBasic"
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
