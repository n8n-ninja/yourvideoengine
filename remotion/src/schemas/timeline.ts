import { z } from "zod"
import { CameraSchema } from "./camera"
import { CaptionSchema } from "./caption"
import { TitlesSchema } from "./title"
import { SoundSchema } from "./sound"
import { TimingSchema } from "./timing"
import { RevealSchema } from "./reveal"
import { PositionSchema } from "./position"
import { ImageSchema } from "./image"
import {
  ScanlineOverlaySchema,
  VignetteOverlaySchema,
  ColorOverlaySchema,
} from "./overlay"
import { EffectsSchema } from "./effect"
import { StyleSchema } from "./style"
const TitleSchema = TitlesSchema.element

const WithEffectsSchema = z.object({ effects: EffectsSchema.optional() })
const WithContainerStyle = z.object({ containerStyle: StyleSchema.optional() })

export const TimelineElementSchema = z.discriminatedUnion("type", [
  CameraSchema.merge(WithEffectsSchema).extend({
    type: z.literal("camera"),
    timing: TimingSchema.optional(),
    reveal: RevealSchema.optional(),
    position: PositionSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  ImageSchema.merge(WithEffectsSchema).extend({
    type: z.literal("image"),
    timing: TimingSchema.optional(),
    reveal: RevealSchema.optional(),
    position: PositionSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  CaptionSchema.merge(WithEffectsSchema).extend({
    type: z.literal("caption"),
    timing: TimingSchema.optional(),
    reveal: RevealSchema.optional(),
    position: PositionSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  TitleSchema.merge(WithEffectsSchema).extend({
    type: z.literal("title"),
    timing: TimingSchema.optional(),
    reveal: RevealSchema.optional(),
    position: PositionSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  SoundSchema.extend({
    type: z.literal("sound"),
    timing: TimingSchema.optional(),
    reveal: RevealSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  ScanlineOverlaySchema.merge(WithEffectsSchema).extend({
    ...WithContainerStyle.shape,
  }),
  VignetteOverlaySchema.merge(WithEffectsSchema).extend({
    ...WithContainerStyle.shape,
  }),
  ColorOverlaySchema.merge(WithEffectsSchema).extend({
    ...WithContainerStyle.shape,
  }),
])

export const SceneSchema = z.object({
  duration: z.number(),
  timeline: z.array(TimelineElementSchema),
  reveal: RevealSchema.optional(),
})

// TransitionScene: une "scène" spéciale pour les transitions
export const TransitionSceneSchema = z.object({
  type: z.literal("transition"),
  animation: z.enum(["fade", "wipe", "slide", "flip", "clockWipe", "zoom"]),
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
export type TimelineItem = z.infer<typeof TimelineElementSchema>
