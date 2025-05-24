import { useKeyframes } from "@/hooks/useKeyframes"
import type { Position } from "@/schemas/position"
import React from "react"

/**
 * Computes the absolute positioning style for a component based on the given position config.
 * Supports percentage-based offsets, flex alignment, and keyframes interpolation.
 *
 * @param position The position configuration (top, left, right, bottom, horizontalAlign, verticalAlign, keyframes).
 * @returns A React.CSSProperties object for absolute positioning and alignment.
 */
export const getPosition = (position?: Position): React.CSSProperties => {
  // Defaults: tout à 0 + alignements center
  const defaults: Position = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    horizontalAlign: "center",
    verticalAlign: "center",
  }

  let merged: Position = { ...defaults, ...(position ?? {}) }

  // Si keyframes existent, interpoler et merger
  if (merged.keyframes && merged.keyframes.length > 0) {
    const interpolated =
      useKeyframes<Record<string, number | string>>(merged.keyframes) || {}
    merged = { ...defaults, ...(position ?? {}), ...interpolated }
  }

  const getValue = (val: number | string | undefined) =>
    typeof val === "string" ? val : val !== undefined ? `${val}%` : undefined

  return {
    position: "absolute",
    top: getValue(merged.top),
    left: getValue(merged.left),
    right: getValue(merged.right),
    bottom: getValue(merged.bottom),
    display: "flex",
    justifyContent: merged.horizontalAlign ?? "center",
    alignItems: merged.verticalAlign ?? "center",
    pointerEvents: "none" as const,
  }
}
