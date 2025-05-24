import React from "react"
import { Audio as AudioComponent } from "remotion"
import { AudioElement } from "@/schemas/timeline-element"
import { Keyframe } from "@/schemas/keyframe"
import { useKeyframes } from "@/hooks/useKeyframes"
import { getAudio } from "@/utils/getFile"

/**
 * AudioItem: renders a single audio with timing, volume keyframes, and transitions.
 *
 * @param audio The audio object containing sound, volume, loop, pitch, and volumes.
 * @param revealProgress The multiplier for the dynamic volume.
 * @returns An Audio element, or null if not visible.
 */
export const Audio: React.FC<{
  audio: AudioElement
  revealProgress?: number
}> = ({ audio, revealProgress = 1 }) => {
  const { sound: url, volume = 1, loop = false, pitch = 1, volumes } = audio
  // Dynamic volume with keyframes
  const keyframes: Keyframe<number>[] | undefined = volumes?.map((v) => ({
    time: v.time,
    value: v.value,
  }))
  const dynamicVolume = useKeyframes<number>(keyframes ?? [])
  const finalVolume = (dynamicVolume ?? volume ?? 1) * revealProgress

  const audioSrc = getAudio(url)

  return (
    <AudioComponent
      src={audioSrc}
      loop={loop}
      playbackRate={pitch}
      volume={finalVolume}
    />
  )
}
