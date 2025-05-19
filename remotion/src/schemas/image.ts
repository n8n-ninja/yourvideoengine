import { z } from "zod"
import { TimingSchema } from "./timing"
import { PositionSchema } from "./position"
import { TransitionSchema } from "./transition"
import { StyleSchema } from "./style"

/**
 * Zod schema for an array of image objects.
 * Chaque image peut avoir une url, un style, un timing, une position, une transition.
 */
export const ImagesSchema = z.array(
  z.object({
    url: z.string(),
    style: StyleSchema.optional(),
    timing: TimingSchema.optional(),
    position: PositionSchema.optional(),
    transition: TransitionSchema.optional(),
  }),
)

/**
 * Type représentant une image unique.
 */
export type Image = z.infer<typeof ImagesSchema>[number]

/**
 * Type représentant un tableau d'images.
 */
export type Images = z.infer<typeof ImagesSchema>
