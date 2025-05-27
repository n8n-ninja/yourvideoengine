import type { CalculateMetadataFunction } from "remotion"
import type { TrackType } from "@/schemas/project"

export const createCalculateTracksMetadata = <
  T extends Record<string, unknown>,
>(
  getTracks: (props: T) => Promise<TrackType[]>,
): CalculateMetadataFunction<T> => {
  return async ({ props }) => {
    const { fps } = props as { fps?: number }
    const tracks = await getTracks(props)
    const frames = Math.round((tracks[0].duration ?? 1) * (fps ?? 30))
    return {
      durationInFrames: frames > 0 ? frames : 30,
    }
  }
}
