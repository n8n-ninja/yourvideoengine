import React from "react"
import { Audio as AudioComponent } from "remotion"
import { Sound as SoundType } from "@/schemas"
import { useKeyframes } from "@/hooks/useKeyframes"
import { Keyframe } from "@/schemas"
import { getAudio } from "@/utils/getFile"

/**
 * AudioItem: renders a single audio with timing, volume keyframes, and transitions.
 *
 * @param audio The audio object to render (SoundType).
 * @param revealProgress The multiplier for the dynamic volume.
 * @returns An Audio element, or null if not visible.
 */
export const Audio: React.FC<{
  audio: SoundType
  revealProgress?: number
}> = ({ audio, revealProgress = 1 }) => {
  console.log(revealProgress)
  // Dynamic volume with keyframes
  const keyframes: Keyframe<number>[] | undefined = audio.volumes?.map((v) => ({
    time: v.time,
    value: v.value,
  }))
  const dynamicVolume = useKeyframes<number>(keyframes ?? [])
  const volume = (dynamicVolume ?? audio.volume ?? 1) * revealProgress

  // Resolve audio source (local or remote)
  const audioSrc = getAudio(audio.sound)

  return (
    <AudioComponent
      src={audioSrc}
      loop={audio.loop}
      playbackRate={audio.pitch ?? 1}
      volume={volume}
    />
  )
}
