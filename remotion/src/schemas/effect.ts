import { z } from "zod"

export const EffectSchema = z.object({
  type: z.string(),
  options: z.record(z.any()).optional(),
})

export const EffectsSchema = z.array(EffectSchema)

export type Effect = z.infer<typeof EffectSchema>
export type Effects = z.infer<typeof EffectsSchema>
