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
const IMAGE_URL_2 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747833511389-CleanShot%202025-05-21%20at%2015.18.21.png@2x.png"

const scenes: SceneType[] = [
  {
    duration: 3,
    layers: [
      {
        type: "image",
        url: IMAGE_URL,
        objectFit: "cover",
        position: {
          horizontalAlign: "center",
          verticalAlign: "center",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      },
      {
        type: "title",
        title: "Image Full Screen",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "image",
        url: IMAGE_URL_2,
        objectFit: "contain",
        style: "width: 800px;",
        position: {
          top: 0,
        },
      },
      {
        type: "title",
        title: "Fixe Sized Image",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "image",
        url: IMAGE_URL_2,
        objectFit: "contain",
        style:
          "width: 800px; height: auto;  border: 10px solid yellow; border-radius: 100px; box-shadow: 0 10px 100px rgba(0, 0, 0, 0.5);",
        position: {
          top: 0,
        },
      },
      {
        type: "title",
        title: "Styled Image",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 4,
    layers: [
      {
        type: "camera",
        url: VIDEO_URL,
        style: "filter: blur(2px);",
      },
      {
        type: "image",
        url: IMAGE_URL,
        objectFit: "contain",
        position: {
          left: 5,
          right: 5,
          bottom: 5,
          top: 50,
        },
        reveal: { type: "fade", duration: 0.5 },
      },
      {
        type: "title",
        title: "On top of video",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "image",
        url: IMAGE_URL,
        objectFit: "cover",
        style: "border-radius: 50%; width: 400px; height: 400px;",
        position: {
          horizontalAlign: "end",
          verticalAlign: "end",
          bottom: 40,
          right: 40,
        },
        effects: [{ type: "float", options: { amplitude: 0.7, speed: 0.7 } }],
      },
      {
        type: "title",
        title: "With Effect FLoat",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "image",
        url: IMAGE_URL,
        objectFit: "cover",
        style: "border-radius: 50%; width: 400px; height: 400px;",
        position: {
          horizontalAlign: "end",
          verticalAlign: "end",
          bottom: 40,
          right: 40,
        },
        effects: [{ type: "shake", options: { amplitude: 0.7, speed: 0.7 } }],
      },
      {
        type: "title",
        title: "With Effect Shake",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "image",
        url: IMAGE_URL,
        objectFit: "cover",
        style:
          "border-radius: 16px; width: 45%; height: 320px; margin-right: 2%;",
        position: { left: 50 },
      },
      {
        type: "image",
        url: IMAGE_URL_2,
        objectFit: "cover",
        style:
          "border-radius: 16px; width: 45%; height: 320px; margin-left: 2%;",
        position: { right: 50 },
      },
      {
        type: "title",
        title: "Side by side",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 4,
    layers: [
      {
        type: "image",
        url: IMAGE_URL,
        position: { left: 10, top: 10, right: 10, bottom: 10 },
        timing: { start: 0, end: 2.5 },
        reveal: { type: "fade", duration: 0.5 },
      },
      {
        type: "title",
        title: "With reveal",
        position: { verticalAlign: "start" },
      },
    ],
  },
]

export const DemoImage = ({
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
      id="DemoImage"
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
