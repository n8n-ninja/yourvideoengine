import React from "react"
import { AbsoluteFill, Audio, Sequence, useVideoConfig } from "remotion"

import { z } from "zod"
import { useTiming } from "@/hooks/useTiming"
import { ProgressEasingSchema, TimingSchema } from "@/schemas"
import { useProgressEasing } from "@/hooks/useProgressEasing"
import { useKeyframes } from "@/hooks/useKeyframes"
import { Keyframe } from "@/schemas"
import { getAudio } from "@/utils/getFile"

/**
 * SoundSchema: zod schema for sound props validation.
 */
export const SoundSchema = z.object({
  timing: TimingSchema.optional(),
  sound: z.string(),
  pitch: z.number().optional(),
  volume: z.number().optional(),
  loop: z.boolean().optional(),
  transition: ProgressEasingSchema.optional(),
  volumes: z
    .array(
      z.object({
        time: z.number(),
        value: z.number(),
      }),
    )
    .optional(),
})

export const SoundsSchema = z.array(SoundSchema)

type SoundType = z.infer<typeof SoundSchema>

/**
 * SoundItem: renders a single sound with timing, volume keyframes, and transitions.
 *
 * @param sound The sound object to render (SoundType).
 * @param fps The frames per second for timing calculations.
 * @returns A Sequence with an Audio element, or null if not visible.
 */
const SoundItem: React.FC<{ sound: SoundType; fps: number }> = ({ sound }) => {
  // Dynamic volume with keyframes
  const keyframes: Keyframe<number>[] | undefined = sound.volumes?.map((v) => ({
    time: v.time,
    value: v.value,
  }))
  const dynamicVolume = useKeyframes<number>(keyframes ?? [])
  const volume = dynamicVolume ?? sound.volume ?? 1

  // Resolve sound source (local or remote)
  const soundSrc = getAudio(sound.sound)

  // Progress and transition for fade in/out
  const { phase, progressIn, progressOut } = useProgressEasing({
    transition: sound.transition,
    startFrame: 0,
    endFrame: -0.01,
  })

  const volumeAmplifier =
    phase === "in" ? progressIn : phase === "out" ? progressOut : 1

  return (
    <Audio
      src={soundSrc}
      loop={sound.loop}
      playbackRate={sound.pitch ?? 1}
      volume={() => volume * volumeAmplifier}
    />
  )
}

/**
 * Sound: renders a list of sounds as Audio elements with timing, keyframes, and transitions.
 *
 * @param sounds Array of sound objects to render.
 * @returns An AbsoluteFill containing all rendered sounds.
 */
export const Sound: React.FC<{ sounds: SoundType[] }> = ({ sounds }) => {
  const { fps } = useVideoConfig()
  return (
    <>
      {sounds.map((sound, i) => (
        <SoundItem key={i} sound={sound} fps={fps} />
      ))}
    </>
  )
}
