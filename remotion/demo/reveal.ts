import { SceneOrTransition } from "@/schemas/timeline"
import { VIDEO_THAIS_3_URL } from "./urls"

const IMAGE_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747833791251-CleanShot%202025-05-21%20at%2015.23.00.png@2x.png"
const IMAGE_URL_2 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1747833511389-CleanShot%202025-05-21%20at%2015.18.21.png@2x.png"

const REVEAL_POSITION = { top: 20, left: 20, right: 20, bottom: 20 }

export const revealScenes = [
  // 1. Pas de reveal
  {
    duration: 2.5,
    timeline: [
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
  // 2. Reveal in (fade)
  {
    duration: 2.5,
    timeline: [
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
  // 3. Reveal out (slide-up)
  {
    duration: 2.5,
    timeline: [
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
  // 4. Reveal in + out (slide-left, durations différentes)
  {
    duration: 3,
    timeline: [
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
  // 5. Reveal in (zoom-in) sur image
  {
    duration: 2.5,
    timeline: [
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
  // 6. Reveal out (blur) sur camera
  {
    duration: 2.5,
    timeline: [
      {
        type: "title",
        title: "Reveal: Blur Out (camera)",
        position: { verticalAlign: "start" },
      },
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_3_URL,
        reveal: { type: "blur", outDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  // 7. Reveal in (slide-right) sur bloc coloré
  {
    duration: 2.5,
    timeline: [
      {
        type: "title",
        title: "Reveal: Slide Right In (bloc)",
        position: { verticalAlign: "start" },
      },
      {
        type: "color",
        color: "#4f46e5",
        style: "border-radius: 32px;",
        reveal: { type: "slide-right", inDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  // 8. Reveal in + out (zoom-out, fade) sur image
  {
    duration: 3,
    timeline: [
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
  // 9. Reveal in (blur) sur bloc coloré
  {
    duration: 2.5,
    timeline: [
      {
        type: "title",
        title: "Reveal: Blur In (bloc)",
        position: { verticalAlign: "start" },
      },
      {
        type: "color",
        color: "#f59e42",
        style: "border-radius: 32px;",
        reveal: { type: "blur", inDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
  // 10. Reveal in (slide-down) sur camera
  {
    duration: 2.5,
    timeline: [
      {
        type: "title",
        title: "Reveal: Slide Down In (camera)",
        position: { verticalAlign: "start" },
      },
      {
        type: "camera",
        videoUrl: VIDEO_THAIS_3_URL,
        reveal: { type: "slide-down", inDuration: 0.7 },
        position: REVEAL_POSITION,
      },
    ],
  },
] as SceneOrTransition[]

const reveal = {
  scenes: revealScenes,
}

export default reveal
