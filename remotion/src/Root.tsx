import React from "react"
import "./fonts.css"
import { Composition, getInputProps } from "remotion"
import {
  ProjectComposition,
  Scene,
  TimelineElement,
} from "./compositions/ProjectComposition"
import { ProjectSchema } from "@/schemas/timeline"

export const RemotionRoot: React.FC = () => {
  const inputProps = getInputProps<{
    fps: number
    width: number
    height: number
    scenes: Scene[]
    globalTimeline?: TimelineElement[]
  }>()

  const fps = inputProps.fps || 30
  const width = inputProps.width || 1080
  const height = inputProps.height || 1920

  const scenes = inputProps.scenes ?? [
    {
      duration: 3,
      timeline: [
        {
          type: "camera",
          videoUrl:
            "https://diwa7aolcke5u.cloudfront.net/uploads/1747680671222-IMG_1402.JPG",
          position: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 50,
            verticalAlign: "center",
          },
          keyFrames: [
            { time: 0, value: { scale: 1, blur: 10 } },
            { time: 1, value: { scale: 1.2, blur: 0 } },
          ],
          volume: 0,
        },
        {
          type: "camera",
          videoUrl:
            "https://diwa7aolcke5u.cloudfront.net/uploads/4fce909b-5604-4f8d-8a86-d5962d7313a8.mp4",
          position: {
            top: 50,
            left: 0,
            right: 0,
            bottom: 0,
            verticalAlign: "center",
          },
          keyFrames: [
            { time: 1, value: { scale: 1.4, volume: 0 } },
            { time: 2, value: { scale: 1, volume: 1 } },
          ],
        },
        {
          type: "image",
          url: "https://diwa7aolcke5u.cloudfront.net/uploads/1747680671222-IMG_1402.JPG",
          position: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
            verticalAlign: "center",
          },
          effects: [
            {
              type: "wobble",
              options: { amplitude: 50, speed: 50, axis: "x" },
            },
            // { type: "pulse", options: { amplitude: 0.15, speed: 1.5 } },
            // { type: "pop", options: { amplitude: 10, speed: 30 } },
            // {
            //   type: "shake",
            //   options: { amplitude: 12, speed: 10 },
            // },
            // {
            //   type: "blink",
            //   options: { speed: 9, minOpacity: 0, maxOpacity: 0.6 },
            // },
            // {
            //   type: "pointer",
            //   options: {
            //     direction: "bottom-right",
            //     speed: 2,
            //     amplitude: 100,
            //   },
            // },
          ],
          style:
            "box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5); border: 10px solid red; border-radius: 100px;",
        },
        {
          type: "title",
          title:
            "Bienvenue sur terre la vie est belle et bien faite de miracle.",
          position: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 40,
            verticalAlign: "center",
          },
          containerStyle: {
            backgroundColor: "red",
          },
          timing: {
            start: 1,
            duration: 2,
          },
          transition: {
            duration: 0.4,
            type: "fade",
          },
        },
        {
          type: "caption",
          timing: { start: 1, duration: 2 },
          words: [
            { word: "Hello", start: 0, end: 1 },
            { word: "world", start: 1, end: 2 },
          ],
          position: {
            top: 50,
            verticalAlign: "center",
          },
        },
        {
          type: "scanline",
          timing: { start: 1, duration: 3 },
          transition: {
            type: "fade",
            duration: 2.4,
          },
          position: {
            top: 40,
            left: 0,
            right: 0,
            bottom: 0,
            verticalAlign: "center",
          },
          opacity: 1,
          intensity: 90,
          size: 50,
          color: "red",
        },
        {
          type: "sound",
          timing: { start: 0, duration: 3 },
          transition: {
            duration: 2.4,
          },
          sound: "woosh-1.mp3",
        },
      ],
      transition: { type: "fade", duration: 1 },
    },
  ]

  const globalTimeline = inputProps.globalTimeline ?? []

  const totalFrames = Math.round(
    scenes.reduce((acc, scene) => acc + (scene.duration ?? 0), 0) * fps,
  )

  const theme = {
    caption: {
      boxStyle: { backgroundColor: "pink" },
    },
  }

  return (
    <Composition
      id="Edit"
      component={ProjectComposition}
      durationInFrames={totalFrames}
      fps={fps}
      width={width}
      height={height}
      schema={ProjectSchema}
      defaultProps={{
        scenes,
        globalTimeline,
        theme,
      }}
    />
  )
}
