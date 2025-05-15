import React from "react"
import { AbsoluteFill } from "remotion"
import { ScanlineOverlay, ScanlineOverlayProps } from "./overlay/Scanline"
import { VignetteOverlay, VignetteOverlayProps } from "./overlay/Vignette"
import { ColorOverlay, ColorOverlayProps } from "./overlay/Color"
import { z } from "zod"
import { TimingSchema, useTiming } from "@/Utils/useTiming"
import {
  TransitionSchema,
  useRevealTransition,
} from "@/Utils/useRevealTransition"

// Overlay base type
type OverlayBase = {
  timing: z.infer<typeof TimingSchema>
  transition: z.infer<typeof TransitionSchema>
  opacity?: number
}

// Union type for all overlay variants
// (scanline, vignette, color)
type OverlayType =
  | (OverlayBase & ScanlineOverlayProps)
  | (OverlayBase & VignetteOverlayProps)
  | (OverlayBase & ColorOverlayProps)

/**
 * OverlayItem: renders a single overlay with timing and transition.
 */
const OverlayItem: React.FC<{ overlay: OverlayType }> = ({ overlay }) => {
  const { startFrame, endFrame, visible } = useTiming({
    start: overlay.timing.start,
    end: overlay.timing.end,
    duration: overlay.timing.duration,
  })

  const { style } = useRevealTransition({
    transition: { ...overlay.transition, type: "fade" },
    startFrame,
    endFrame,
  })

  if (!visible) return null

  return (
    <AbsoluteFill style={style}>
      {overlay.type === "scanline" && <ScanlineOverlay {...overlay} />}
      {overlay.type === "vignette" && <VignetteOverlay {...overlay} />}
      {overlay.type === "color" && <ColorOverlay {...overlay} />}
    </AbsoluteFill>
  )
}

/**
 * Overlay: renders a list of overlays.
 */
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
