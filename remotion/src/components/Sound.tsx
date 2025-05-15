import {
  AbsoluteFill,
  Audio,
  Sequence,
  useVideoConfig,
  staticFile,
} from "remotion"
import { z } from "zod"
import React from "react"
import { useTiming } from "@/Utils/useTiming"
import { TimingSchema } from "@/Utils/useTiming"
import {
  ProgressEasingSchema,
  useProgressEasing,
} from "@/Utils/useProgressEasing"

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
        volume: z.number(),
      }),
    )
    .optional(),
})

export const SoundsSchema = z.array(SoundSchema)

type SoundType = z.infer<typeof SoundSchema>

// Composant pour un seul son
const SoundItem: React.FC<{ sound: SoundType; fps: number }> = ({ sound }) => {
  const volume = sound.volume ?? 1

  const timing = useTiming({
    start: sound.timing?.start ?? 0,
    end: sound.timing?.end,
    duration: sound.timing?.duration,
  })

  const soundSrc = sound.sound.startsWith("http")
    ? sound.sound
    : staticFile(`/sound/${sound.sound}`)

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
