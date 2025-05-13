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
      flash: z
        .object({
          duration: z.number(), // durée du flash en secondes
          intensity: z.number(), // intensité du flash (0-1+)
          color: z.string().optional(), // couleur du flash (par défaut blanc)
        })
        .optional(),
      mirror: z
        .object({
          horizontal: z.boolean().optional(),
          vertical: z.boolean().optional(),
        })
        .optional(),
      scanline: z
        .object({
          intensity: z.number(), // intensité du scanline (0-100)
          color: z.string().optional(), // couleur de la bande claire (par défaut blanc)
          speed: z.number().optional(), // vitesse d'animation verticale (par défaut 0)
          noise: z.boolean().optional(), // bruit (par défaut false)
        })
        .nullable()
        .optional(),
      vignette: z
        .object({
          intensity: z.number(), // opacité max de la vignette (0-100)
          size: z.number(), // taille du centre non assombri (0-100, % du rayon)
          color: z.string().optional(), // couleur de la vignette (par défaut noir)
        })
        .nullable()
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
  const { fps, durationInFrames, width, height } = useVideoConfig()
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

  // Mirror effect
  let mirror = undefined
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime && kf.mirror) {
      mirror = kf.mirror
    }
    if (kf.absTime > currentTime) break
  }
  let mirrorTransform = ""
  if (mirror) {
    if (mirror.horizontal && mirror.vertical) mirrorTransform = "scale(-1,-1)"
    else if (mirror.horizontal) mirrorTransform = "scaleX(-1)"
    else if (mirror.vertical) mirrorTransform = "scaleY(-1)"
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

  // Flash effect
  let flashActive = false
  let flash = undefined
  let flashProgress = 0
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime && kf.flash) {
      const flashEnd = kf.absTime + kf.flash.duration
      if (currentTime < flashEnd) {
        flashActive = true
        flash = kf.flash
        flashProgress = (currentTime - kf.absTime) / kf.flash.duration
      } else {
        flashActive = false
        flash = undefined
        flashProgress = 0
      }
    }
    if (kf.absTime > currentTime) break
  }

  // Scanline effect
  let scanline = null
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime) {
      if (kf.scanline === null) {
        scanline = null
      } else if (kf.scanline) {
        scanline = kf.scanline
      }
    }
    if (kf.absTime > currentTime) break
  }

  const scanlineColor = scanline?.color || "#fff"
  const scanlineSpeed = scanline?.speed || 0
  const scanlineOffset = scanlineSpeed ? (frame * scanlineSpeed) % 20 : 0

  // Scanline opacity transition with easing
  let scanlineOpacity = 1
  if (scanline) {
    // Cherche le keyframe scanline précédent et suivant
    let prevScanlineTime = 0
    let nextScanlineTime = durationInFrames / fps
    let prevEasing = undefined
    let nextEasing = undefined
    for (let i = 0; i < resolvedKeyframes.length; i++) {
      const kf = resolvedKeyframes[i]
      if (kf.absTime <= currentTime && kf.scanline) {
        prevScanlineTime = kf.absTime
        prevEasing = kf.easing
      }
      if (kf.absTime > currentTime && kf.scanline) {
        nextScanlineTime = kf.absTime
        nextEasing = kf.easing
        break
      }
    }
    // Apparition
    if (currentTime - prevScanlineTime < 0.3) {
      let t = (currentTime - prevScanlineTime) / 0.3
      t = getEasingFn(prevEasing)(t)
      scanlineOpacity = t
    }
    // Disparition
    if (nextScanlineTime - currentTime < 0.3) {
      let t = 1 - (nextScanlineTime - currentTime) / 0.3
      t = getEasingFn(nextEasing)(t)
      scanlineOpacity = Math.min(scanlineOpacity, 1 - t)
    }
    scanlineOpacity = Math.max(0, Math.min(1, scanlineOpacity))
  }

  // Vignette effect
  let vignette = null
  for (let i = 0; i < resolvedKeyframes.length; i++) {
    const kf = resolvedKeyframes[i]
    if (kf.absTime <= currentTime) {
      if (kf.vignette === null) {
        vignette = null
      } else if (kf.vignette) {
        vignette = kf.vignette
      }
    }
    if (kf.absTime > currentTime) break
  }
  // Vignette opacity transition with easing
  let vignetteOpacity = 1
  if (vignette) {
    let prevVignetteTime = 0
    let nextVignetteTime = durationInFrames / fps
    let prevEasing = undefined
    let nextEasing = undefined
    for (let i = 0; i < resolvedKeyframes.length; i++) {
      const kf = resolvedKeyframes[i]
      if (kf.absTime <= currentTime && kf.vignette) {
        prevVignetteTime = kf.absTime
        prevEasing = kf.easing
      }
      if (kf.absTime > currentTime && kf.vignette) {
        nextVignetteTime = kf.absTime
        nextEasing = kf.easing
        break
      }
    }
    // Apparition
    if (currentTime - prevVignetteTime < 0.3) {
      let t = (currentTime - prevVignetteTime) / 0.3
      t = getEasingFn(prevEasing)(t)
      vignetteOpacity = t
    }
    // Disparition
    if (nextVignetteTime - currentTime < 0.3) {
      let t = 1 - (nextVignetteTime - currentTime) / 0.3
      t = getEasingFn(nextEasing)(t)
      vignetteOpacity = Math.min(vignetteOpacity, 1 - t)
    }
    vignetteOpacity = Math.max(0, Math.min(1, vignetteOpacity))
  }

  function getEasingFn(easingName?: string) {
    if (!easingName) return (x: number) => x
    if (easingName === "easeIn") return Easing.in(Easing.ease)
    if (easingName === "easeOut") return Easing.out(Easing.ease)
    if (easingName === "easeInOut") return Easing.inOut(Easing.ease)
    return (x: number) => x
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video
        src={videoUrl}
        style={{
          ...videoStyle,
          transform: `${videoStyle.transform} ${mirrorTransform}`.trim(),
        }}
      />
      {audioElements}
      {scanline && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 12,
            background:
              `repeating-linear-gradient(` +
              `to bottom,` +
              `${scanlineColor},` +
              `rgba(255,255,255,0) ${1 + scanline.intensity * 0.08}px,` +
              `rgba(0,0,0,${0.7 * (scanline.intensity / 100)}) ${2 + scanline.intensity * 0.12}px,` +
              `rgba(0,0,0,0) ${4 + scanline.intensity * 0.2}px` +
              `)`,
            backgroundPositionY: scanlineOffset,
            mixBlendMode: "screen",
            opacity: scanlineOpacity,
            transition: "none",
          }}
        />
      )}
      {flashActive && flash && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 10,
            background: flash.color || "#fff",
            opacity: Math.min(1, 0.01 * flash.intensity * (1 - flashProgress)),
            transition: "none",
          }}
        />
      )}
      {vignette && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 11,
            background: (() => {
              const color = vignette.color || "#000"
              let r = 0,
                g = 0,
                b = 0
              if (color.startsWith("#")) {
                if (color.length === 4) {
                  r = parseInt(color[1] + color[1], 16)
                  g = parseInt(color[2] + color[2], 16)
                  b = parseInt(color[3] + color[3], 16)
                } else if (color.length === 7) {
                  r = parseInt(color.slice(1, 3), 16)
                  g = parseInt(color.slice(3, 5), 16)
                  b = parseInt(color.slice(5, 7), 16)
                }
              } else if (color.startsWith("rgb")) {
                // rgb/rgba string, on laisse tel quel
                return `radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${vignette.size ?? 40}%, ${color.replace(")", ", 0.25)")} ${(vignette.size ?? 40) + 15}%, ${color.replace(")", ", 0.7)")} 100%)`
              }
              // Calcule le ratio pour ellipse
              const ratio = width / height
              const ellipseX = Math.round(100 * ratio)
              const ellipseY = 50
              // Opacité max du bord selon intensity (0.05 à 0.95)
              const maxAlpha = 0.05 + 0.9 * ((vignette.intensity ?? 100) / 100)
              const midAlpha = maxAlpha * 0.35
              // size: 0 => 80 (large centre), size: 100 => 1 (petit centre)
              const mappedSize = 80 - 0.79 * (vignette.size ?? 0) // 0->80, 100->1
              return `radial-gradient(ellipse ${ellipseX}% ${ellipseY}% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${mappedSize}%, rgba(${r},${g},${b},${midAlpha}) ${mappedSize + 15}%, rgba(${r},${g},${b},${maxAlpha}) 100%)`
            })(),
            opacity: vignetteOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  )
}
