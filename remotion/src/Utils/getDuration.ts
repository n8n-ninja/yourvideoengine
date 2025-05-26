import {
  TrackType,
  TrackItemType,
  SceneType,
  BlockType,
  TransitionType,
} from "@/schemas/project"
import { parseMedia } from "@remotion/media-parser"

/**
 * Get the duration of a block (e.g., camera, audio, etc.).
 * For camera blocks without timing, fetch duration from media.
 */
const getBlockDuration = async (block: BlockType): Promise<number> => {
  if (block.type === "camera" && !block.timing) {
    const layerDuration = await parseMedia({
      src: block.url,
      acknowledgeRemotionLicense: true,
      fields: { durationInSeconds: true },
    })
    return layerDuration.durationInSeconds ?? 1
  }
  return "duration" in block
    ? ((block as { duration?: number }).duration ?? block.timing?.duration ?? 1)
    : (block.timing?.duration ?? 1)
}

/**
 * Compute the duration of a scene by taking the max between its own duration and its blocks.
 * Returns a new scene object with duration set.
 */
const computeSceneDuration = async (scene: SceneType): Promise<SceneType> => {
  let maxDuration = scene.duration ?? 0
  for (const block of scene.blocks) {
    const blockDuration = await getBlockDuration(block)
    if (blockDuration > maxDuration) maxDuration = blockDuration
  }
  return { ...scene, duration: maxDuration }
}

/**
 * Compute the duration for a track item (scene or transition).
 * Returns a new item with duration set.
 */
const computeItemDuration = async (
  item: TrackItemType,
): Promise<TrackItemType> => {
  if (item.type === "transition") {
    // Return a new transition object with duration set
    const { type, animation, id, direction, sound, wipeDirection } = item
    return {
      type,
      animation,
      id,
      direction,
      sound,
      wipeDirection,
      duration: item.duration ?? 0,
    } as TransitionType
  }
  if (item.type === "scene") {
    return await computeSceneDuration(item)
  }
  // For other types, return as is
  return item
}

/**
 * Compute the total duration of a track, subtracting transition durations.
 * Returns a new track with all items enriched with durations.
 */
const computeTrackDuration = async (track: TrackType): Promise<TrackType> => {
  let totalDuration = 0
  const enrichedItems: TrackItemType[] = []
  for (const item of track.items) {
    const enrichedItem = await computeItemDuration(item)
    const duration =
      "duration" in enrichedItem ? (enrichedItem.duration ?? 0) : 0
    if (enrichedItem.type === "transition") {
      totalDuration -= duration
    } else {
      totalDuration += duration
    }
    enrichedItems.push(enrichedItem)
  }
  // Prevent negative durations
  const safeDuration = Math.max(0, totalDuration)
  return { ...(track as object), duration: safeDuration, items: enrichedItems }
}

// Recalculate the duration of a track from its items (subtracting transitions), only if no explicit duration
const recalculateTrackDuration = (track: TrackType): TrackType => {
  if (
    "duration" in track &&
    typeof track.duration === "number" &&
    isFinite(track.duration)
  ) {
    // Explicit duration: do not recalculate
    return track
  }
  let total = 0
  for (const item of track.items ?? []) {
    const duration = "duration" in item ? (item.duration ?? 0) : 0
    if (item.type === "transition") {
      total -= duration
    } else {
      total += duration
    }
  }
  return { ...track, duration: Math.max(0, total) }
}

/**
 * Main entry: Calculate durations for all tracks and their items.
 * - Computes durations for scenes and transitions.
 * - Subtracts transition durations from track total.
 * - Handles tracks with duration === Infinity by assigning them the max duration of all tracks.
 * Returns a new array of tracks, fully enriched.
 */
export const calculateDurations = async (
  tracks: TrackType[],
): Promise<TrackType[]> => {
  // 1. Compute durations for all tracks (except Infinity)
  const enrichedTracks = await Promise.all(
    tracks.map(async (track) => {
      if (track.duration === Infinity) {
        return { ...track }
      }
      return await computeTrackDuration(track)
    }),
  )

  // 2. Find max duration among all finite tracks
  const maxDuration = enrichedTracks
    .filter((t) => t.duration !== Infinity)
    .reduce((max, t) => (t.duration && t.duration > max ? t.duration : max), 0)

  // 3. Assign max duration to tracks with duration === Infinity
  const normalizedTracks = enrichedTracks.map((track) => {
    if (track.duration === Infinity) {
      return { ...track, duration: maxDuration }
    }
    return track
  })

  // 4. Recalculate track.duration from final items, only for tracks without explicit duration
  const recalculatedTracks = normalizedTracks.map(recalculateTrackDuration)

  // 5. Distribute free time to scenes
  return distributeFreeTimeToScenes(recalculatedTracks)
}

const distributeFreeTimeToScenes = (tracks: TrackType[]): TrackType[] => {
  return tracks.map((track) => {
    if (!track.items || track.items.length === 0) return track
    // Repérer les scenes sans durée
    const scenesToFill = track.items.filter(
      (item) =>
        item.type === "scene" &&
        (!("duration" in item) || !item.duration || item.duration === 0),
    )
    // Somme des durations connues
    const knownDurationsSum = track.items.reduce(
      (sum, item) =>
        sum +
        ("duration" in item && item.duration && item.duration > 0
          ? item.duration
          : 0),
      0,
    )
    const freeTime = (track.duration ?? 0) - knownDurationsSum
    // GROS LOG DEBUG
    console.log("[DISTRIBUTE FREE TIME]", {
      trackId: track.id,
      trackDuration: track.duration,
      knownDurationsSum,
      freeTime,
      scenesToFill: scenesToFill.length,
      itemsDurations: track.items.map((i) => i.duration),
    })
    if (scenesToFill.length > 0 && freeTime > 0) {
      const durationPerScene = freeTime / scenesToFill.length
      const newItems = track.items.map((item) => {
        if (
          item.type === "scene" &&
          (!("duration" in item) || !item.duration || item.duration === 0)
        ) {
          return { ...item, duration: durationPerScene }
        }
        return item
      })
      return { ...track, items: newItems }
    }
    return track
  })
}
