import { Composition } from "remotion"
import { SegmentType } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard } from "@/schemas/project"
import {
  VIDEO_THAIS_1_URL,
  VIDEO_THAIS_2_URL,
  VIDEO_THAIS_3_URL,
  VIDEO_THAIS_4_URL,
  VIDEO_THAIS_5_URL,
} from "./urls"

const scenes: SegmentType[] = [
  {
    type: "transition",
    animation: "clockWipe",
    duration: 1,
  },
  {
    duration: 3,
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_1_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_2_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_3_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_5_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_4_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_5_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_5_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_1_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_2_URL,
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
    layers: [
      {
        type: "camera",
        url: VIDEO_THAIS_3_URL,
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

export const DemoTransition = ({
  fps = 30,
  width = 1080,
  height = 1920,
}: {
  fps?: number
  width?: number
  height?: number
}) => {
  return (
    <Composition
      id="DemoTransition"
      component={ProjectComposition}
      durationInFrames={scenes.length * 30}
      fps={fps}
      width={width}
      height={height}
      schema={Storyboard}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        tracks: scenes,
      }}
    />
  )
}
