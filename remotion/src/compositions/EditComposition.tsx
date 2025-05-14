import { Composition, getInputProps, staticFile } from "remotion"
import { springTiming, TransitionSeries } from "@remotion/transitions"
import { fade } from "@remotion/transitions/fade"
import { wipe } from "@remotion/transitions/wipe"
import { slide } from "@remotion/transitions/slide"
import { flip } from "@remotion/transitions/flip"
import { clockWipe } from "@remotion/transitions/clock-wipe"
import { TransitionPresentation } from "@remotion/transitions"
import { z } from "zod"
import { Caption, CaptionSchema } from "@/components/Caption"
import { Camera, CameraSchema } from "@/components/Camera"
import { Title, TitlesSchema } from "@/components/Title"
import editScenes from "./editProps.json"

const TransitionSchema = z.object({
  type: z.enum(["fade", "wipe", "slide", "flip", "clockWipe"]),
  duration: z.number().optional(),
  direction: z
    .enum(["from-left", "from-right", "from-top", "from-bottom"])
    .optional(),
  wipeDirection: z
    .enum([
      "from-left",
      "from-right",
      "from-top",
      "from-bottom",
      "from-top-left",
      "from-top-right",
      "from-bottom-left",
      "from-bottom-right",
    ])
    .optional(),
  sound: z.string().optional(),
})
import { addSound } from "@/Utils/addSound"

const getTransition = (
  transition: z.infer<typeof TransitionSchema>,
  width = 1080,
  height = 1920,
) => {
  let presentation

  if (transition.type == "wipe")
    presentation = wipe({
      direction:
        transition.wipeDirection || transition.direction || "from-left",
    })
  else if (transition.type == "slide")
    presentation = slide({
      direction: transition.direction || "from-left",
    })
  else if (transition.type == "flip")
    presentation = flip({
      direction: transition.direction || "from-left",
    })
  else if (transition.type == "clockWipe")
    presentation = clockWipe({
      width: width,
      height: height,
    })
  else presentation = fade()

  if (transition.sound) {
    presentation = addSound(
      presentation as TransitionPresentation<Record<string, unknown>>,
      staticFile(`/sound/${transition.sound}`),
    )
  }

  return presentation
}

const calculateDurationInFrames = (
  scenes: z.infer<typeof editSchema>["scenes"],
) => {
  let totalDurationInFrames = 0

  for (const [index, scene] of scenes.entries()) {
    totalDurationInFrames += scene.durationInFrames
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
      titles: TitlesSchema,
    }),
  ),
})

export const EditComponent = ({
  scenes,
}: {
  scenes: z.infer<typeof editSchema>["scenes"]
}) => {
  return (
    <TransitionSeries>
      {scenes.map((scene, index) => (
        <>
          {scene.transition && (
            <TransitionSeries.Transition
              timing={springTiming({
                config: { damping: scene.transition.duration },
              })}
              presentation={
                getTransition(scene.transition) as TransitionPresentation<
                  Record<string, unknown>
                >
              }
            />
          )}

          <TransitionSeries.Sequence
            durationInFrames={scene.durationInFrames}
            key={index}
          >
            <Camera {...scene.camera} />
            {scene.captions && <Caption {...scene.captions} />}
            {scene.titles && <Title titles={scene.titles} />}
          </TransitionSeries.Sequence>
        </>
      ))}
    </TransitionSeries>
  )
}

export const EditComposition = () => {
  const inputProps = getInputProps<z.infer<typeof editSchema>>()

  const scenes = inputProps.scenes || editScenes.scenes
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
        fps,
        width,
        height,
      }}
    />
  )
}
