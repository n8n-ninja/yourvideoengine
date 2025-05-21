import { Scene, TimelineItem } from "@/schemas"

const VIDEO_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/4e629c9b-f4f9-4628-9cc5-d561d477dbdd.mp4"
const IMAGE_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747685664336-hugging-emoji.webp"

const cameraScenes: Scene[] = [
  // 1. Vidéo de fond simple
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_URL,
      },
    ],
  },
  // 2. Image de fond simple
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        videoUrl: IMAGE_URL,
      },
    ],
  },
  // 3. Vidéo avec keyframes de zoom et blur
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_URL,
        keyFrames: [
          { time: 0, value: { scale: 1, blur: 0 } },
          { time: 2.5, value: { scale: 1.5, blur: 10 } },
          { time: 5, value: { scale: 1, blur: 0 } },
        ],
      },
    ],
  },
  // 4. Vidéo avec keyframes de volume (contrôle du son)
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        videoUrl: VIDEO_URL,
        keyFrames: [
          { time: 0, value: { volume: 0 } },
          { time: 2.5, value: { volume: 1 } },
          { time: 5, value: { volume: 0 } },
        ],
      },
    ],
  },
  // 5. Split screen haut/bas (image en haut, vidéo en bas)
  {
    duration: 5,
    timeline: [
      {
        type: "camera",
        videoUrl:
          "https://diwa7aolcke5u.cloudfront.net/uploads/1747833511389-CleanShot%202025-05-21%20at%2015.18.21.png@2x.png",
        position: { left: 0, bottom: 50 },
      },
      {
        type: "camera",
        videoUrl: VIDEO_URL,
        position: { left: 0, top: 50, bottom: 0, right: 0 },
      },
    ],
  },
]

const camera = {
  scenes: cameraScenes,
}

export default camera
