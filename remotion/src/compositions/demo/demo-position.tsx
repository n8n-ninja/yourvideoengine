import { Composition } from "remotion"
import { SceneType } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard } from "@/schemas/project"

const VIDEO_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/4e629c9b-f4f9-4628-9cc5-d561d477dbdd.mp4"
const IMAGE_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747833791251-CleanShot%202025-05-21%20at%2015.23.00.png@2x.png"

const scenes: SceneType[] = [
  {
    duration: 5,
    layers: [
      {
        type: "camera",
        url: VIDEO_URL,
      },
      {
        type: "title",
        title: "Static Position",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    layers: [
      {
        type: "camera",
        url: VIDEO_URL,
        position: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          keyframes: [
            { time: 0, value: { bottom: 0 } },
            { time: 5, value: { bottom: 50 } },
          ],
        },
      },
      {
        type: "title",
        title: "Position with keyframes",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    layers: [
      {
        type: "camera",
        url: VIDEO_URL,
        position: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          keyframes: [
            {
              time: 0,
              value: {
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px",
              },
            },
            {
              time: 5,
              value: {
                top: "500px",
                bottom: "500px",
                left: "200px",
                right: "200px",
              },
            },
          ],
        },
      },
      {
        type: "title",
        title: "Keyframes with PX",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    layers: [
      {
        type: "title",
        title: "Position with title",
        position: {
          keyframes: [
            {
              time: 0,
              value: {
                top: 10,
              },
            },
            {
              time: 5,
              value: {
                top: 80,
              },
            },
          ],
        },
      },
    ],
  },
  {
    duration: 5,
    layers: [
      {
        type: "title",
        title: "With Container Style",
        containerStyle:
          "background-color: red; padding: 10px; border-radius: 10px; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);",
        position: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
          keyframes: [
            {
              time: 0,
              value: {
                top: 10,
              },
            },
            {
              time: 5,
              value: {
                top: 80,
              },
            },
          ],
        },
      },
    ],
  },
  {
    duration: 5,
    layers: [
      {
        type: "title",
        title: "With Timing and Transition",
        containerStyle:
          "background-color: orange; padding: 10px; border-radius: 10px; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);",
        reveal: {
          type: "fade",
          duration: 1,
        },
        timing: {
          start: 1,
          end: 4,
        },
        position: {
          top: 80,
          left: 10,
          right: 10,
          bottom: 10,
          keyframes: [
            {
              time: 0,
              value: {
                top: 80,
              },
            },
            {
              time: 5,
              value: {
                top: 10,
              },
            },
          ],
        },
      },
    ],
  },
  {
    duration: 5,
    layers: [
      {
        type: "image",
        url: IMAGE_URL,
        position: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          keyframes: [
            { time: 0, value: { bottom: 0 } },
            { time: 5, value: { bottom: 50 } },
          ],
        },
      },
      {
        type: "title",
        title: "With Image",
        position: { verticalAlign: "end" },
      },
    ],
  },
]

export const DemoPosition = ({
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
      id="DemoPosition"
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
