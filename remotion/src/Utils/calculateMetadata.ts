import type { SegmentType } from "@/schemas/project"
import { CalculateMetadataFunction } from "remotion"

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
