import { Composition } from "remotion"
import { SceneType } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard } from "@/schemas/project"

const scenes: SceneType[] = [
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Float",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [{ type: "float", options: { amplitude: 0.5, speed: 0.5 } }],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Shake",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [{ type: "shake", options: { amplitude: 0.5, speed: 0.5 } }],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Zoom",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [{ type: "zoom", options: { amplitude: 0.5 } }],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "fade",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [{ type: "fade", options: { duration: 0.5 } }],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Blur",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [{ type: "blur", options: { amount: 0.8 } }],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Grayscale",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [{ type: "grayscale", options: { amount: 0.8 } }],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Sepia",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [{ type: "sepia", options: { amount: 0.8 } }],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Rotate",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [{ type: "rotate", options: { angle: 0.5 } }],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Rotate (oscillate)",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        objectFit: "contain",
        effects: [
          { type: "rotate", options: { angle: 0.5, mode: "oscillate" } },
        ],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Rotate (step)",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [
          {
            type: "rotate",
            options: { angle: 0.5, mode: "step", stepCount: 8 },
          },
        ],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Pointer",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [
          {
            type: "pointer",
            options: { direction: "top", amplitude: 0.5, speed: 0.5 },
          },
        ],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Pop",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [
          { type: "pop", options: { amplitude: 0.5, speed: 0.5, mode: "pop" } },
        ],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Pulse",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [
          {
            type: "pulse",
            options: { amplitude: 0.5, speed: 0.5, mode: "pulse" },
          },
        ],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Wobble",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [
          {
            type: "wobble",
            options: { amplitude: 0.5, speed: 0.5, axis: "all" },
          },
        ],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Swing3D",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [
          {
            type: "swing3D",
            options: {
              amplitude: 0.5,
              speed: 0.5,
              axis: "y",
              perspective: "600px",
            },
          },
        ],
      },
    ],
  },
  {
    duration: 3,
    layers: [
      {
        type: "title",
        title: "Tilt3D",
        position: { verticalAlign: "start" },
      },
      {
        type: "image",
        objectFit: "contain",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp",
        timing: { start: 0.2, end: -0.4 },
        reveal: { type: "fade", duration: 0.2 },
        effects: [
          {
            type: "tilt3D",
            options: {
              amplitude: 0.5,
              speed: 0.5,
              axis: "xy",
              perspective: "600px",
            },
          },
        ],
      },
    ],
  },
]

export const DemoEffect = ({
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
      id="DemoEffect"
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
