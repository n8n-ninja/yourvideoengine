import { z } from "zod"
import { TimingSchema } from "./timing"
import { ProgressEasingSchema } from "./progress-easing"

export const SoundSchema = z.object({
  timing: TimingSchema.optional(),
  sound: z.string(),
  pitch: z.number().optional(),
  volume: z.number().optional(),
  loop: z.boolean().optional(),
  transition: ProgressEasingSchema.optional(),
  volumes: z
    .array(
      z.object({
        time: z.number(),
        value: z.number(),
      }),
    )
    .optional(),
})

export const SoundsSchema = z.array(SoundSchema)

export type Sound = z.infer<typeof SoundSchema>
export type Sounds = z.infer<typeof SoundsSchema>
