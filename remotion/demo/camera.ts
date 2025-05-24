import { Scene } from "@/schemas/index_2"

const VIDEO_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/4e629c9b-f4f9-4628-9cc5-d561d477dbdd.mp4"
const IMAGE_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747833791251-CleanShot%202025-05-21%20at%2015.23.00.png@2x.png"
const IMAGE_URL_2 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747833511389-CleanShot%202025-05-21%20at%2015.18.21.png@2x.png"

const cameraScenes: Scene[] = [
  // 1. Vidéo de fond simple
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
      },
      {
        type: "title",
        title: "Simple Video",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        keyFrames: [
          { time: 0, value: { scale: 1 } },
          { time: 2.5, value: { scale: 1.5 } },
          { time: 5, value: { scale: 1 } },
        ],
      },
      {
        type: "title",
        title: "Zoom keyframes",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        keyFrames: [
          { time: 0, value: { blur: 10 } },
          { time: 2.5, value: { blur: 20 } },
        ],
      },
      {
        type: "title",
        title: "Blur keyframes",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        keyFrames: [
          { time: 0, value: { scale: 2, top: 500 } },
          { time: 5, value: { scale: 2, top: 0 } },
        ],
      },
      {
        type: "title",
        title: "Position keyframes",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: IMAGE_URL,
      },
      {
        type: "title",
        title: "Using Image",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: IMAGE_URL,
        keyFrames: [
          { time: 0, value: { scale: 1, blur: 0 } },
          { time: 2.5, value: { scale: 1.5, blur: 10 } },
          { time: 5, value: { scale: 1, blur: 0 } },
        ],
      },
      {
        type: "title",
        title: "Image with keyframes",
        position: { verticalAlign: "start" },
      },
    ],
  },
  // 4. Vidéo avec keyframes de volume (contrôle du son)
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        keyFrames: [
          { time: 1, value: { volume: 0 } },
          { time: 2.5, value: { volume: 1 } },
          { time: 4, value: { volume: 0 } },
        ],
      },
      {
        type: "title",
        title: "Volume keyframes",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: IMAGE_URL_2,
        position: { bottom: 50 },
        keyFrames: [
          { time: 0, value: { scale: 1 } },
          { time: -0.001, value: { scale: 1.5 } },
        ],
      },
      {
        type: "camera",
        url: VIDEO_URL,
        position: { top: 50 },
      },
      {
        type: "title",
        title: "Split screen",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        position: { bottom: 40, left: 20, right: 20, top: 40 },
      },
      {
        type: "title",
        title: "Boxed ",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        position: {
          bottom: 40,
          left: 20,
          right: 20,
          top: 40,
          keyframes: [
            { time: 0, value: { bottom: 0 } },
            { time: 5, value: { bottom: 30 } },
          ],
        },
      },
      {
        type: "title",
        title: "Boxed moving",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        offsetY: 300,
        position: { bottom: 40, left: 20, right: 20, top: 40 },
      },
      {
        type: "title",
        title: "Offset ",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        position: { bottom: -5, left: -5, right: -5, top: -5 },
        effects: [{ type: "float", options: { amplitude: 0.5 } }],
      },
      {
        type: "title",
        title: "Float effect",
        position: { verticalAlign: "start" },
      },
    ],
  },
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        url: VIDEO_URL,
        position: { bottom: -5, left: -5, right: -5, top: -5 },
        effects: [{ type: "tilt3D", options: { amplitude: 0.1, speed: 0.1 } }],
      },
      {
        type: "title",
        title: "Tilt3D effect",
        position: { verticalAlign: "start" },
      },
    ],
  },
]

const camera = {
  scenes: cameraScenes,
}

export default camera
