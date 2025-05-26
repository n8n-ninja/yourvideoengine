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

  // Préparation des durées pour chaque scène
  const scenes: { index: number; scene: SceneType }[] = []
  const transitions: { index: number; transition: TransitionType }[] = []

  track.items.forEach((item, idx) => {
    if ("type" in item && item.type === "transition") {
      transitions.push({ index: idx, transition: item as TransitionType })
    } else {
      scenes.push({ index: idx, scene: item as SceneType })
    }
  })

  const totalTrackDuration = track.duration ?? 0
  const totalTransitionsDuration = transitions.reduce(
    (sum, t) => sum + (t.transition.duration ?? 0),
    0,
  )
  const scenesWithDuration = scenes.filter((s) => s.scene.duration != null)
  const scenesWithoutDuration = scenes.filter((s) => s.scene.duration == null)
  const totalScenesWithDuration = scenesWithDuration.reduce(
    (sum, s) => sum + (s.scene.duration ?? 0),
    0,
  )
  const remainingDuration =
    totalTrackDuration - totalTransitionsDuration - totalScenesWithDuration
  const durationForEachSceneWithout =
    scenesWithoutDuration.length > 0
      ? Math.max(remainingDuration / scenesWithoutDuration.length, 0)
      : 0

  // Map index -> duration à utiliser
  const sceneDurations: Record<number, number> = {}
  scenesWithDuration.forEach((s) => {
    sceneDurations[s.index] = s.scene.duration ?? 1
  })
  scenesWithoutDuration.forEach((s) => {
    sceneDurations[s.index] = durationForEachSceneWithout
  })

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
          const duration = sceneDurations[idx] ?? 1
          return (
            <TransitionSeries.Sequence
              key={idx}
              durationInFrames={duration * fps}
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
