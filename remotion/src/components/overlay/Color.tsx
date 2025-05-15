import React from "react"

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
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
        background: color,
        opacity: Math.min(1, 0.01 * intensity * opacity),
        transition: "none",
      }}
    />
  )
}
