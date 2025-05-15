import React from "react"
import { Composition, getInputProps } from "remotion"
import { springTiming, TransitionSeries } from "@remotion/transitions"
import { z } from "zod"
import { Caption } from "@/components/Caption"
import { Camera } from "@/components/Camera"
import { Title } from "@/components/Title"
import editScenes from "./editProps.json"
import { Sound } from "@/components/Sound"
import { Overlay } from "@/components/Overlay"
import {
  CameraSchema,
  CaptionSchema,
  TitlesSchema,
  SoundsSchema,
  Transition as TransitionType,
  TransitionSchema,
} from "@/schemas"
import { getTransition } from "@/utils/getTransition"

const calculateDurationInFrames = (
  scenes: z.infer<typeof editSchema>["scenes"] = [],
) => {
  let totalDurationInFrames = 0
  for (const [index, scene] of scenes.entries()) {
    const duration = scene.durationInFrames ?? 1
    totalDurationInFrames += duration
    if (scene.transition && index > 0) {
      totalDurationInFrames -= scene.transition.duration || 30
    }
  }
  return Math.round(totalDurationInFrames)
}

export const editSchema = z.object({
  fps: z.number(),
  width: z.number(),
  height: z.number(),
  scenes: z.array(
    z.object({
      durationInFrames: z.number(),
      camera: CameraSchema,
      transition: TransitionSchema.optional(),
      captions: CaptionSchema.optional(),
      titles: TitlesSchema.optional(),
      sounds: SoundsSchema.optional(),
      overlays: z.array(z.any()).optional(),
    }),
  ),
  sounds: SoundsSchema.optional(),
  titles: TitlesSchema.optional(),
  captions: CaptionSchema.optional(),
  overlays: z.array(z.any()).optional(),
})

export const EditComponent = ({
  scenes = [],
  sounds,
  titles,
  captions,
  overlays,
}: {
  scenes?: z.infer<typeof editSchema>["scenes"]
  sounds?: z.infer<typeof editSchema>["sounds"]
  titles?: z.infer<typeof editSchema>["titles"]
  captions?: z.infer<typeof editSchema>["captions"]
  overlays?: z.infer<typeof editSchema>["overlays"]
}) => {
  return (
    <>
      <TransitionSeries>
        {scenes.map((scene, index) => (
          <React.Fragment key={index}>
            {scene.transition && (
              <TransitionSeries.Transition
                timing={springTiming({
                  config: { damping: scene.transition.duration },
                })}
                presentation={getTransition(scene.transition as TransitionType)}
              />
            )}
            <TransitionSeries.Sequence
              durationInFrames={scene.durationInFrames ?? 1}
            >
              <Camera {...scene.camera} />
              {scene.overlays && <Overlay overlays={scene.overlays} />}
              {scene.captions && <Caption {...scene.captions} />}
              {scene.titles && <Title titles={scene.titles} />}
              {scene.sounds && <Sound sounds={scene.sounds} />}
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
      {sounds && <Sound sounds={sounds} />}
      {titles && <Title titles={titles} />}
      {captions && <Caption {...captions} />}
      {overlays && <Overlay overlays={overlays} />}
    </>
  )
}

export const EditComposition = () => {
  const inputProps = getInputProps<z.infer<typeof editSchema>>()
  const scenes = inputProps.scenes || editScenes.scenes
  const sounds = inputProps.sounds
  const fps = inputProps.fps || 30
  const width = inputProps.width || 1080
  const height = inputProps.height || 1920
  const durationInFrames = calculateDurationInFrames(scenes)
  return (
    <Composition
      id="Edit"
      component={EditComponent}
      schema={editSchema}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
      defaultProps={{
        scenes,
        sounds,
        fps,
        width,
        height,
      }}
    />
  )
}
