import { z } from "zod"

/**
 * Zod schema for a style configuration.
 * Accepts either a record (object) or a string (CSS style string).
 */
export const WordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
})

/**
 * Type inferred from StyleSchema.
 */
export type Word = z.infer<typeof WordSchema>
