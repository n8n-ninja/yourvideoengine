import { Composition } from "remotion"
import { SceneType } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard } from "@/schemas/project"
import { VIDEO_THAIS_3_URL } from "./urls"

const IMAGE_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747833791251-CleanShot%202025-05-21%20at%2015.23.00.png@2x.png"
const IMAGE_URL_2 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747833511389-CleanShot%202025-05-21%20at%2015.18.21.png@2x.png"

const REVEAL_POSITION = { top: 20, left: 20, right: 20, bottom: 20 }

const COLOR_PURPLE_DATA_URI =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%234f46e5"/></svg>'
const COLOR_ORANGE_DATA_URI =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f59e42"/></svg>'

const scenes: SceneType[] = [
  {
    duration: 2.5,
    layers: [
      {
        type: "title",
        title: "No reveal",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: IMAGE_URL,
        objectFit: "cover",
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 2.5,
    layers: [
      {
        type: "title",
        title: "Reveal: Fade In",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: IMAGE_URL_2,
        objectFit: "contain",
        reveal: { type: "fade", inDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 2.5,
    layers: [
      {
        type: "title",
        title: "Reveal: Slide Up Out",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: IMAGE_URL,
        objectFit: "contain",
        reveal: { type: "slide-up", outDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Reveal: Slide Left In+Out",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: IMAGE_URL_2,
        objectFit: "contain",
        reveal: { type: "slide-left", inDuration: 0.5, outDuration: 1 },
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 2.5,
    layers: [
      {
        type: "title",
        title: "Reveal: Zoom In (image)",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: IMAGE_URL,
        objectFit: "cover",
        reveal: { type: "zoom-in", inDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 2.5,
    layers: [
      {
        type: "title",
        title: "Reveal: Blur Out (camera)",
        position: { verticalAlign: "start" },
      },
      {
        type: "camera",
        url: VIDEO_THAIS_3_URL,
        reveal: { type: "blur", outDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 2.5,
    layers: [
      {
        type: "title",
        title: "Reveal: Slide Right In (bloc)",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: COLOR_PURPLE_DATA_URI,
        style: "border-radius: 32px;",
        reveal: { type: "slide-right", inDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Reveal: Zoom Out In + Fade Out (image)",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: IMAGE_URL_2,
        objectFit: "contain",
        reveal: {
          inType: "zoom-out",
          inDuration: 0.5,
          outType: "fade",
          outDuration: 1,
        },
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 2.5,
    layers: [
      {
        type: "title",
        title: "Reveal: Blur In (bloc)",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: COLOR_ORANGE_DATA_URI,
        style: "border-radius: 32px;",
        reveal: { type: "blur", inDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  {
    duration: 2.5,
    layers: [
      {
        type: "title",
        title: "Reveal: Slide Down In (camera)",
        position: { verticalAlign: "start" },
      },
      {
        type: "camera",
        url: VIDEO_THAIS_3_URL,
        reveal: { type: "slide-down", inDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
]

export const DemoReveal = ({
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
      id="DemoReveal"
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
