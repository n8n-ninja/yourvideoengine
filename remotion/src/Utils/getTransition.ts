import { fade } from "@remotion/transitions/fade"
import { wipe } from "@remotion/transitions/wipe"
import { slide } from "@remotion/transitions/slide"
import { flip } from "@remotion/transitions/flip"
import { clockWipe } from "@remotion/transitions/clock-wipe"
import { TransitionPresentation } from "@remotion/transitions"
import { addSound } from "./addSound"
import { Transition } from "@/schemas"

/**
 * Returns a Remotion transition presentation based on the given transition config.
 * Supports fade, wipe, slide, flip, clockWipe, and custom sound overlays.
 *
 * @param transition The transition configuration (type, direction, sound, etc).
 * @param width The width for clockWipe transitions (default: 1080).
 * @param height The height for clockWipe transitions (default: 1920).
 * @returns A TransitionPresentation object for Remotion transitions.
 */
export const getTransition = (
  transition: Transition,
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
      transition.sound,
    )
  }

  return presentation as TransitionPresentation<Record<string, unknown>>
}
