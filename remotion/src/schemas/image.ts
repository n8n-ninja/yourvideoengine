import { z } from "zod"
import { TimingSchema } from "./timing"
import { PositionSchema } from "./position"
import { RevealSchema } from "./reveal"
import { StyleSchema } from "./style"

/**
 * Zod schema for an array of image objects.
 * Chaque image peut avoir une url, un style, un timing, une position, une transition.
 */
export const ImageSchema = z.object({
  url: z.string(),
  style: StyleSchema.optional(),
  timing: TimingSchema.optional(),
  position: PositionSchema.optional(),
  reveal: RevealSchema.optional(),
  objectFit: z
    .enum(["cover", "contain", "fill", "none", "scale-down"])
    .optional(),
})

/**
 * Type représentant une image unique.
 */
export type Image = z.infer<typeof ImageSchema>
