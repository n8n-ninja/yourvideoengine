import React from "react"

interface Scanline {
  intensity: number
  color?: string
  speed?: number
  noise?: boolean
}

interface Vignette {
  intensity: number
  size: number
  color?: string
}

interface Flash {
  duration: number
  intensity: number
  color?: string
}

function getEasingFn(easingName?: string) {
  if (!easingName) return (x: number) => x
  if (easingName === "easeIn") return (x: number) => x * x
  if (easingName === "easeOut") return (x: number) => 1 - (1 - x) * (1 - x)
  if (easingName === "easeInOut")
    return (x: number) =>
      x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  return (x: number) => x
}

type OverlayProps = {
  scanline: Scanline | null
  scanlineEasing?: string
  scanlinePrevTime?: number
  scanlineNextTime?: number
  vignette: Vignette | null
  vignetteEasing?: string
  vignettePrevTime?: number
  vignetteNextTime?: number
  flash: Flash | null
  flashActive: boolean
  flashProgress: number
  frame: number
  width: number
  height: number
  fps: number
  durationInFrames: number
  currentTime: number
}

export const Overlay: React.FC<OverlayProps> = ({
  scanline,
  scanlineEasing,
  scanlinePrevTime = 0,
  scanlineNextTime,
  vignette,
  vignetteEasing,
  vignettePrevTime = 0,
  vignetteNextTime,
  flash,
  flashActive,
  flashProgress,
  frame,
  width,
  height,
  fps,
  durationInFrames,
  currentTime,
}) => {
  // Scanline
  const scanlineColor = scanline?.color || "#fff"
  const scanlineSpeed = scanline?.speed || 0
  const scanlineOffset = scanlineSpeed ? (frame * scanlineSpeed) % 20 : 0
  let scanlineOpacity = 1
  if (scanline) {
    if (currentTime - (scanlinePrevTime ?? 0) < 0.3) {
      let t = (currentTime - (scanlinePrevTime ?? 0)) / 0.3
      t = getEasingFn(scanlineEasing)(t)
      scanlineOpacity = t
    }
    if ((scanlineNextTime ?? durationInFrames / fps) - currentTime < 0.3) {
      let t =
        1 - ((scanlineNextTime ?? durationInFrames / fps) - currentTime) / 0.3
      t = getEasingFn(scanlineEasing)(t)
      scanlineOpacity = Math.min(scanlineOpacity, 1 - t)
    }
    scanlineOpacity = Math.max(0, Math.min(1, scanlineOpacity))
  }

  // Vignette
  let vignetteOpacity = 1
  if (vignette) {
    if (currentTime - (vignettePrevTime ?? 0) < 0.3) {
      let t = (currentTime - (vignettePrevTime ?? 0)) / 0.3
      t = getEasingFn(vignetteEasing)(t)
      vignetteOpacity = t
    }
    if ((vignetteNextTime ?? durationInFrames / fps) - currentTime < 0.3) {
      let t =
        1 - ((vignetteNextTime ?? durationInFrames / fps) - currentTime) / 0.3
      t = getEasingFn(vignetteEasing)(t)
      vignetteOpacity = Math.min(vignetteOpacity, 1 - t)
    }
    vignetteOpacity = Math.max(0, Math.min(1, vignetteOpacity))
  }

  return (
    <>
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
                return `radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${vignette.size ?? 40}%, ${color.replace(")", ", 0.25)")} ${(vignette.size ?? 40) + 15}%, ${color.replace(")", ", 0.7)")} 100%)`
              }
              const ratio = width / height
              const ellipseX = Math.round(100 * ratio)
              const ellipseY = 50
              const maxAlpha = 0.05 + 0.9 * ((vignette.intensity ?? 100) / 100)
              const midAlpha = maxAlpha * 0.35
              const mappedSize = 80 - 0.79 * (vignette.size ?? 0)
              return `radial-gradient(ellipse ${ellipseX}% ${ellipseY}% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${mappedSize}%, rgba(${r},${g},${b},${midAlpha}) ${mappedSize + 15}%, rgba(${r},${g},${b},${maxAlpha}) 100%)`
            })(),
            opacity: vignetteOpacity,
          }}
        />
      )}
    </>
  )
}
