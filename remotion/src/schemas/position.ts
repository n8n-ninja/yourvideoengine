import { z } from "zod"

export const PositionSchema = z.object({
  top: z.number().optional(),
  left: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
  horizontalAlign: z.enum(["start", "center", "end"]).optional(),
  verticalAlign: z.enum(["start", "center", "end"]).optional(),
})

export type Position = z.infer<typeof PositionSchema>
