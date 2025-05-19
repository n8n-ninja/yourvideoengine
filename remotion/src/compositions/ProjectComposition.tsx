import React from "react"
import { TransitionSeries, linearTiming } from "@remotion/transitions"
import { fade } from "@remotion/transitions/fade"
import { TimelineElementRenderer } from "../components/TimelineElement"
import { z } from "zod"
import { SceneSchema, TimelineElementSchema } from "@/schemas/timeline"
import { ThemeProvider } from "../components/theme-context"
import type { Theme } from "@/styles/default-style"
import { useVideoConfig } from "remotion"
// Types
export type Scene = z.infer<typeof SceneSchema>
export type TimelineElement = z.infer<typeof TimelineElementSchema>

export const ProjectComposition: React.FC<{
  scenes: Scene[]
  globalTimeline?: TimelineElement[]

  theme?: Theme
}> = ({ scenes, globalTimeline, theme }) => {
  const { fps } = useVideoConfig()
  return (
    <ThemeProvider value={theme ?? {}}>
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
    </ThemeProvider>
  )
}
