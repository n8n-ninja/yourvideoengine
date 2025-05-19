import React from "react"
import { colorOverlayStyle } from "@/styles/default-style"
import { useTheme } from "../theme-context"

/**
 * ColorOverlayProps: props for the ColorOverlay component.
 */
export type ColorOverlayProps = {
  type: "color"
  color?: string
  intensity?: number
  opacity?: number
}

/**
 * ColorOverlay: renders a colored overlay with adjustable intensity and opacity.
 */
export const ColorOverlay: React.FC<ColorOverlayProps> = ({
  color = "#fff",
  intensity = 50,
  opacity = 1,
}) => {
  const theme = useTheme()
  return (
    <div
      style={{
        ...colorOverlayStyle,
        ...theme.overlay?.color,
        background: color,
        opacity: Math.min(1, 0.01 * intensity * opacity),
      }}
    />
  )
}
