import { z } from "zod"

/**
 * Zod schema for a position configuration.
 * Supports top, left, right, bottom, and flex alignment.
 */
export const PositionSchema = z.object({
  top: z.number().optional(),
  left: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
  horizontalAlign: z.enum(["start", "center", "end"]).optional(),
  verticalAlign: z.enum(["start", "center", "end"]).optional(),
})

/**
 * Type inferred from PositionSchema.
 */
export type Position = z.infer<typeof PositionSchema>
