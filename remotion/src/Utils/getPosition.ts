import { Position } from "@/schemas/index_2"

/**
 * Computes the absolute positioning style for a component based on the given position config.
 * Supports percentage-based offsets and flex alignment.
 *
 * @param position The position configuration (top, left, right, bottom, horizontalAlign, verticalAlign).
 * @returns A React.CSSProperties object for absolute positioning and alignment.
 */
export function getPosition({
  top = 0,
  left = 0,
  right = 0,
  bottom = 0,
  horizontalAlign = "center",
  verticalAlign = "center",
}: Position): React.CSSProperties {
  const getValue = (val: number | string | undefined) =>
    typeof val === "string" ? val : `${val}%`

  return {
    position: "absolute",
    top: getValue(top),
    left: getValue(left),
    right: getValue(right),
    bottom: getValue(bottom),
    display: "flex",
    justifyContent: horizontalAlign,
    alignItems: verticalAlign,
    pointerEvents: "none" as const,
  }
}
