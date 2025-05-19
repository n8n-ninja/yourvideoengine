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
const TitleSchema = TitlesSchema.element

export const TimelineElementSchema = z.discriminatedUnion("type", [
  CameraSchema.extend({
    type: z.literal("camera"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
  }),
  CaptionSchema.extend({
    type: z.literal("caption"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
  }),
  TitleSchema.extend({
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
  ScanlineOverlaySchema,
  VignetteOverlaySchema,
  ColorOverlaySchema,
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
