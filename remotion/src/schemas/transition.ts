import { z } from "zod"

/**
 * Zod schema for a transition configuration.
 * Supports type, duration, direction, wipeDirection, and sound.
 */
export const TransitionSchema = z.object({
  type: z
    .enum(["fade", "wipe", "slide", "flip", "clockWipe"])
    .optional()
    .default("fade"),
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

/**
 * Type inferred from TransitionSchema.
 */
export type Transition = z.infer<typeof TransitionSchema>
