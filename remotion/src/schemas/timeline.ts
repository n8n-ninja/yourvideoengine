import { z } from "zod"
import { CameraSchema } from "./camera"
import { CaptionSchema } from "./caption"
import { TitlesSchema } from "./title"
import { SoundSchema } from "./sound"
import { TimingSchema } from "./timing"
import { TransitionSchema } from "./transition"
import { PositionSchema } from "./position"
import {
  ScanlineOverlaySchema,
  VignetteOverlaySchema,
  ColorOverlaySchema,
} from "./overlay"
import { EffectsSchema } from "./effect"
const TitleSchema = TitlesSchema.element

const WithEffectsSchema = z.object({ effects: EffectsSchema.optional() })

export const TimelineElementSchema = z.discriminatedUnion("type", [
  CameraSchema.merge(WithEffectsSchema).extend({
    type: z.literal("camera"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
  }),
  CaptionSchema.merge(WithEffectsSchema).extend({
    type: z.literal("caption"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
  }),
  TitleSchema.merge(WithEffectsSchema).extend({
    type: z.literal("title"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
  }),
  SoundSchema.extend({
    type: z.literal("sound"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
  }),
  ScanlineOverlaySchema.merge(WithEffectsSchema),
  VignetteOverlaySchema.merge(WithEffectsSchema),
  ColorOverlaySchema.merge(WithEffectsSchema),
])

export const SceneSchema = z.object({
  duration: z.number(),
  timeline: z.array(TimelineElementSchema),
  transition: TransitionSchema.optional(),
})

export const ProjectSchema = z.object({
  scenes: z.array(SceneSchema),
  globalTimeline: z.array(TimelineElementSchema).optional().default([]),
})
