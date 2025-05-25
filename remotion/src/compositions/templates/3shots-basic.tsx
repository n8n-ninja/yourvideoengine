import { z } from "zod"
import { AbsoluteFill, Composition, CalculateMetadataFunction } from "remotion"
import { parseMedia } from "@remotion/media-parser"

import { Word } from "@/schemas/project"

import { createCameraLayer } from "@/factories/camera"
import { RenderScenes } from "@/components/RenderScenes"
import { sampleWords } from "./3shots-basic-defaultProps"
import { createCaptionLayer } from "@/factories/caption"
import { createTitleLayer } from "@/factories/title"
import { Audio } from "@/components/LayerAudio"

export const Schema = z.object({
  visualHook: z.string(),

  introUrl: z.string(),
  introCaptions: z.array(Word),
  introDuration: z.number(),

  bodyUrl: z.string(),
  bodyCaptions: z.array(Word),
  bodyDuration: z.number(),

  outroUrl: z.string(),
  outroCaptions: z.array(Word),
  outroDuration: z.number(),

  musicUrl: z.string(),
})

const hookProps = {
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

const captionProps = {
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

export const Component: React.FC<z.infer<typeof Schema>> = ({
  visualHook,
  introUrl,
  introCaptions,
  bodyUrl,
  bodyCaptions,
  outroUrl,
  outroCaptions,
  musicUrl,
  introDuration,
  bodyDuration,
  outroDuration,
}) => {
  const hook = createTitleLayer({
    title: visualHook,
    ...hookProps,
  })

  const introCamera = createCameraLayer({
    url: introUrl,
  })

  const introCaption = createCaptionLayer({
    words: introCaptions,
    ...captionProps,
  })

  const bodyCamera = createCameraLayer({
    url: bodyUrl,
  })

  const bodyCaption = createCaptionLayer({
    words: bodyCaptions,
    ...captionProps,
  })

  const outroCamera = createCameraLayer({
    url: outroUrl,
  })

  const outroCaption = createCaptionLayer({
    words: outroCaptions,
    ...captionProps,
  })

  const tracks = [
    {
      duration: introDuration,
      layers: [introCamera, hook, introCaption],
    },
    {
      duration: bodyDuration,
      layers: [bodyCamera, bodyCaption],
    },
    {
      duration: outroDuration,
      layers: [outroCamera, outroCaption],
    },
  ]

  return (
    <AbsoluteFill>
      <RenderScenes scenes={tracks} />

      <Audio
        audio={{
          type: "audio",
          sound: musicUrl,
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
  return {
    durationInFrames: Math.round(
      (props.introDuration + props.bodyDuration + props.outroDuration) * 30,
    ),
  }
}

export const TemplateBasic3Shots = () => {
  return (
    <Composition
      id="TestIdComposition"
      component={Component}
      schema={Schema}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        visualHook: "Basic editing + caption template",
        introDuration: 8,
        bodyDuration: 8,
        outroDuration: 8,
        introUrl:
          "https://diwa7aolcke5u.cloudfront.net/uploads/094a6307-0437-4fe2-a99b-4a6003bf46d9.mp4",
        introCaptions: sampleWords,
        bodyUrl:
          "https://diwa7aolcke5u.cloudfront.net/uploads/094a6307-0437-4fe2-a99b-4a6003bf46d9.mp4",
        bodyCaptions: sampleWords,
        outroUrl:
          "https://diwa7aolcke5u.cloudfront.net/uploads/094a6307-0437-4fe2-a99b-4a6003bf46d9.mp4",
        outroCaptions: sampleWords,
        musicUrl:
          "https://diwa7aolcke5u.cloudfront.net/uploads/1748099564616-mbgrk0.mp3",
      }}
    />
  )
}
