import { z } from "zod"
import { Composition } from "remotion"
import { TrackType } from "@/schemas/project"
import { createScene } from "@/factories/scene"
import { defaultProps } from "./test-props"
import { createTitleLayer } from "@/factories/title"
import { createTrack } from "@/factories/track"
import { RenderTracks } from "@/components/RenderTracks"
import { createCalculateTracksMetadata } from "@/utils/calculateTracksMetadata"

export const Schema = z.object({
  title: z.string(),
  fps: z.number().optional(),
})

export const getTracks = async (
  props: z.infer<typeof Schema>,
): Promise<TrackType[]> => {
  const hook = createTitleLayer({
    // containerStyle: {
    //   background: "#042d5c80",
    // },
    // position: {
    //   bottom: 80,
    // },
    timing: {
      start: -3,
      duration: -1,
    },
    reveal: {
      type: "swipe",
      duration: 0.4,
    },

    title: "props.title",
  })

  const mainTrack = createTrack({
    id: "maintrack",
    items: [
      createScene({
        id: "intro",
        duration: 10,
        blocks: [hook],
      }),
    ],
  })

  return [mainTrack]
}

export const Component = (props: z.infer<typeof Schema>) => (
  <RenderTracks getTracks={getTracks} props={props} />
)

export const calculateMetadata = createCalculateTracksMetadata(getTracks)

export const TemplateTest = () => {
  return (
    <Composition
      id="test"
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
