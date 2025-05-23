import { z } from "zod"
import { TimingSchema } from "./timing"
import { PositionSchema } from "./position"
import { RevealSchema } from "./reveal"
import { LetterAnimationConfigSchema } from "./letter-animation"
import { titleThemes } from "@/styles/themes"
import { StyleSchema } from "./style"
const themeNames = Object.keys(titleThemes)

// LetterAnimationSchema = LetterAnimationConfigSchema (plus de preset)
const LetterAnimationSchema = LetterAnimationConfigSchema

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
    style: StyleSchema.optional(),
    letterAnimation: LetterAnimationSchema.optional(),
    reveal: RevealSchema.optional(),
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
