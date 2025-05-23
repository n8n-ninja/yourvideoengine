import { Scene } from "@/schemas"
import type { TransitionScene } from "@/schemas/timeline"

const transitionScenes: (Scene | TransitionScene)[] = [
  {
    duration: 3,
    timeline: [{ type: "title", title: "Démo transitions entre scènes" }],
  },
  {
    type: "transition",
    animation: "fade",
    duration: 0.7,
  },
  {
    duration: 3,
    timeline: [{ type: "title", title: "Transition: Fade → Slide" }],
  },
  {
    type: "transition",
    animation: "slide",
    duration: 0.7,
    direction: "from-left",
  },
  {
    duration: 3,
    timeline: [{ type: "title", title: "Transition: Slide → Zoom" }],
  },
  {
    type: "transition",
    animation: "zoom",
    duration: 0.7,
  },
  {
    duration: 3,
    timeline: [{ type: "title", title: "Transition: Zoom → Flip" }],
  },
  {
    type: "transition",
    animation: "flip",
    duration: 0.7,
    direction: "from-top",
  },
  {
    duration: 3,
    timeline: [{ type: "title", title: "Transition: Flip → Wipe" }],
  },
  {
    type: "transition",
    animation: "wipe",
    duration: 0.7,
    wipeDirection: "from-bottom-right",
  },
  {
    duration: 3,
    timeline: [{ type: "title", title: "Transition: Wipe → ClockWipe" }],
  },
  {
    type: "transition",
    animation: "clockWipe",
    duration: 0.7,
  },
  {
    duration: 3,
    timeline: [{ type: "title", title: "Fin de la démo des transitions" }],
  },
]

const transition = {
  scenes: transitionScenes,
}

export default transition
