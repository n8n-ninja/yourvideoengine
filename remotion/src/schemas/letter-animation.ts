import { z } from "zod"

export const LetterAnimationConfigSchema = z.object({
  duration: z.number().optional(),
  stagger: z.number().optional(),
  easing: z.string().optional(),
  translateY: z.number().optional(),
  direction: z.enum(["ltr", "rtl", "random"]).optional(),
})

export type LetterAnimationConfig = z.infer<typeof LetterAnimationConfigSchema>
