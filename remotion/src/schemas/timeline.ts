import { z } from "zod"
import { TimelineElementSchema, TimelineElement } from "./timeline-element"
import { RevealSchema } from "./reveal"

export const SceneSchema = z.object({
  duration: z.number(),
  timeline: z.array(TimelineElementSchema),
  reveal: RevealSchema.optional(),
})

// TransitionScene: une "scène" spéciale pour les transitions
export const TransitionSceneSchema = z.object({
  type: z.literal("transition"),
  animation: z.enum(["fade", "wipe", "slide", "flip", "clockWipe"]),
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

// Union: soit une scène normale (pas de type), soit une transition
export const SceneOrTransitionSchema = z.union([
  SceneSchema,
  TransitionSceneSchema,
])

export const ProjectSchema = z.object({
  scenes: z.array(SceneOrTransitionSchema),
  globalTimeline: z.array(TimelineElementSchema).optional().default([]),
})

export type Scene = z.infer<typeof SceneSchema>
export type TransitionScene = z.infer<typeof TransitionSceneSchema>
export type SceneOrTransition = Scene | TransitionScene
export type Project = z.infer<typeof ProjectSchema>
export { TimelineElement, TimelineElementSchema }
