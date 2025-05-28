import React from "react"
import { Audio as AudioComponent, Sequence } from "remotion"
import { useTiming } from "@/hooks/useTiming"
import { useKeyframes } from "@/hooks/useKeyframes"
import { useProgressEasing } from "@/hooks/useProgressEasing"
import { getAudio } from "@/utils/getFile"
import type { Timing } from "@/schemas/timing"
import type { Keyframe } from "@/schemas/keyframe"

/**
 * AudioItem: renders a single audio with timing, volume keyframes, and transitions.
 *
 * @param sound The audio file path.
 * @param volume The base volume of the audio.
 * @param loop Whether the audio should loop.
 * @param pitch The playback rate of the audio.
 * @param volumes An array of keyframes for dynamic volume.
 * @param timing The timing information for the audio.
 * @param fadeInDuration The duration of the fade-in effect in seconds.
 * @param fadeOutDuration The duration of the fade-out effect in seconds.
 * @returns An Audio element, or null if not visible.
 */
export const Audio: React.FC<{
  url: string
  volume?: number
  loop?: boolean
  pitch?: number
  volumes?: { time: number; value: number }[]
  timing?: Partial<Timing>
  fadeInDuration?: number // seconds
  fadeOutDuration?: number // seconds
}> = ({
  url,
  volume = 1,
  loop = false,
  pitch = 1,
  volumes,
  timing,
  fadeInDuration = 0,
  fadeOutDuration = 0,
}) => {
  // Always call hooks first
  const timingInfo = useTiming(timing)
  const keyframes: Keyframe[] | undefined = volumes?.map((v) => ({
    time: v.time,
    value: { v: v.value },
  }))
  const dynamicVolumeObj = useKeyframes(
    keyframes ?? [],
    timingInfo.endSec - timingInfo.startSec,
  )
  let fadeMultiplier = 1
  const { phase, progressIn, progressOut } = useProgressEasing({
    startFrame: timingInfo.startFrame,
    endFrame: timingInfo.endFrame,
    transition: {
      inDuration: fadeInDuration,
      outDuration: fadeOutDuration,
    },
  })
  if (phase === "in") fadeMultiplier = progressIn
  else if (phase === "out") fadeMultiplier = progressOut
  else fadeMultiplier = 1

  const dynamicVolume =
    dynamicVolumeObj &&
    typeof dynamicVolumeObj === "object" &&
    "v" in dynamicVolumeObj
      ? dynamicVolumeObj.v
      : undefined
  const finalVolume =
    (typeof dynamicVolume === "number" ? dynamicVolume : (volume ?? 1)) *
    fadeMultiplier

  const audioSrc = getAudio(url)

  return (
    <Sequence
      from={timingInfo.startFrame}
      durationInFrames={timingInfo.totalFrames}
    >
      <AudioComponent
        src={audioSrc}
        loop={loop}
        playbackRate={pitch}
        volume={finalVolume}
      />
    </Sequence>
  )
}
