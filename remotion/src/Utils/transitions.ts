import { z } from "zod"
import { fade } from "@remotion/transitions/fade"
import { wipe } from "@remotion/transitions/wipe"
import { slide } from "@remotion/transitions/slide"
import { flip } from "@remotion/transitions/flip"
import { clockWipe } from "@remotion/transitions/clock-wipe"
import { TransitionPresentation } from "@remotion/transitions"
import { staticFile } from "remotion"
import { addSound } from "./addSound"

export const TransitionSchema = z.object({
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

export const getTransition = (
  transition: z.infer<typeof TransitionSchema>,
  width = 1080,
  height = 1920,
): TransitionPresentation<Record<string, unknown>> => {
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

  return presentation as TransitionPresentation<Record<string, unknown>>
}
