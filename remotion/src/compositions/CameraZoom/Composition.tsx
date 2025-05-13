import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Audio,
  Sequence,
  staticFile,
  random,
} from "remotion"
import { z } from "zod"
import React from "react"

export const CameraZoomSchema = z.object({
  videoUrl: z.string(),
  keyframes: z.array(
    z.object({
      time: z.number(), // seconds, can be negative
      scale: z.number().optional(),
      blur: z.number().optional(),
      top: z.number().optional(), // percent, 0-100
      left: z.number().optional(), // percent, 0-100
      easing: z.string().optional(), // 'linear', 'easeIn', 'easeOut', 'easeInOut', etc.
      sound: z.string().optional(), // chemin du fichier audio dans public
      volume: z.number().optional(), // 0-1
      shake: z
        .object({
          duration: z.number(), // durée du shake en secondes
          intensity: z.number(), // intensité du shake (0-1+)
        })
        .optional(),
      rotation: z.number().optional(), // rotation de la vidéo en degrés (0-360)
      filter: z.string().optional(), // filtre CSS optionnel (ex: 'brightness(1.2) sepia(0.5)')
      glitch: z
        .object({
          duration: z.number(), // durée du glitch en secondes
          intensity: z.number(), // intensité du glitch (0-1+)
        })
        .optional(),
    }),
  ),
})

// Helper pour parser un filter CSS en objet clé/valeur
function parseFilter(filterStr: string): Record<string, number> {
  const regex = /(\w+)\(([^)]+)\)/g
  const result: Record<string, number> = {}
  let match
  while ((match = regex.exec(filterStr))) {
    const key = match[1]
    const value = parseFloat(match[2])
    if (!isNaN(value)) result[key] = value
  }
  return result
}

