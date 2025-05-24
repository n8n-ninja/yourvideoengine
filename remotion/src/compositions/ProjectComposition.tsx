import React from "react"
import { TransitionSeries, linearTiming } from "@remotion/transitions"
import type {
  SegmentType,
  LayerType,
  TransitionType,
  SceneType,
} from "@/schemas/project"
import type { GlobalTheme } from "@/schemas/theme"
import { Layer } from "@/components/Layer"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { getTransition } from "@/utils/getTransition"
import { addSound } from "@/utils/addSound"
import {
  AbsoluteFill,
  useVideoConfig,
  CalculateMetadataFunction,
} from "remotion"

export const calculateMetadata: CalculateMetadataFunction<{
  tracks?: SegmentType[]
  overlay?: SceneType
  fps?: number
}> = ({ props, defaultProps, abortSignal }) => {
  let duration = 0

  if (props.tracks && props.tracks.length && props.tracks.length > 0) {
    props.tracks?.forEach((track, idx) => {
      if ("type" in track && track.type === "transition") {
        if (idx > 0 && idx < props.tracks!.length - 1)
          duration -= track.duration ?? 0
      } else {
        duration += track.duration ?? 0
      }
    })
  } else if (props.overlay && props.overlay.duration) {
    duration = props.overlay.duration
  } else {
    duration = 1
  }

  return {
    durationInFrames: Math.round(duration * (props.fps || 30)),
  }
}

export const ProjectComposition: React.FC<{
  tracks?: SegmentType[]
  overlay?: SceneType
  theme?: GlobalTheme
  background?: string
  fps?: number
}> = ({ tracks, overlay, theme, background }) => {
  const { fps } = useVideoConfig()

  // Composant pour gérer le fond
  const BackgroundRenderer: React.FC<{ background?: string }> = ({
    background,
  }) => {
    return <AbsoluteFill style={{ background }} />
  }

  return (
    <ThemeProvider value={theme ?? {}}>
      <div className="relative w-full h-full">
        <BackgroundRenderer background={background} />

        <TransitionSeries>
          {tracks?.map((item: SegmentType, idx: number) => {
            if ("type" in item && item.type === "transition") {
              const t = item as TransitionType
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
                {s.layers.map((element: LayerType, i: number) => (
                  <Layer key={i} element={element} />
                ))}
              </TransitionSeries.Sequence>
            )
          })}
        </TransitionSeries>

        {overlay?.layers.map((element: LayerType, i: number) => (
          <Layer key={`global-${i}`} element={element} />
        ))}
      </div>
    </ThemeProvider>
  )
}
