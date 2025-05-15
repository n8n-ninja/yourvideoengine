import { z } from "zod"

export const CameraSchema = z.object({
  videoUrl: z.string(),
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

export type Camera = z.infer<typeof CameraSchema>
