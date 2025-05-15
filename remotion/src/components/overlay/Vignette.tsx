import React from "react"
import { useVideoConfig } from "remotion"

/**
 * VignetteOverlayProps: props for the VignetteOverlay component.
 */
export type VignetteOverlayProps = {
  type: "vignette"
  intensity?: number
  size?: number
  color?: string
  opacity?: number
}

/**
 * VignetteOverlay: renders a vignette effect overlay with adjustable intensity, size, color, and opacity.
 */
export const VignetteOverlay: React.FC<VignetteOverlayProps> = ({
  intensity = 100,
  size = 40,
  color = "#000",
  opacity = 1,
}) => {
  const { width, height } = useVideoConfig()
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
  }
  const ratio = width / height
  const ellipseX = Math.round(100 * ratio)
  const ellipseY = 50
  const maxAlpha = 0.05 + 0.9 * (intensity / 100)
  const midAlpha = maxAlpha * 0.35
  const mappedSize = 80 - 0.79 * size
  const background = `radial-gradient(ellipse ${ellipseX}% ${ellipseY}% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${mappedSize}%, rgba(${r},${g},${b},${midAlpha}) ${mappedSize + 15}%, rgba(${r},${g},${b},${maxAlpha}) 100%)`
  return (
    <div
      style={{
        position: "absolute",
        left: -2,
        top: -2,
        right: -2,
        bottom: -2,
        pointerEvents: "none",
        zIndex: 11,
        background,
        opacity,
      }}
    />
  )
}
