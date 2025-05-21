import { z } from "zod"

/**
 * Zod schema for a camera configuration.
 * Supports a video URL and optional animation keyframes for camera effects.
 */
const numberOrString = z.union([z.number(), z.string()])

export const CameraSchema = z.object({
  videoUrl: z.string(),
  onError: z.function().args(z.any()).optional(),
  keyFrames: z
    .array(
      z.object({
        time: z.number(),
        value: z.object({
          scale: z.number().optional(),
          blur: z.number().optional(),
          rotation: z.number().optional(),
          filter: z.string().optional(),
          top: numberOrString.optional(),
          left: numberOrString.optional(),
          volume: z.number().optional(),
        }),
      }),
    )
    .optional(),
  offsetX: z.number().optional(),
  offsetY: z.number().optional(),
  style: z.string().optional(),
  speed: z.number().optional(),
  volume: z.number().optional(),
  loop: z.boolean().optional(),
  frameStyle: z.string().optional(),
})

/**
 * Type inferred from CameraSchema.
 */
export type Camera = z.infer<typeof CameraSchema>
