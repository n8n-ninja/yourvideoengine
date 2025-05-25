import React from "react"
import { TransitionSeries, linearTiming } from "@remotion/transitions"
import type {
  SegmentType,
  LayerType,
  TransitionType,
  SceneType,
} from "@/schemas/project"
import { Layer } from "@/components/Layer"
import { getTransition } from "@/utils/getTransition"
import { addSound } from "@/utils/addSound"
import { useVideoConfig } from "remotion"
// import { parseMedia } from "@remotion/media-parser"

// const getTrackDuration = async (scene: SceneType) => {
//   let duration = scene.duration ?? 1

//   for (const layer of scene.layers) {
//     if (layer.type === "camera" && !layer.timing) {
//       const layerDuration = await parseMedia({
//         src: layer.url,
//         acknowledgeRemotionLicense: true,
//         fields: { durationInSeconds: true },
//       })
//       if (
//         layerDuration.durationInSeconds &&
//         layerDuration.durationInSeconds > duration
//       ) {
//         duration = layerDuration.durationInSeconds
//       }
//     }
//   }

//   return duration
// }

export const RenderScenes: React.FC<{
  scenes: SegmentType[]
}> = ({ scenes }) => {
  const { fps } = useVideoConfig()
  const [sceneDurations, setSceneDurations] = React.useState<(number | null)[]>(
    [],
  )
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    const fetchDurations = async () => {
      const durations = await Promise.all(
        scenes.map(async (item) => {
          if ("type" in item && item.type === "transition") return null
          const s = item as SceneType
          return 10
          // return await getTrackDuration(s)
        }),
      )
      if (isMounted) {
        setSceneDurations(durations)
        setLoading(false)
      }
    }
    fetchDurations()
    return () => {
      isMounted = false
    }
  }, [scenes])

  if (loading) return null

  return (
    <TransitionSeries>
      {scenes.map((item: SegmentType, idx: number) => {
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
            durationInFrames={Math.round((s.duration ?? 1) * fps)}
          >
            {s.layers.map((element: LayerType, i: number) => (
              <Layer key={i} element={element} />
            ))}
          </TransitionSeries.Sequence>
        )
      })}
    </TransitionSeries>
  )
}
