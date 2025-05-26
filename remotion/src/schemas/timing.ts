import { z } from "zod"

/**
 * Zod schema for timing configuration.
 * Supports start, end, and duration fields.
 */
export const TimingSchema = z.object({
  start: z.number().optional(),
  end: z.number().optional(),
  duration: z.number().optional(),
})

/**
 * Type inferred from TimingSchema.
 */
export type Timing = z.infer<typeof TimingSchema>
