import { TrackType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"

export const createTrack = (overrides: Partial<TrackType> = {}): TrackType => {
  const baseTrack: TrackType = {
    id: uuidv4(),
    duration: 0,
    items: [],
    ...overrides,
  }

  // Si duration est passé en override, il prévaut
  if (overrides.duration !== undefined) {
    return {
      ...baseTrack,
      duration: overrides.duration,
    }
  }

  let duration = 0
  for (const item of baseTrack.items) {
    if (item.type === "scene") {
      duration += item.duration ?? 0
    } else if (item.type === "transition") {
      duration -= item.duration ?? 0
    }
  }

  return {
    ...baseTrack,
    duration,
  }
}