// Helper pour reconstruire un filter CSS à partir d'un objet
function buildFilter(obj: Record<string, number>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${k}(${v})`)
    .join(" ")
}

export const CameraZoomComposition: React.FC<
  z.infer<typeof CameraZoomSchema>
> = ({ videoUrl, keyframes }) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const totalDurationSec = durationInFrames / fps
  const currentTime = frame / fps

  // Convert negative times to absolute
  const resolvedKeyframes = keyframes
    .map((kf) => ({
      ...kf,
      absTime: kf.time < 0 ? totalDurationSec + kf.time : kf.time,
    }))
    .sort((a, b) => a.absTime - b.absTime)

  // Find the two keyframes to interpolate between
  let prev = resolvedKeyframes[0]
  let next = resolvedKeyframes[resolvedKeyframes.length - 1]
  for (let i = 0; i < resolvedKeyframes.length - 1; i++) {
    if (
      currentTime >= resolvedKeyframes[i].absTime &&
      currentTime < resolvedKeyframes[i + 1].absTime
    ) {
      prev = resolvedKeyframes[i]
      next = resolvedKeyframes[i + 1]
      break
    }
  }

  // Interpolation factor
  let t = 0
  if (next.absTime !== prev.absTime) {
    t = (currentTime - prev.absTime) / (next.absTime - prev.absTime)
    t = Math.max(0, Math.min(1, t))
  }

  // Easing function
  const easingName = next.easing || prev.easing || "linear"
  let easingFn = (x: number) => x
  if (easingName === "easeIn") easingFn = Easing.in(Easing.ease)
  else if (easingName === "easeOut") easingFn = Easing.out(Easing.ease)
  else if (easingName === "easeInOut") easingFn = Easing.inOut(Easing.ease)
  else if (easingName === "linear") easingFn = (x: number) => x
  // Ajoute ici d'autres easings personnalisés si besoin

  const te = easingFn(t)

  // Interpolate scale, blur, rotation, filter
  const prevScale = prev.scale ?? 1
  const nextScale = next.scale ?? prevScale
  const scale = prevScale + (nextScale - prevScale) * te
  const blur = (prev.blur ?? 0) + ((next.blur ?? 0) - (prev.blur ?? 0)) * te
  const prevRotation = prev.rotation ?? 0
  const nextRotation = next.rotation ?? prevRotation
  const baseRotation = prevRotation + (nextRotation - prevRotation) * te

  // Interpolation douce des filtres
  // Cherche le keyframe filter précédent et suivant
  let prevFilterStr = ""
  let nextFilterStr = ""
  let prevFilterTime = 0
  let nextFilterTime = 0
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime && kf.filter) {
      prevFilterStr = kf.filter || ""
      prevFilterTime = kf.absTime
    }
    if (kf.absTime > currentTime && kf.filter) {
      nextFilterStr = kf.filter || ""
      nextFilterTime = kf.absTime
      break
    }
  }
  let filterString = ""
  if (prevFilterStr && nextFilterStr && nextFilterTime > prevFilterTime) {
    // Interpolation entre prev et next
    const tFilter =
      (currentTime - prevFilterTime) / (nextFilterTime - prevFilterTime)
    const prevObj = parseFilter(prevFilterStr)
    const nextObj = parseFilter(nextFilterStr)
    const keys = Array.from(
      new Set([...Object.keys(prevObj), ...Object.keys(nextObj)]),
    )
    const interp: Record<string, number> = {}
    for (const k of keys) {
      const a = prevObj[k] ?? 1
      const b = nextObj[k] ?? 1
      interp[k] = a + (b - a) * tFilter
    }
    filterString = buildFilter(interp)
  } else if (prevFilterStr) {
    filterString = prevFilterStr
  } else {
    filterString = ""
  }

  // Camera shake simplifié
  // On cherche le dernier keyframe avec shake défini avant ou à currentTime et dont la duration n'est pas dépassée
  let shake = undefined
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime && kf.shake) {
      const shakeEnd = kf.absTime + kf.shake.duration
      if (currentTime < shakeEnd) {
        shake = kf.shake
      } else {
        shake = undefined
      }
    }
    if (kf.absTime > currentTime) break
  }

  let shakeRotate = 0
  let shakeScale = 1
  let shakeBlur = 0
  if (shake) {
    const intensity = shake.intensity
    const baseFreq = 18 + intensity * 12
    const t = frame
    // Mélange plusieurs fréquences et phases pour plus de chaos
    const rot = 2 + intensity * 6
    const scaleAmount = 0.03 * intensity
    const blurAmount = 6 * intensity
    // Rotation chaotique
    shakeRotate =
      Math.sin(t * baseFreq * 0.13 + 42) * rot * 0.7 +
      Math.sin(t * (baseFreq * 0.21) + 13) * rot * 0.3 +
      Math.cos(t * (baseFreq * 0.17) + 99) * rot * 0.2
    // Scale chaotique
    shakeScale =
      1 +
      Math.abs(Math.sin(t * baseFreq * 0.07)) * scaleAmount * 0.7 +
      Math.abs(Math.cos(t * baseFreq * 0.11 + 13)) * scaleAmount * 0.5 +
      (random(`shake-scale-${frame}`) - 0.5) * scaleAmount * 0.2
    // Blur chaotique
    shakeBlur =
      Math.abs(Math.sin(t * baseFreq * 0.11 + 13)) * blurAmount * 0.7 +
      Math.abs(Math.cos(t * baseFreq * 0.19 + 7)) * blurAmount * 0.5 +
      (random(`shake-blur-${frame}`) - 0.5) * blurAmount * 0.2
  }

  // Glitch effect
  let glitchActive = false
  let glitch = undefined
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime && kf.glitch) {
      const glitchEnd = kf.absTime + kf.glitch.duration
      if (currentTime < glitchEnd) {
        glitchActive = true
        glitch = kf.glitch
      } else {
        glitchActive = false
        glitch = undefined
      }
    }
    if (kf.absTime > currentTime) break
  }

  let glitchTransform = ""
  let glitchFilter = ""
  let glitchClip = ""
  if (glitchActive && glitch) {
    const intensity = glitch.intensity
    // Translation X/Y rapide et chaotique
    const tx = (random(`glitch-x-${frame}`) - 0.5) * 40 * intensity
    const ty = (random(`glitch-y-${frame}`) - 0.5) * 24 * intensity
    // Scale saccadé
    const scaleG =
      1 + (random(`glitch-scale-${frame}`) - 0.5) * 0.08 * intensity
    // Hue rotate saccadé
    const hue = (random(`glitch-hue-${frame}`) - 0.5) * 80 * intensity
    // Clip-path saccadé (bande horizontale)
    const bandY = Math.floor(random(`glitch-band-${frame}`) * 80)
    const bandH = 20 + random(`glitch-bandh-${frame}`) * 30
    glitchTransform = `translate(${tx}px,${ty}px) scale(${scaleG})`
    glitchFilter = `hue-rotate(${hue}deg)`
    glitchClip = `inset(${bandY}% 0% calc(100% - ${bandY + bandH}%) 0%)`
  }

  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: `scale(${scale * shakeScale}) rotate(${baseRotation + shakeRotate}deg) ${glitchTransform}`,
    filter: `${filterString} blur(${blur + shakeBlur}px) ${glitchFilter}`,
    clipPath: glitchClip || undefined,
    transformOrigin: `50% 50%`,
  }

  // Audio rendering for keyframes with sound
  const audioElements = resolvedKeyframes
    .filter((kf) => kf.sound)
    .map((kf, i) => {
      const from = Math.round(kf.absTime * fps)
      return (
        <Sequence
          key={i}
          from={from}
          durationInFrames={durationInFrames - from}
        >
          <Audio
            src={staticFile(`/sound/${kf.sound}.mp3`)}
            startFrom={0}
            volume={() => kf.volume ?? 1}
          />
        </Sequence>
      )
    })

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video src={videoUrl} style={videoStyle} />
      {audioElements}
    </AbsoluteFill>
  )
}
