import React from "react"
import { TransitionSeries, linearTiming } from "@remotion/transitions"
import { fade } from "@remotion/transitions/fade"
import { TimelineElementRenderer } from "../components/timeline-element-renderer"
import { z } from "zod"
import { SceneSchema, TimelineElementSchema } from "@/schemas/timeline"

// Types
export type Scene = z.infer<typeof SceneSchema>
export type TimelineElement = z.infer<typeof TimelineElementSchema>

export const ProjectComposition: React.FC<{
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
