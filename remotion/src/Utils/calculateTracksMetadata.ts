import type { CalculateMetadataFunction } from "remotion"
import type { TrackType } from "@/schemas/project"

export const createCalculateTracksMetadata = <T extends { fps?: number }>(
  getTracks: (props: T) => Promise<TrackType[]>,
): CalculateMetadataFunction<T> => {
  return async ({ props }) => {
    const tracks = await getTracks(props)
    return {
      durationInFrames: Math.round(
        (tracks[0].duration ?? 1) * (props.fps ?? 30),
      ),
    }
  }
}
