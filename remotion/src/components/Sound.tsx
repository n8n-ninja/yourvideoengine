import {
  AbsoluteFill,
  Audio,
  Sequence,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion"
import { z } from "zod"
import React, { useMemo } from "react"
import { useTiming } from "@/Utils/useTiming"
import { TimingSchema } from "@/Utils/useTiming"

export const SoundSchema = z.object({
  timing: TimingSchema.optional(),

  sound: z.string(),
  pitch: z.number().optional(),
  volume: z.number().optional(),
  loop: z.boolean().optional(),
  fadeIn: z.number().optional(),
  fadeOut: z.number().optional(),
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

function getKeyframeValue(
  keyframes: { time: number; value: number }[] | undefined,
  localTime: number,
  totalDuration: number,
) {
  if (!keyframes || keyframes.length === 0) return undefined
  // Convertit les times négatifs
  const resolved = keyframes
    .map((k) => ({
      absTime: k.time < 0 ? totalDuration + k.time : k.time,
      value: k.value,
    }))
    .sort((a, b) => a.absTime - b.absTime)
  if (localTime <= resolved[0].absTime) return resolved[0].value
  if (localTime >= resolved[resolved.length - 1].absTime)
    return resolved[resolved.length - 1].value
  for (let i = 0; i < resolved.length - 1; i++) {
    const a = resolved[i]
    const b = resolved[i + 1]
    if (localTime >= a.absTime && localTime < b.absTime) {
      const t = (localTime - a.absTime) / (b.absTime - a.absTime)
      return a.value + (b.value - a.value) * t
    }
  }
  return resolved[0].value
}

function computeVolume({
  f,
  fps,
  frames,
  baseVolume,
  fadeIn,
  fadeOut,
  volumeKeyframes,
}: {
  f: number
  fps: number
  frames: number
  baseVolume?: number
  fadeIn?: number
  fadeOut?: number
  volumeKeyframes?: { time: number; value: number }[]
}) {
  let base = baseVolume ?? 1
  if (fadeIn) {
    base *= interpolate(f, [0, Math.round(fadeIn * fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  }
  if (fadeOut) {
    base *= interpolate(
      f,
      [frames - Math.round(fadeOut * fps), frames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    )
  }
  if (volumeKeyframes && volumeKeyframes.length > 0) {
    const localTime = f / fps
    const kfVal = getKeyframeValue(volumeKeyframes, localTime, frames / fps)
    if (typeof kfVal === "number") base *= kfVal
  }
  return base
}

// Composant pour un seul son
const SoundItem: React.FC<{ sound: SoundType; fps: number }> = ({
  sound,
  fps,
}) => {
  const timing = useTiming({
    start: sound.timing?.start ?? 0,
    end: sound.timing?.end,
    duration: sound.timing?.duration,
  })
  const soundSrc = sound.sound.startsWith("http")
    ? sound.sound
    : staticFile(`/sound/${sound.sound}`)

  const volumeKeyframes = useMemo(
    () => sound.volumes?.map((v) => ({ time: v.time, value: v.volume })),
    [sound.volumes],
  )

  if (!timing.visible || timing.totalFrames <= 0) return null

  console.log("timing", timing)
  return (
    <Sequence from={timing.startFrame} durationInFrames={timing.totalFrames}>
      <Audio
        src={soundSrc}
        volume={(f) =>
          computeVolume({
            f,
            fps,
            frames: timing.totalFrames,
            baseVolume: sound.volume,
            fadeIn: sound.fadeIn,
            fadeOut: sound.fadeOut,
            volumeKeyframes,
          })
        }
        loop={sound.loop}
        playbackRate={sound.pitch ?? 1}
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
