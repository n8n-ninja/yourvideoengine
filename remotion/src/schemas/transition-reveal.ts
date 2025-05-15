import { z } from "zod"

export const TRANSITION_REVEAL_TYPES = [
  "fade",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "zoom-in",
  "zoom-out",
  "blur",
] as const

export type TransitionRevealType = (typeof TRANSITION_REVEAL_TYPES)[number]

export const TransitionRevealSchema = z.object({
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

export type TransitionReveal = z.infer<typeof TransitionRevealSchema>
