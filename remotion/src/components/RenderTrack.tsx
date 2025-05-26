import React from "react"
import { TransitionSeries, linearTiming } from "@remotion/transitions"
import type {
  TransitionType,
  SceneType,
  TrackType,
  TrackItemType,
  BlockType,
} from "@/schemas/project"
import { Block } from "@/components/Block"
import { getTransition } from "@/utils/getTransition"
import { addSound } from "@/utils/addSound"
import { AbsoluteFill, useVideoConfig } from "remotion"

export const RenderTrack: React.FC<{
  track: TrackType
}> = ({ track }) => {
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill id={track.id}>
      <TransitionSeries>
        {track.items.map((item: TrackItemType, idx: number) => {
          if ("type" in item && item.type === "transition") {
            const transition = item as TransitionType
            const transitionObj = {
              type: transition.animation,
              duration: transition.duration,
              direction: transition.direction,
              wipeDirection: transition.wipeDirection,
              sound: transition.sound,
            }
            const presentation = transition.sound
              ? addSound(getTransition(transitionObj), transition.sound)
              : getTransition(transitionObj)

            return (
              <TransitionSeries.Transition
                key={idx}
                presentation={presentation}
                timing={linearTiming({
                  durationInFrames: Math.round(
                    (transition.duration ?? 1) * fps,
                  ),
                })}
              />
            )
          }
          const scene = item as SceneType
          return (
            <TransitionSeries.Sequence
              key={idx}
              durationInFrames={(scene.duration ?? 1) * fps}
            >
              {scene.blocks.map((element: BlockType, i: number) => (
                <Block key={i} element={element} />
              ))}
            </TransitionSeries.Sequence>
          )
        })}
      </TransitionSeries>
    </AbsoluteFill>
  )
}
