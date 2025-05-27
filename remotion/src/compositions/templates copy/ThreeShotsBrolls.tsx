import { z } from "zod"
import { Composition } from "remotion"
import { Word } from "@/schemas/project"
import type { TrackType } from "@/schemas/project"
import { createCamera } from "@/factories/camera"
import { createTransition } from "@/factories/transition"
import { createAudio } from "@/factories/audio"
import { createScene } from "@/factories/scene"
import { createCaptionLayer } from "@/factories/caption"
import { createTitleLayer } from "@/factories/title"
import { createTrack } from "@/factories/track"
import { RenderTracks } from "@/components/RenderTracks"
import { createCalculateTracksMetadata } from "@/utils/calculateTracksMetadata"
import { defaultProps } from "./ThreeShotsBrolls-props"
import { createEmoji } from "@/factories/emoji"

export const CompositionName = "ThreeShotsBrolls"

export const Schema = z.object({
  introUrl: z.string(),
  introWords: z.array(Word),
  bodyUrl: z.string(),
  bodyWords: z.array(Word),
  outroUrl: z.string(),
  outroWords: z.array(Word),
  brolUrls: z.array(z.string()),
  musicUrl: z.string(),
  fps: z.number().optional(),
})

const captionDefaultProps = {
  textStyle: "text-transform: uppercase",
  position: { bottom: 70 },
  activeWordStyle: "transform: scale(1.1) skewX(-10deg)",
  boxStyle: "background-color: transparent",
  combineTokensWithinMilliseconds: 800,
  activeWord: { style: "transform: scale(1.3) skewX(-10deg)" },

  multiColors: ["#d47e1c", "#d41c5c", "#1c90d4"],
}

const getBrollTimings = (
  bodyDuration: number,
  brolCount: number,
  buffer: number = 4,
  brollDuration: number = 5,
): { start: number; duration: number }[] => {
  if (brolCount === 0) return []
  const availableDuration = bodyDuration - 2 * buffer
  if (availableDuration <= 0) {
    // fallback: place all at buffer
    return Array.from({ length: brolCount }, () => ({
      start: buffer,
      duration: brollDuration,
    }))
  }
  const interval = availableDuration / (brolCount + 1)
  return Array.from({ length: brolCount }, (_, i) => ({
    start: buffer + interval * (i + 1),
    duration: brollDuration,
  }))
}

export const getTracks = async (
  props: z.infer<typeof Schema>,
): Promise<TrackType[]> => {
  const introCamera = await createCamera({
    url: props.introUrl,
    keyFrames: [
      { time: 0.2, value: { scale: 1 } },
      { time: 0.4, value: { scale: 1.4 } },
      { time: 1, value: { scale: 1.6 } },
      { time: -1, value: { scale: 1.4 } },
      { time: -0.01, value: { scale: 1 } },
    ],
  })
  const introCaption = createCaptionLayer({
    ...captionDefaultProps,
    words: props.introWords,
  })

  const introTitle = createEmoji({
    emoji: "smile-cat",
    position: { top: 60 },
    timing: { start: 2.2, duration: 2 },
    reveal: { type: "zoom-in", duration: 0.35 },
  })

  const introAudio = createAudio({
    sound: "slow-woosh-5.mp3",
    timing: { start: 1.2 },
  })

  const bodyCamera = await createCamera({
    url: props.bodyUrl,
    keyFrames: [
      { time: 0, value: { scale: 1 } },
      { time: 20, value: { scale: 1.4 } },
      { time: 35, value: { scale: 1 } },
      { time: 50, value: { scale: 1.6 } },
    ],
  })

  const brolTimings = getBrollTimings(
    bodyCamera.duration,
    props.brolUrls.length,
  )
  const brolCameras = []
  for (let i = 0; i < props.brolUrls.length; i++) {
    const camera = await createCamera({
      url: props.brolUrls[i],
      timing: brolTimings[i],
      reveal: { type: "zoom-out", duration: 0.35 },
    })
    brolCameras.push(camera)
  }

  const bodyCaption = createCaptionLayer({
    ...captionDefaultProps,
    words: props.bodyWords,
    position: { top: 70 },
  })

  const outroCamera = await createCamera({
    url: props.outroUrl,
    keyFrames: [
      { time: 0, value: { scale: 1.5 } },
      { time: 0.1, value: { scale: 1.55 } },
      { time: 3, value: { scale: 1 } },
      { time: -0.01, value: { scale: 1.3 } },
    ],
  })
  const outroTitle1 = createTitleLayer({
    title: "@Shawheen",
    position: { top: 80, left: 10, right: 10, bottom: 10 },
    timing: { start: 3 },
    reveal: { type: "slide-up", duration: 0.35 },
    containerStyle:
      "background-color: #d41c5c; border: 3px solid white; box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.5);",
    effects: [
      {
        type: "pointer",
        options: { direction: "bottom", amplitude: 0.5, speed: 0.4 },
      },
    ],
    style: "text-transform: uppercase",
  })
  const outroTitle2 = createTitleLayer({
    title: "XXX-YYY-ZZZ",
    position: { top: 90 },
    timing: { start: 5 },
    reveal: { type: "fade", duration: 0.35 },
    style: "text-transform: uppercase; font-weight: 500; font-size: 3rem",
  })
  const outroCaption = createCaptionLayer({
    ...captionDefaultProps,
    words: props.outroWords,
  })

  const transitionSlide = createTransition({
    animation: "slide",
    duration: 0.5,
    sound: "woosh-3.mp3",
  })
  const transitionClock = createTransition({
    animation: "clockWipe",
    duration: 0.5,
    sound: "woosh-3.mp3",
  })

  const music = createAudio({
    sound: props.musicUrl,
    timing: { start: 3 },
    volume: 0.2,
    reveal: { type: "fade", duration: 2 },
  })

  const mainTrack = createTrack({
    items: [
      createScene({
        blocks: [introCamera, introCaption, introTitle, introAudio],
      }),
      transitionSlide,
      createScene({ blocks: [bodyCamera, ...brolCameras, bodyCaption] }),
      transitionClock,
      createScene({
        blocks: [outroCamera, outroTitle1, outroTitle2, outroCaption],
      }),
    ],
  })

  const musicTrack = createTrack({
    items: [createScene({ blocks: [music] })],
  })

  return [mainTrack, musicTrack]
}

export const Component = (props: z.infer<typeof Schema>) => (
  <RenderTracks getTracks={getTracks} props={props} />
)

export const calculateMetadata = createCalculateTracksMetadata(getTracks)

export const Template3ShotsBrolls = () => {
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
