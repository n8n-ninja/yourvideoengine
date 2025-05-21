import { z } from "zod"

/**
 * Zod schema for a position configuration.
 * Supports top, left, right, bottom as number (px) or string (%, px, etc), flex alignment, and keyframes for animation.
 */
const numberOrString = z.union([z.number(), z.string()])

export const PositionSchema = z.object({
  top: numberOrString.optional(),
  left: numberOrString.optional(),
  right: numberOrString.optional(),
  bottom: numberOrString.optional(),
  horizontalAlign: z.enum(["start", "center", "end"]).optional(),
  verticalAlign: z.enum(["start", "center", "end"]).optional(),
  keyframes: z
    .array(
      z.object({
        time: z.number(),
        value: z.object({
          top: numberOrString.optional(),
          left: numberOrString.optional(),
          right: numberOrString.optional(),
          bottom: numberOrString.optional(),
        }),
      }),
    )
    .optional(),
})

/**
 * Type inferred from PositionSchema.
 */
export type Position = z.infer<typeof PositionSchema>
