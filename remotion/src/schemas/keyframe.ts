import { z } from "zod"

/**
 * Zod schema for a style configuration.
 * Accepts either a record (object) or a string (CSS style string).
 */
export const KeyframeSchema = z.object({
  time: z.number(),
  value: z.record(z.string(), z.number()),
})

/**
 * Type inferred from StyleSchema.
 */
export type Keyframe = z.infer<typeof KeyframeSchema>
