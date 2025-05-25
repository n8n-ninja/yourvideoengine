import React from "react"
import { TransitionSeries, linearTiming } from "@remotion/transitions"
import type {
  SegmentType,
  LayerType,
  TransitionType,
  SceneType,
  BackgroundType,
} from "@/schemas/project"
import { Layer } from "@/components/Layer"
import { getTransition } from "@/utils/getTransition"
import { addSound } from "@/utils/addSound"
import { useVideoConfig, CalculateMetadataFunction } from "remotion"
import { Background } from "@/components/Background"

export const calculateMetadata: CalculateMetadataFunction<{
  tracks?: SegmentType[]
  duration?: number
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
  } else if (props.duration) {
    duration = props.duration
  } else {
    duration = 1
  }

  return {
    durationInFrames: Math.round(duration * (props.fps || 30)),
  }
}

export const ProjectComposition: React.FC<{
  tracks?: SegmentType[]
  overlays?: LayerType[]
  background?: BackgroundType
  fps?: number
  duration?: number
}> = ({ tracks, overlays, background, duration }) => {
  const { fps } = useVideoConfig()

  return (
    <div className="relative w-full h-full">
      <Background {...(background ?? {})} />

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

      {overlays?.map((element: LayerType, i: number) => (
        <Layer key={`global-${i}`} element={element} />
      ))}
    </div>
  )
}
