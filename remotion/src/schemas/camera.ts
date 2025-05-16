import { z } from "zod"

/**
 * Zod schema for a camera configuration.
 * Supports a video URL and optional animation keyframes for camera effects.
 */
export const CameraSchema = z.object({
  videoUrl: z.string(),
  onError: z.function().args(z.any()).optional(),
  animationKeyframes: z
    .array(
      z.object({
        time: z.number(),
        value: z.object({
          scale: z.number().optional(),
          blur: z.number().optional(),
          rotation: z.number().optional(),
          filter: z.string().optional(),
          top: z.number().optional(),
          left: z.number().optional(),
        }),
      }),
    )
    .optional(),
})

/**
 * Type inferred from CameraSchema.
 */
export type Camera = z.infer<typeof CameraSchema>
