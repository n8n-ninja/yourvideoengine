import { z } from "zod"

/**
 * Zod schema for progress easing configuration.
 * Supports global, in, and out easing and durations.
 */
export const ProgressEasingSchema = z.object({
  easing: z.string().optional(),
  duration: z.number().optional(),
  inEasing: z.string().optional(),
  inDuration: z.number().optional(),
  outEasing: z.string().optional(),
  outDuration: z.number().optional(),
})

/**
 * Type inferred from ProgressEasingSchema.
 */
export type ProgressEasing = z.infer<typeof ProgressEasingSchema>
