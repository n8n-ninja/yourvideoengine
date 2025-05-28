import { TransitionSeries, linearTiming } from "@remotion/transitions"
import { fade } from "@remotion/transitions/fade"
import { wipe } from "@remotion/transitions/wipe"
import { slide } from "@remotion/transitions/slide"
import { flip } from "@remotion/transitions/flip"
import { clockWipe } from "@remotion/transitions/clock-wipe"
import type { TransitionPresentation } from "@remotion/transitions"

export type AnimationType = "wipe" | "slide" | "flip" | "clockWipe"
export type DirectionType =
  | "from-left"
  | "from-right"
  | "from-top"
  | "from-bottom"

interface TransitionProps {
  animation?: AnimationType
  direction?: DirectionType
  duration?: number // in seconds
  fps?: number
  width?: number
  height?: number
  idx?: number | string
}

export const getTransition = ({
  animation = "fade" as AnimationType,
  direction = "from-left",
  duration = 1,
  fps = 30,
  width = 1080,
  height = 1920,
  idx,
}: TransitionProps = {}) => {
  let presentation: TransitionPresentation<any>

  if (animation === "wipe") {
    presentation = wipe({ direction: direction ?? "from-left" })
  } else if (animation === "slide") {
    presentation = slide({ direction: direction ?? "from-left" })
  } else if (animation === "flip") {
    presentation = flip({ direction: direction ?? "from-left" })
  } else if (animation === "clockWipe") {
    presentation = clockWipe({ width, height })
  } else {
    presentation = fade()
  }

  const durationInFrames = Math.round(duration ?? 1)

  return (
    <TransitionSeries.Transition
      key={idx}
      presentation={presentation}
      timing={linearTiming({ durationInFrames })}
    />
  )
}
