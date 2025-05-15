import { z } from "zod"
import { TimingSchema } from "./timing"
import { ProgressEasingSchema } from "./progress-easing"

/**
 * Zod schema for a single sound configuration.
 * Supports timing, pitch, volume, loop, transition, and volume keyframes.
 */
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

/**
 * Zod schema for an array of sound configurations.
 */
export const SoundsSchema = z.array(SoundSchema)

/**
 * Type inferred from SoundSchema.
 */
export type Sound = z.infer<typeof SoundSchema>

/**
 * Type inferred from SoundsSchema.
 */
export type Sounds = z.infer<typeof SoundsSchema>
