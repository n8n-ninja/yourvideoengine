import { z } from "zod"

export const ProgressEasingSchema = z.object({
  easing: z.string().optional(),
  duration: z.number().optional(),
  inEasing: z.string().optional(),
  inDuration: z.number().optional(),
  outEasing: z.string().optional(),
  outDuration: z.number().optional(),
})

export type ProgressEasing = z.infer<typeof ProgressEasingSchema>
