import React from "react"
import { scanlineOverlayStyle } from "@/styles/default-style"
import { useTheme } from "../../contexts/ThemeContext"

/**
 * ScanlineOverlayProps: props for the ScanlineOverlay component.
 */
export type ScanlineOverlayProps = {
  type: "scanline"
  intensity: number
  color?: string
  speed?: number
  opacity: number
  frame: number
}

/**
 * ScanlineOverlay: renders a scanline effect overlay with adjustable intensity, color, speed, and opacity.
 */
export const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({
  intensity,
  color = "#fff",
  speed = 0,
  opacity,
  frame,
}) => {
  const theme = useTheme()
  const scanlineOffset = speed ? (frame * speed) % 20 : 0
  return (
    <div
      style={{
        ...scanlineOverlayStyle,
        ...theme.overlay?.scanline,
        background:
          `repeating-linear-gradient(` +
          `to bottom,` +
          `${color},` +
          `rgba(255,255,255,0) ${1 + intensity * 0.08}px,` +
          `rgba(0,0,0,${0.7 * (intensity / 100)}) ${2 + intensity * 0.12}px,` +
          `rgba(0,0,0,0) ${4 + intensity * 0.2}px` +
          `)`,
        backgroundPositionY: scanlineOffset,
        opacity,
      }}
    />
  )
}
