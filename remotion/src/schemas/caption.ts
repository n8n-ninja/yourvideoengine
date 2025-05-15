import { z } from "zod"
import { PositionSchema } from "./position"
import { StyleSchema } from "./style"

/**
 * Zod schema for a caption configuration.
 * Supports word timing, position, box/text/active styles, multi-colors, and token combination.
 */
export const CaptionSchema = z.object({
  words: z.array(
    z.object({
      word: z.string(),
      start: z.number(),
      end: z.number(),
      confidence: z.number().optional(),
    }),
  ),
  position: PositionSchema.optional(),
  boxStyle: StyleSchema.optional(),
  textStyle: StyleSchema.optional(),
  activeWordStyle: StyleSchema.optional(),
  multiColors: z.array(z.string()).optional(),
  combineTokensWithinMilliseconds: z.number().optional(),
})

/**
 * Type inferred from CaptionSchema.
 */
export type Caption = z.infer<typeof CaptionSchema>
