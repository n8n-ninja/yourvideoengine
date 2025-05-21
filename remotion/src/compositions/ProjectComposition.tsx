import React from "react"
import { TransitionSeries } from "@remotion/transitions"
import { TimelineElementRenderer } from "../components/TimelineElement"
import { z } from "zod"
import { SceneSchema, TimelineElementSchema } from "@/schemas/timeline"
import { ThemeProvider } from "../components/theme-context"
import type { Theme } from "@/styles/default-style"
import {
  AbsoluteFill,
  useVideoConfig,
  CalculateMetadataFunction,
} from "remotion"
// Types
export type Scene = z.infer<typeof SceneSchema>
export type TimelineElement = z.infer<typeof TimelineElementSchema>

export const calculateMetadata: CalculateMetadataFunction<{
  scenes: Scene[]
}> = ({ props, defaultProps, abortSignal }) => {
  return {
    // Change the metadata
    durationInFrames: props.scenes.reduce(
      (acc, scene) => acc + (scene.duration ?? 0) * 30,
      0,
    ),
  }
}

export const ProjectComposition: React.FC<{
  scenes: Scene[]
  globalTimeline?: TimelineElement[]
  theme?: Theme
  background?: string // facultatif
}> = ({ scenes, globalTimeline, theme, background }) => {
  const { fps } = useVideoConfig()

  console.log(background)
  // Composant pour gérer le fond
  const BackgroundRenderer: React.FC<{ background?: string }> = ({
    background,
  }) => {
    if (!background) return null
    // Regex couleur simple (hex, rgb, nom)
    const isColor =
      /^#([0-9a-f]{3}){1,2}$/i.test(background) ||
      /^rgb|hsl|^([a-zA-Z]+)$/.test(background)
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(background)
    const isVideo = /\.(mp4|webm|ogg)$/i.test(background)
    if (isColor) {
      console.log("isColor", background)
      return <AbsoluteFill style={{ background }} />
    }
    if (isImage) {
      return (
        <img
          aria-hidden="true"
          src={background}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )
    }
    if (isVideo) {
      return (
        <video
          aria-hidden="true"
          src={background}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
        />
      )
    }
    return null
  }

  return (
    <ThemeProvider value={theme ?? {}}>
      <div className="relative w-full h-full">
        <BackgroundRenderer background={background} />
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
              {/* {sceneIdx < scenes.length - 1 && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({
                    durationInFrames: Math.round(
                      (scene.transition?.duration ?? ) * fps,
                    ),
                  })}
                />
              )} */}
            </React.Fragment>
          ))}
        </TransitionSeries>
        {globalTimeline?.map((element: TimelineElement, i: number) => (
          <TimelineElementRenderer key={`global-${i}`} element={element} />
        ))}
      </div>
    </ThemeProvider>
  )
}
