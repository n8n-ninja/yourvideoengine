import React from "react"
import "./fonts.css"
import { Composition, getInputProps } from "remotion"
import { z } from "zod"
import { TimelineElementRenderer } from "./components/timeline-element-renderer"
import {
  SceneSchema,
  TimelineElementSchema,
  ProjectSchema,
} from "@/schemas/timeline"
import { TransitionSeries, linearTiming } from "@remotion/transitions"
import { fade } from "@remotion/transitions/fade"

// Types
type Scene = z.infer<typeof SceneSchema>
type TimelineElement = z.infer<typeof TimelineElementSchema>

// Composant qui reçoit les props
const ProjectComposition: React.FC<{
  scenes: Scene[]
  globalTimeline?: TimelineElement[]
  fps: number
}> = ({ scenes, globalTimeline, fps }) => {
  return (
    <>
      <TransitionSeries>
        {scenes.map((scene: Scene, sceneIdx: number) => (
          <React.Fragment key={sceneIdx}>
            <TransitionSeries.Sequence
              durationInFrames={Math.round((scene.duration ?? 0) * fps)}
            >
              {scene.timeline.map((element: TimelineElement, i: number) => (
                <TimelineElementRenderer key={i} element={element} />
              ))}
            </TransitionSeries.Sequence>
            {sceneIdx < scenes.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({
                  durationInFrames: Math.round(
                    (scene.transition?.duration ?? 1) * fps,
                  ),
                })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
      {globalTimeline?.map((element: TimelineElement, i: number) => (
        <TimelineElementRenderer key={`global-${i}`} element={element} />
      ))}
    </>
  )
}

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
            "https://diwa7aolcke5u.cloudfront.net/uploads/4fce909b-5604-4f8d-8a86-d5962d7313a8.mp4",
          position: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 50,
            verticalAlign: "center",
          },
          animationKeyframes: [
            { time: 0, value: { scale: 1, blur: 10 } },
            { time: 1, value: { scale: 1.2, blur: 0 } },
          ],
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
          animationKeyframes: [
            { time: 0, value: { scale: 1.4 } },
            { time: 1, value: { scale: 1 } },
          ],
          volume: 0,
        },
        // {
        //   type: "caption",
        //   timing: { start: 1, duration: 2 },
        //   words: [
        //     { word: "Hello", start: 0, end: 1 },
        //     { word: "world", start: 1, end: 2 },
        //   ],
        // },
        // {
        //   type: "title",
        //   timing: { start: 1, duration: 2 },
        //   title: "Bienvenue !",
        // },
        // {
        //   type: "sound",
        //   timing: { start: 0, duration: 3 },
        //   sound: "woosh-1.mp3",
        // },
      ],
      transition: { type: "fade", duration: 1 },
    },
  ]

  const globalTimeline = inputProps.globalTimeline ?? []

  const totalFrames = Math.round(
    scenes.reduce((acc, scene) => acc + (scene.duration ?? 0), 0) * fps,
  )

  return (
    <Composition
      id="Edit"
      component={(props: {
        scenes: Scene[]
        globalTimeline?: TimelineElement[]
      }) => <ProjectComposition {...props} fps={fps} />}
      durationInFrames={totalFrames}
      fps={fps}
      width={width}
      height={height}
      schema={ProjectSchema}
      defaultProps={{
        scenes,
        globalTimeline,
      }}
    />
  )
}
