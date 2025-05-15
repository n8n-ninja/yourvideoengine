import { useCurrentFrame, useVideoConfig } from "remotion"
import { getProgressEasing } from "@/utils/getProgressEasing"
import { ProgressEasing } from "@/schemas"

export function useProgressEasing({
  transition = {},
  startFrame = 0,
  endFrame = 1,
}: {
  transition?: ProgressEasing
  startFrame: number
  endFrame: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return getProgressEasing({ transition, startFrame, endFrame, frame, fps })
}
