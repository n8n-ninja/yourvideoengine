import { Position } from "@/schemas"

export function getPosition({
  top = 0,
  left = 0,
  right = 0,
  bottom = 0,
  horizontalAlign = "center",
  verticalAlign = "center",
}: Position): React.CSSProperties {
  return {
    position: "absolute",
    top: `${top}%`,
    left: `${left}%`,
    right: `${right}%`,
    bottom: `${bottom}%`,
    display: "flex",
    justifyContent: horizontalAlign,
    alignItems: verticalAlign,
    pointerEvents: "none" as const,
  }
}
