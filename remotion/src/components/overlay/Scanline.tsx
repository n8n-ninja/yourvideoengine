import React from "react"

export type ScanlineOverlayProps = {
  intensity: number
  color?: string
  speed?: number
  opacity: number
  frame: number
}

export const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({
  intensity,
  color = "#fff",
  speed = 0,
  opacity,
  frame,
}) => {
  const scanlineOffset = speed ? (frame * speed) % 20 : 0
  return (
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
          `${color},` +
          `rgba(255,255,255,0) ${1 + intensity * 0.08}px,` +
          `rgba(0,0,0,${0.7 * (intensity / 100)}) ${2 + intensity * 0.12}px,` +
          `rgba(0,0,0,0) ${4 + intensity * 0.2}px` +
          `)`,
        backgroundPositionY: scanlineOffset,
        mixBlendMode: "screen",
        opacity,
        transition: "none",
      }}
    />
  )
}
