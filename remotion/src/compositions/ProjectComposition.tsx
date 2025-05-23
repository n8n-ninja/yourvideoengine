import React from "react"
import { TransitionSeries, linearTiming } from "@remotion/transitions"
import { TimelineElementRenderer } from "../components/TimelineElement"
import { z } from "zod"
import {
  SceneSchema,
  TimelineElementSchema,
  SceneOrTransition,
  Scene as SceneType,
  TransitionScene,
} from "@/schemas/timeline"
import { ThemeProvider } from "../contexts/ThemeContext"
import type { Theme } from "@/styles/default-style"

import { getTransition } from "../utils/getTransition"
import { addSound } from "../utils/addSound"

import {
  AbsoluteFill,
  useVideoConfig,
  CalculateMetadataFunction,
} from "remotion"
// Types
export type Scene = z.infer<typeof SceneSchema>
export type TimelineElement = z.infer<typeof TimelineElementSchema>

export const calculateMetadata: CalculateMetadataFunction<{
  scenes: SceneOrTransition[]
}> = ({ props, defaultProps, abortSignal }) => {
  let duration = 0
  props.scenes.forEach((scene, idx) => {
    if ("type" in scene && scene.type === "transition") {
      if (idx > 0 && idx < props.scenes.length - 1)
        duration -= scene.duration ?? 0
    } else {
      duration += scene.duration ?? 0
    }
  })
  return {
    durationInFrames: Math.round(duration * 30),
  }
}

export const ProjectComposition: React.FC<{
  scenes: SceneOrTransition[]
  globalTimeline?: TimelineElement[]
  theme?: Theme
  background?: string // facultatif
}> = ({ scenes, globalTimeline, theme, background }) => {
  const { fps } = useVideoConfig()

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
          {scenes.map((item: SceneOrTransition, idx: number) => {
            if ("type" in item && item.type === "transition") {
              const t = item as TransitionScene
              const transitionObj = {
                type: t.animation,
                duration: t.duration,
                direction: t.direction,
                wipeDirection: t.wipeDirection,
                sound: t.sound,
              }
              const presentation = t.sound
                ? addSound(getTransition(transitionObj), t.sound)
                : getTransition(transitionObj)

              return (
                <TransitionSeries.Transition
                  key={idx}
                  presentation={presentation}
                  timing={linearTiming({
                    durationInFrames: Math.round((t.duration ?? 1) * fps),
                  })}
                />
              )
            }
            const s = item as SceneType
            return (
              <TransitionSeries.Sequence
                key={idx}
                durationInFrames={Math.round((s.duration ?? 0) * fps)}
              >
                {s.timeline.map((element: TimelineElement, i: number) => (
                  <TimelineElementRenderer key={i} element={element} />
                ))}
              </TransitionSeries.Sequence>
            )
          })}
        </TransitionSeries>
        {globalTimeline?.map((element: TimelineElement, i: number) => (
          <TimelineElementRenderer key={`global-${i}`} element={element} />
        ))}
      </div>
    </ThemeProvider>
  )
}
