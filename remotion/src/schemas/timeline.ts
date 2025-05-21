import { z } from "zod"
import { CameraSchema } from "./camera"
import { CaptionSchema } from "./caption"
import { TitlesSchema } from "./title"
import { SoundSchema } from "./sound"
import { TimingSchema } from "./timing"
import { TransitionSchema } from "./transition"
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
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  ImageSchema.merge(WithEffectsSchema).extend({
    type: z.literal("image"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  CaptionSchema.merge(WithEffectsSchema).extend({
    type: z.literal("caption"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  TitleSchema.merge(WithEffectsSchema).extend({
    type: z.literal("title"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
    position: PositionSchema.optional(),
    ...WithContainerStyle.shape,
  }),
  SoundSchema.extend({
    type: z.literal("sound"),
    timing: TimingSchema.optional(),
    transition: TransitionSchema.optional(),
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
  transition: TransitionSchema.optional(),
})

export const ProjectSchema = z.object({
  scenes: z.array(SceneSchema),
  globalTimeline: z.array(TimelineElementSchema).optional().default([]),
})

export type Scene = z.infer<typeof SceneSchema>
export type Project = z.infer<typeof ProjectSchema>
export type TimelineItem = z.infer<typeof TimelineElementSchema>
