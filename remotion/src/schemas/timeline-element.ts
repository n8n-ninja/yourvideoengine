import { z } from "zod"
import { TimingSchema } from "./timing"
import { PositionSchema } from "./position"
import { RevealSchema } from "./reveal"
import { StyleSchema } from "./style"
import { themeNames } from "@/styles/title-themes"
import { EffectsSchema } from "./effect"
import { LetterAnimationConfigSchema } from "@/components/LetterAnimation"

const BaseElementSchema = z.object({
  timing: TimingSchema.optional(),
  position: PositionSchema.optional(),
  reveal: RevealSchema.optional(),
  containerStyle: StyleSchema.optional(),
  effects: EffectsSchema.optional(),
})

export const TitleSchema = z
  .object({
    type: z.literal("title"),
    title: z.string(),
    theme: z.enum(themeNames).optional(),
    style: StyleSchema.optional(),
    letterAnimation: LetterAnimationConfigSchema.optional(),
  })
  .merge(BaseElementSchema)

export const CaptionSchema = z
  .object({
    type: z.literal("caption"),
    boxStyle: StyleSchema.optional(),
    textStyle: StyleSchema.optional(),
    activeWordStyle: StyleSchema.optional(),
    multiColors: z.array(z.string()).optional(),
    combineTokensWithinMilliseconds: z.number().optional(),
    words: z.array(
      z.object({
        word: z.string(),
        start: z.number(),
        end: z.number(),
      }),
    ),
  })
  .merge(BaseElementSchema)

export const ImageSchema = z
  .object({
    type: z.literal("image"),
    url: z.string(),
    objectFit: z
      .enum(["cover", "contain", "fill", "none", "scale-down"])
      .optional(),
    style: StyleSchema.optional(),
  })
  .merge(BaseElementSchema)

export const AudioSchema = z
  .object({
    type: z.literal("audio"),
    sound: z.string(),
    pitch: z.number().optional(),
    speed: z.number().optional(),
    volume: z.number().optional(),
    loop: z.boolean().optional(),
    volumes: z
      .array(
        z.object({
          time: z.number(),
          value: z.number(),
        }),
      )
      .optional(),
  })
  .merge(BaseElementSchema)

export const CameraSchema = z
  .object({
    type: z.literal("camera"),
    url: z.string(),
    style: StyleSchema.optional(),
    offsetX: z.number().optional(),
    offsetY: z.number().optional(),
    speed: z.number().optional(),
    volume: z.number().optional(),
    loop: z.boolean().optional(),
    frameStyle: z.string().optional(),
    keyFrames: z
      .array(
        z.object({
          time: z.number(),
          value: z.object({
            scale: z.number().optional(),
            blur: z.number().optional(),
            rotation: z.number().optional(),
            filter: z.string().optional(),
            top: z.union([z.number(), z.string()]).optional(),
            left: z.union([z.number(), z.string()]).optional(),
            volume: z.number().optional(),
          }),
        }),
      )
      .optional(),
  })
  .merge(BaseElementSchema)

export const TimelineElementSchema = z.discriminatedUnion("type", [
  CameraSchema,
  ImageSchema,
  TitleSchema,
  AudioSchema,
  CaptionSchema,
])

export type AudioElement = z.infer<typeof AudioSchema>
export type TitleElement = z.infer<typeof TitleSchema>
export type CaptionElement = z.infer<typeof CaptionSchema>
export type ImageElement = z.infer<typeof ImageSchema>
export type CameraElement = z.infer<typeof CameraSchema>

export type TimelineElement = z.infer<typeof TimelineElementSchema>
