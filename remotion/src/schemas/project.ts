import { z } from "zod"
import { TimingSchema } from "./timing"
import { PositionSchema } from "./position"
import { RevealSchema } from "./reveal"
import { StyleSchema } from "./style"
import { themeNames } from "@/styles/title-themes"
import { EffectsSchema } from "./effect"
import { LetterAnimationConfigSchema } from "@/components/LetterAnimation"

const BaseLayer = z.object({
  id: z.string().uuid().optional(),
  timing: TimingSchema.optional(),
  position: PositionSchema.optional(),
  reveal: RevealSchema.optional(),
  containerStyle: StyleSchema.optional(),
  effects: EffectsSchema.optional(),
})

export const TitleLayer = z
  .object({
    type: z.literal("title"),
    title: z.string(),
    theme: z.enum(themeNames).optional(),
    style: StyleSchema.optional(),
    letterAnimation: LetterAnimationConfigSchema.optional(),
  })
  .merge(BaseLayer)

export const CaptionLayer = z
  .object({
    type: z.literal("caption"),
    boxStyle: StyleSchema.optional(),
    textStyle: StyleSchema.optional(),
    multiColors: z.array(z.string()).optional(),
    combineTokensWithinMilliseconds: z.number().optional(),
    words: z.array(
      z.object({
        word: z.string(),
        start: z.number(),
        end: z.number(),
      }),
    ),
    activeWord: z
      .object({
        style: StyleSchema.optional(),
        background: z
          .object({
            style: StyleSchema.optional(),
            padding: z
              .union([
                z.number(),
                z.object({
                  x: z.number().optional(),
                  y: z.number().optional(),
                }),
              ])
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .merge(BaseLayer)

export const ImageLayer = z
  .object({
    type: z.literal("image"),
    url: z.string(),
    objectFit: z
      .enum(["cover", "contain", "fill", "none", "scale-down"])
      .optional(),
    style: StyleSchema.optional(),
  })
  .merge(BaseLayer)

export const AudioLayer = z
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
  .merge(BaseLayer)

export const CameraLayer = z
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
  .merge(BaseLayer)

export const Layer = z.discriminatedUnion("type", [
  CameraLayer,
  ImageLayer,
  TitleLayer,
  AudioLayer,
  CaptionLayer,
])

export const Scene = z.object({
  id: z.string().uuid().optional(),
  type: z.literal("scene").optional(),
  duration: z.number(),
  layers: z.array(Layer),
})

export const Transition = z.object({
  id: z.string().uuid().optional(),
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

export const Segment = z.discriminatedUnion("type", [Scene, Transition])

export const Storyboard = z.object({
  tracks: z.array(Segment).optional(),
  overlay: Scene.optional(),
  fps: z.number().optional(),
})

export type AudioLayerType = z.infer<typeof AudioLayer>
export type TitleLayerType = z.infer<typeof TitleLayer>
export type CaptionLayerType = z.infer<typeof CaptionLayer>
export type ImageLayerType = z.infer<typeof ImageLayer>
export type CameraLayerType = z.infer<typeof CameraLayer>
export type LayerType = z.infer<typeof Layer>
export type SceneType = z.infer<typeof Scene>
export type TransitionType = z.infer<typeof Transition>
export type SegmentType = z.infer<typeof Segment>
export type StoryboardType = z.infer<typeof Storyboard>
