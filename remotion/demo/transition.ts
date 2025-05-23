import { Scene } from "@/schemas"
import type { TransitionScene } from "@/schemas/timeline"
import {
  VIDEO_THAIS_1_URL,
  VIDEO_THAIS_2_URL,
  VIDEO_THAIS_3_URL,
  VIDEO_THAIS_4_URL,
  VIDEO_THAIS_5_URL,
} from "./urls"

const transitionScenes: (Scene | TransitionScene)[] = [
  {
    type: "transition",
    animation: "clockWipe",
    duration: 1,
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_1_URL,
      },
      { type: "title", title: "Transition between scenes" },
    ],
  },
  {
    type: "transition",
    animation: "fade",
    duration: 0.3,
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_2_URL,
      },
      { type: "title", title: "Transition: Fade" },
    ],
  },
  {
    type: "transition",
    animation: "slide",
    duration: 0.3,
    direction: "from-left",
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_3_URL,
      },
      { type: "title", title: "Transition: Slide" },
    ],
  },
  {
    type: "transition",
    animation: "slide",
    duration: 0.3,
    direction: "from-bottom",
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_5_URL,
      },
      { type: "title", title: "Transition: Slide Bottom" },
    ],
  },
  {
    type: "transition",
    animation: "fade",
    sound: "woosh-1.mp3",
    duration: 0.3,
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_4_URL,
      },
      { type: "title", title: "Transition: With sound" },
    ],
  },
  {
    type: "transition",
    animation: "flip",
    duration: 0.3,
    direction: "from-top",
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_5_URL,
      },
      { type: "title", title: "Transition: Flip" },
    ],
  },
  {
    type: "transition",
    animation: "flip",
    duration: 0.3,
    direction: "from-left",
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_5_URL,
      },
      { type: "title", title: "Transition: Flip Left" },
    ],
  },
  {
    type: "transition",
    animation: "wipe",
    duration: 0.3,
    wipeDirection: "from-bottom-right",
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_1_URL,
      },
      { type: "title", title: "Transition: Wipe" },
    ],
  },
  {
    type: "transition",
    animation: "wipe",
    duration: 0.3,
    wipeDirection: "from-left",
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_2_URL,
      },
      { type: "title", title: "Transition: Wipe Left" },
    ],
  },
  {
    type: "transition",
    animation: "clockWipe",
    duration: 0.3,
  },
  {
    duration: 3,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_3_URL,
      },
      { type: "title", title: "End of the transition demo" },
    ],
  },
  {
    type: "transition",
    animation: "clockWipe",
    duration: 3,
  },
]

const transition = {
  scenes: transitionScenes,
}

export default transition
