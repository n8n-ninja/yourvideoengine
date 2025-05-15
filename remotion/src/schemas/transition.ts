import { z } from "zod"

export const TransitionSchema = z.object({
  type: z.enum(["fade", "wipe", "slide", "flip", "clockWipe"]),
  duration: z.number().optional(),
  direction: z
    .enum(["from-left", "from-right", "from-top", "from-bottom"])
    .optional(),
  wipeDirection: z
    .enum([
      "from-left",
      "from-right",
      "from-top",
      "from-bottom",
      "from-top-left",
      "from-top-right",
      "from-bottom-left",
      "from-bottom-right",
    ])
    .optional(),
  sound: z.string().optional(),
})

export type Transition = z.infer<typeof TransitionSchema>
