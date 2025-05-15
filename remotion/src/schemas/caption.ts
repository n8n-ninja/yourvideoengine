import { z } from "zod"
import { PositionSchema } from "./position"
import { StyleSchema } from "./style"

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

export type Caption = z.infer<typeof CaptionSchema>
