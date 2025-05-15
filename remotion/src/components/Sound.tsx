import React from "react"
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useVideoConfig,
  staticFile,
} from "remotion"
import { z } from "zod"
import { useTiming, TimingSchema } from "@/Utils/useTiming"
import {
  ProgressEasingSchema,
  useProgressEasing,
} from "@/Utils/useProgressEasing"
import { useKeyframes, Keyframe } from "@/Utils/useKeyframes"

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
 */
const SoundItem: React.FC<{ sound: SoundType; fps: number }> = ({ sound }) => {
  // Dynamic volume with keyframes
  const keyframes: Keyframe<number>[] | undefined = sound.volumes?.map((v) => ({
    time: v.time,
    value: v.value,
  }))
  const dynamicVolume = useKeyframes<number>(keyframes ?? [])
  const volume = dynamicVolume ?? sound.volume ?? 1

  // Timing for the sound
  const timing = useTiming({
    start: sound.timing?.start ?? 0,
    end: sound.timing?.end,
    duration: sound.timing?.duration,
  })

  // Resolve sound source (local or remote)
  const soundSrc = sound.sound.startsWith("http")
    ? sound.sound
    : staticFile(`/sound/${sound.sound}`)

  // Progress and transition for fade in/out
  const { phase, progressIn, progressOut } = useProgressEasing({
    transition: sound.transition,
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })

  const volumeAmplifier =
    phase === "in" ? progressIn : phase === "out" ? progressOut : 1

  if (!timing.visible) return null

  return (
    <Sequence from={timing.startFrame} durationInFrames={timing.totalFrames}>
      <Audio
        src={soundSrc}
        loop={sound.loop}
        playbackRate={sound.pitch ?? 1}
        volume={() => volume * volumeAmplifier}
      />
    </Sequence>
  )
}

/**
 * Sound: renders a list of sounds.
 */
export const Sound: React.FC<{ sounds: SoundType[] }> = ({ sounds }) => {
  const { fps } = useVideoConfig()
  return (
    <AbsoluteFill>
      {sounds.map((sound, i) => (
        <SoundItem key={i} sound={sound} fps={fps} />
      ))}
    </AbsoluteFill>
  )
}
