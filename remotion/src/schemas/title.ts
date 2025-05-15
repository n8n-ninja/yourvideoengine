import { z } from "zod"
import { TimingSchema } from "./timing"
import { PositionSchema } from "./position"
import { TransitionSchema } from "./transition"
import { LetterAnimationConfigSchema } from "./letter-animation"

const themeNames = ["minimal"] // Add more as needed
const animationPresetNames = ["fadeIn"] // Add more as needed

const LetterAnimationSchema = LetterAnimationConfigSchema.extend({
  preset: z.enum(animationPresetNames as [string, ...string[]]).optional(),
})

/**
 * Zod schema for an array of title objects.
 * Each title can have a theme, timing, position, style, transition, and letter animation.
 */
export const TitlesSchema = z.array(
  z.object({
    title: z.string(),
    theme: z.enum(themeNames as [string, ...string[]]).optional(),
    timing: TimingSchema.optional(),
    position: PositionSchema.optional(),
    style: z.object({}).passthrough().optional(),
    transition: TransitionSchema.optional(),
    letterAnimation: LetterAnimationSchema.optional(),
  }),
)

/**
 * Type representing a single title object.
 */
export type Title = z.infer<typeof TitlesSchema>[number]

/**
 * Type representing an array of title objects.
 */
export type Titles = z.infer<typeof TitlesSchema>
