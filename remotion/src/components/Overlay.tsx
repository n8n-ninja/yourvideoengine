import React from "react"
import { AbsoluteFill } from "remotion"
import { ScanlineOverlay } from "./overlay/Scanline"
import { VignetteOverlay } from "./overlay/Vignette"
import { ColorOverlay } from "./overlay/Color"
import { Overlay as OverlayType } from "@/schemas/overlay"

export const Overlay: React.FC<{
  overlay: OverlayType
  revealProgress?: number
}> = ({ overlay, revealProgress = 1 }) => {
  return (
    <AbsoluteFill>
      {overlay.type === "scanline" && (
        <ScanlineOverlay
          {...overlay}
          opacity={overlay.opacity ?? 1}
          frame={overlay.frame ?? 0}
        />
      )}
      {overlay.type === "vignette" && <VignetteOverlay {...overlay} />}
      {overlay.type === "color" && <ColorOverlay {...overlay} />}
    </AbsoluteFill>
  )
}
