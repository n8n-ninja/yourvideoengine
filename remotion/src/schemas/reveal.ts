import { z } from "zod"

/**
 * List of supported reveal transition types.
 */
export const TRANSITION_REVEAL_TYPES = [
  "fade",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "zoom-in",
  "zoom-out",
  "blur",

  "swipe",
] as const

/**
 * Type representing a supported reveal transition type.
 */
export type RevealType = (typeof TRANSITION_REVEAL_TYPES)[number]

/**
 * Zod schema for a reveal transition configuration.
 * Supports in/out types, easings, and durations.
 */
export const RevealSchema = z.object({
  type: z.enum(TRANSITION_REVEAL_TYPES).optional(),
  easing: z.string().optional(),
  duration: z.number().optional(),

  inType: z.enum(TRANSITION_REVEAL_TYPES).optional(),
  inEasing: z.string().optional(),
  inDuration: z.number().optional(),

  outType: z.enum(TRANSITION_REVEAL_TYPES).optional(),
  outEasing: z.string().optional(),
  outDuration: z.number().optional(),
})

/**
 * Type inferred from TransitionRevealSchema.
 */
export type Reveal = z.infer<typeof RevealSchema>
