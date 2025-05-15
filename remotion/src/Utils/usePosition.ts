import React from "react"
import { z } from "zod"

export const PositionSchema = z.object({
  top: z.number().optional(),
  left: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
  horizontalAlign: z.enum(["start", "center", "end"]).optional(),
  verticalAlign: z.enum(["start", "center", "end"]).optional(),
})

export type UsePositionProps = z.infer<typeof PositionSchema>

export function usePosition({
  top = 0,
  left = 0,
  right = 0,
  bottom = 0,
  horizontalAlign = "center",
  verticalAlign = "center",
}: UsePositionProps): React.CSSProperties {
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
