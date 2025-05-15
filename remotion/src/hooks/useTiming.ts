import { useCurrentFrame, useVideoConfig } from "remotion"
import { getTiming } from "@/utils/getTiming"
import { Timing } from "@/schemas"

export function useTiming({ start, end, duration }: Timing) {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const currentTime = frame / fps

  return getTiming(currentTime, fps, durationInFrames, { start, end, duration })
}
