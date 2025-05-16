import React from "react"
import { CalculateMetadataFunction } from "remotion"
import { springTiming, TransitionSeries } from "@remotion/transitions"
import { z } from "zod"
import { Caption } from "@/components/Caption"
import { Camera } from "@/components/Camera"
import { Title } from "@/components/Title"
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

export const calculateDurationInFrames = (
  scenes: z.infer<typeof editSchema>["scenes"],
) => {
  let totalDurationInFrames = 0

  if (!scenes) return 1

  for (const [index, scene] of scenes.entries()) {
    const duration = scene.durationInFrames ?? 1
    totalDurationInFrames += duration
    if (scene.transition && index > 0) {
      totalDurationInFrames -= scene.transition.duration || 30
    }
  }

  return Math.round(totalDurationInFrames) || 1
}

export const calculateMetadata: CalculateMetadataFunction<{
  scenes?: z.infer<typeof editSchema>["scenes"]
  global?: z.infer<typeof editSchema>["global"]
}> = ({ props, defaultProps }) => {
  const scenes = props.scenes || defaultProps.scenes || []
  const global = props.global || defaultProps.global || {}

  return {
    durationInFrames: calculateDurationInFrames(scenes),
    props: {
      scenes,
      global,
    },
  }
}

export const editSchema = z.object({
  scenes: z
    .array(
      z.object({
        durationInFrames: z.number(),
        camera: CameraSchema,
        transition: TransitionSchema.optional(),
        captions: CaptionSchema.optional(),
        titles: TitlesSchema.optional(),
        sounds: SoundsSchema.optional(),
        overlays: z.array(z.any()).optional(),
      }),
    )
    .optional()
    .default([]),
  global: z
    .object({
      sounds: SoundsSchema.optional(),
      titles: TitlesSchema.optional(),
      captions: CaptionSchema.optional(),
      // overlays: z.array(z.any()).optional(),
    })
    .optional()
    .default({}),
})

export const EditComponent = ({
  scenes = [],
  global,
}: {
  scenes?: z.infer<typeof editSchema>["scenes"]
  global?: z.infer<typeof editSchema>["global"]
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
              {scene.captions && <Caption captions={scene.captions} />}
              {scene.titles && <Title titles={scene.titles} />}
              {scene.sounds && <Sound sounds={scene.sounds} />}
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>

      {global?.sounds && <Sound sounds={global.sounds} />}
      {global?.titles && <Title titles={global.titles} />}
      {global?.captions && <Caption {...global.captions} />}
      {global?.overlays && <Overlay overlays={global.overlays} />}
    </>
  )
}
