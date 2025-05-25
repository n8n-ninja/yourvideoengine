import React from "react"
import type { BackgroundType } from "@/schemas/project"
import { Video, useCurrentFrame, useVideoConfig } from "remotion"

// Utilitaire pour interpoler deux couleurs hex (sans alpha)
function lerpColor(a: string, b: string, t: number): string {
  // a et b: "#RRGGBB" ou "#RGB"
  function hexToRgb(hex: string) {
    let c = hex.replace("#", "")
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
    const num = parseInt(c, 16)
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
  }
  function rgbToHex([r, g, b]: number[]) {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
  }
  const rgbA = hexToRgb(a)
  const rgbB = hexToRgb(b)
  const rgb = [
    Math.round(rgbA[0] + (rgbB[0] - rgbA[0]) * t),
    Math.round(rgbA[1] + (rgbB[1] - rgbA[1]) * t),
    Math.round(rgbA[2] + (rgbB[2] - rgbA[2]) * t),
  ]
  return rgbToHex(rgb)
}

export const Background: React.FC<BackgroundType & { className?: string }> = ({
  backgroundColor,
  backgroundGradient,
  backgroundImage,
  backgroundVideo,
  animationSpeed = 3,
  animationType = "crossfade",
  className,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const colorArray = Array.isArray(backgroundColor)
    ? backgroundColor
    : backgroundColor
      ? [backgroundColor]
      : ["#000"]

  // Détermination de la couleur à afficher (interpolation JS)
  let bgColor = colorArray[0]
  if (animationType === "crossfade" && colorArray.length > 1) {
    const stepFrames = Math.max(1, Math.round(animationSpeed * fps))
    const totalSteps = colorArray.length
    const totalFrames = stepFrames * totalSteps
    const localFrame = frame % totalFrames
    const idx = Math.floor(localFrame / stepFrames)
    const nextIdx = (idx + 1) % totalSteps
    const t = (localFrame % stepFrames) / stepFrames
    // Si toutes les couleurs sont hex, on interpole, sinon on cut
    if (colorArray.every((c) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c))) {
      bgColor = lerpColor(colorArray[idx], colorArray[nextIdx], t)
    } else {
      // fallback: cut
      bgColor = colorArray[idx]
    }
  } else if (animationType === "hard" && colorArray.length > 1) {
    const stepFrames = Math.max(1, Math.round(animationSpeed * fps))
    const idx = Math.floor(frame / stepFrames) % colorArray.length
    bgColor = colorArray[idx]
  }

  // Styles de base
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    pointerEvents: "none",
    overflow: "hidden",
  }

  // Couleur de fond
  const colorStyle: React.CSSProperties = {
    ...baseStyle,
    background: bgColor,
  }

  // Gradient de fond (par dessus la couleur)
  const gradientValue = Array.isArray(backgroundGradient)
    ? backgroundGradient[0]
    : backgroundGradient
  const gradientStyle: React.CSSProperties = {
    ...baseStyle,
    background: gradientValue,
    opacity: gradientValue ? 1 : 0,
    pointerEvents: "none",
  }

  // Image de fond
  const imageStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 0,
    opacity: backgroundImage ? 1 : 0,
  }

  // Vidéo de fond
  const videoStyle: React.CSSProperties = {
    ...baseStyle,
    objectFit: "cover",
    zIndex: 0,
    opacity: backgroundVideo ? 1 : 0,
  }

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none ${className ?? ""}`}
      aria-hidden="true"
      tabIndex={-1}
      style={{ zIndex: 0 }}
    >
      {/* Vidéo */}
      {backgroundVideo && (
        <Video src={backgroundVideo} volume={0} loop style={videoStyle} />
      )}
      {/* Image */}
      {!backgroundVideo && backgroundImage && <div style={imageStyle} />}
      {/* Couleur */}
      {!backgroundVideo && !backgroundImage && <div style={colorStyle} />}
      {/* Gradient par dessus */}
      {gradientValue && <div style={gradientStyle} />}
    </div>
  )
}
