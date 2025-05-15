import { z } from "zod"

export const TimingSchema = z.object({
  start: z.number(),
  end: z.number().optional(),
  duration: z.number().optional(),
})

export type Timing = z.infer<typeof TimingSchema>
