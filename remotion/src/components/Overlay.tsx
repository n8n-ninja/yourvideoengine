import React from "react"
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { ScanlineOverlay, ScanlineOverlayProps } from "./overlay/Scanline"
import { VignetteOverlay, VignetteOverlayProps } from "./overlay/Vignette"
import { ColorOverlay, ColorOverlayProps } from "./overlay/Color"
import { useTimeRange, getEasingFn } from "@/Utils/time"

// Props communes à tous les overlays (timing, fade, etc.)
type OverlayBase = {
  start?: number
  end?: number
  duration?: number
  inDuration?: number
  outDuration?: number
  inEasing?: string
  outEasing?: string
  opacity?: number
}

type OverlayType =
  | ({ type: "scanline" } & OverlayBase & ScanlineOverlayProps)
  | ({ type: "vignette" } & OverlayBase & VignetteOverlayProps)
  | ({ type: "color" } & OverlayBase & ColorOverlayProps)

const OverlayItem: React.FC<{ overlay: OverlayType }> = ({ overlay }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { from, frames } = useTimeRange({
    start: overlay.start ?? 0,
    end: overlay.end,
    duration: overlay.duration,
  })
  if (frame < from || frame >= from + frames) return null
  const localFrame = frame - from
  const localTime = localFrame / fps
  const totalDuration = frames / fps

  // Fade in/out logic
  const inDuration = overlay.inDuration ?? 0.3
  const outDuration = overlay.outDuration ?? 0.3
  const inEasing = getEasingFn(overlay.inEasing)
  const outEasing = getEasingFn(overlay.outEasing)
  let fade = 1
  if (localTime < inDuration) {
    fade = inEasing(localTime / inDuration)
  } else if (localTime > totalDuration - outDuration) {
    fade =
      1 - outEasing((localTime - (totalDuration - outDuration)) / outDuration)
  }
  fade = Math.max(0, Math.min(1, fade))
  const computedOpacity = (overlay.opacity ?? 1) * fade

  if (overlay.type === "scanline") {
    return (
      <ScanlineOverlay
        {...overlay}
        frame={localFrame}
        opacity={computedOpacity}
      />
    )
  }
  if (overlay.type === "vignette") {
    return <VignetteOverlay {...overlay} opacity={computedOpacity} />
  }
  if (overlay.type === "color") {
    return <ColorOverlay {...overlay} opacity={computedOpacity} />
  }
  return null
}

export const Overlay: React.FC<{ overlays: OverlayType[] }> = ({
  overlays,
}) => {
  return (
    <AbsoluteFill>
      {overlays.map((overlay, i) => (
        <OverlayItem key={i} overlay={overlay} />
      ))}
    </AbsoluteFill>
  )
}
