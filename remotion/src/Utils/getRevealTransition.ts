import type { TransitionReveal } from "@/schemas/project"

import {
  interpolateStyles,
  makeTransform,
  translateY,
  translateX,
  scale,
  rotateY,
  rotateX,
  translateZ,
  perspective,
  rotate,
  rotate3d,
} from "@remotion/animation-utils"

/**
 * Computes the CSS style for a reveal transition based on the phase and progress.
 * @param params.transition The transition configuration (TransitionReveal).
 * @param params.phase The current phase: 'in', 'steady', or 'out'.
 * @param params.progressIn The progress value for the 'in' phase (0 to 1).
 * @param params.progressOut The progress value for the 'out' phase (0 to 1).
 * @returns A React.CSSProperties object representing the style for the transition.
 */
export const getRevealTransitionStyle = ({
  transition = {},
  phase,
  progressIn,
  progressOut,
}: {
  transition?: TransitionReveal
  phase: "in" | "steady" | "out"
  progressIn: number
  progressOut: number
}): React.CSSProperties => {
  const inType = transition.inType ?? transition.type ?? "fade"
  const outType = transition.outType ?? transition.type ?? "fade"
  const style: React.CSSProperties = {}
  if (phase === "in") {
    if (inType === "blur") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [
          { opacity: 0, filter: "blur(20px)" },
          { opacity: 1, filter: "blur(0px)" },
        ],
      )
    }
    if (inType === "fade") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [{ opacity: 0 }, { opacity: 1 }],
      )
    }
    if (inType === "slide-up") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [
          { opacity: 0, transform: makeTransform([translateY(40)]) },
          { opacity: 1, transform: makeTransform([translateY(0)]) },
        ],
      )
    }
    if (inType === "slide-down") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [
          { opacity: 0, transform: makeTransform([translateY(-40)]) },
          { opacity: 1, transform: makeTransform([translateY(0)]) },
        ],
      )
    }
    if (inType === "slide-left") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [
          { opacity: 0, transform: makeTransform([translateX(40)]) },
          { opacity: 1, transform: makeTransform([translateX(0)]) },
        ],
      )
    }
    if (inType === "slide-right") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [
          { opacity: 0, transform: makeTransform([translateX(-40)]) },
          { opacity: 1, transform: makeTransform([translateX(0)]) },
        ],
      )
    }
    if (inType === "zoom-in") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [
          { opacity: 0, transform: makeTransform([scale(0.5)]) },
          { opacity: 1, transform: makeTransform([scale(1)]) },
        ],
      )
    }
    if (inType === "zoom-out") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [
          { opacity: 0, transform: makeTransform([scale(1.5)]) },
          { opacity: 1, transform: makeTransform([scale(1)]) },
        ],
      )
    }
    if (inType === "swipe") {
      return interpolateStyles(
        progressIn,
        [0, 1],
        [
          {
            opacity: 0,
            transform: makeTransform([
              scale(0.8),
              translateX(-1040),
              translateY(200),
              rotate(-40),
            ]),
          },
          {
            opacity: 1,
            transform: makeTransform([
              scale(1),
              translateX(0),
              translateY(0),
              rotate(0),
            ]),
          },
        ],
      )
    }
  } else if (phase === "out") {
    if (outType === "blur") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [
          { opacity: 1, filter: "blur(0px)" },
          { opacity: 0, filter: "blur(20px)" },
        ],
      )
    }
    if (outType === "fade") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [{ opacity: 1 }, { opacity: 0 }],
      )
    }
    if (outType === "slide-up") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [
          { opacity: 1, transform: makeTransform([translateY(0)]) },
          { opacity: 0, transform: makeTransform([translateY(40)]) },
        ],
      )
    }
    if (outType === "slide-down") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [
          { opacity: 1, transform: makeTransform([translateY(0)]) },
          { opacity: 0, transform: makeTransform([translateY(-40)]) },
        ],
      )
    }
    if (outType === "slide-left") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [
          { opacity: 1, transform: makeTransform([translateX(0)]) },
          { opacity: 0, transform: makeTransform([translateX(40)]) },
        ],
      )
    }
    if (outType === "slide-right") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [
          { opacity: 1, transform: makeTransform([translateX(0)]) },
          { opacity: 0, transform: makeTransform([translateX(-40)]) },
        ],
      )
    }
    if (outType === "zoom-in") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [
          { opacity: 1, transform: makeTransform([scale(1)]) },
          { opacity: 0, transform: makeTransform([scale(0.5)]) },
        ],
      )
    }
    if (outType === "zoom-out") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [
          { opacity: 1, transform: makeTransform([scale(1)]) },
          { opacity: 0, transform: makeTransform([scale(1.5)]) },
        ],
      )
    }
    if (outType === "fancy-3d") {
      return interpolateStyles(
        1 - progressOut,
        [0, 1],
        [
          {
            opacity: 1,
            transform: makeTransform([
              scale(1),
              translateX(0),
              translateY(0),
              rotate(0),
            ]),
          },
          {
            opacity: 0,
            transform: makeTransform([
              scale(0.8),
              translateX(1040),
              translateY(200),
              rotate(40),
            ]),
          },
        ],
      )
    }
    style.opacity = progressOut
  } else {
    style.opacity = 1
    style.transform = "none"
    style.filter = "none"
  }
  return style
}
