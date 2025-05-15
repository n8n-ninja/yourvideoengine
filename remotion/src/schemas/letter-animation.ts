import { z } from "zod"

/**
 * Zod schema for letter animation configuration.
 * Supports duration, stagger, easing, translateY, and direction.
 */
export const LetterAnimationConfigSchema = z.object({
  duration: z.number().optional(),
  stagger: z.number().optional(),
  easing: z.string().optional(),
  translateY: z.number().optional(),
  direction: z.enum(["ltr", "rtl", "random"]).optional(),
})

/**
 * Type inferred from LetterAnimationConfigSchema.
 */
export type LetterAnimationConfig = z.infer<typeof LetterAnimationConfigSchema>
