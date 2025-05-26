import { z } from "zod"
import { TimingSchema } from "./timing"
import { PositionSchema } from "./position"
import { RevealSchema } from "./reveal"
import { StyleSchema } from "./style"
import { themeNames } from "@/styles/title-themes"
import { EffectsSchema } from "./effect"
import { LetterAnimationConfigSchema } from "@/components/LetterAnimation"
import { AnimatedEmoji } from "@remotion/animated-emoji"

const BaseBlock = z.object({
  id: z.string().uuid().optional(),
  timing: TimingSchema.optional(),
  position: PositionSchema.optional(),
  reveal: RevealSchema.optional(),
  containerStyle: StyleSchema.optional(),
  effects: EffectsSchema.optional(),
})

export const TitleBlock = z
  .object({
    type: z.literal("title"),
    title: z.string(),
    theme: z.enum(themeNames).optional(),
    style: StyleSchema.optional(),
    letterAnimation: LetterAnimationConfigSchema.optional(),
  })
  .merge(BaseBlock)

export const Word = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
})

export const CaptionBlock = z
  .object({
    type: z.literal("caption"),
    boxStyle: StyleSchema.optional(),
    textStyle: StyleSchema.optional(),
    multiColors: z.array(z.string()).optional(),
    combineTokensWithinMilliseconds: z.number().optional(),
    words: z.array(Word),
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
    dynamicFontSize: z
      .object({
        min: z.number(),
        moy: z.number(),
        max: z.number(),
      })
      .optional(),
  })
  .merge(BaseBlock)

export const ImageBlock = z
  .object({
    type: z.literal("image"),
    url: z.string(),
    objectFit: z
      .enum(["cover", "contain", "fill", "none", "scale-down"])
      .optional(),
    style: StyleSchema.optional(),
  })
  .merge(BaseBlock)

export const AudioBlock = z
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
  .merge(BaseBlock)

export const CameraBlock = z
  .object({
    type: z.literal("camera"),
    url: z.string(),
    duration: z.number(),
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
  .merge(BaseBlock)

export const EmojiBlock = z
  .object({
    type: z.literal("emoji"),
    emoji: z.string(),
  })
  .merge(BaseBlock)

export const Block = z.discriminatedUnion("type", [
  CameraBlock,
  ImageBlock,
  TitleBlock,
  AudioBlock,
  CaptionBlock,
  EmojiBlock,
])

export const Scene = z.object({
  id: z.string().uuid().optional(),
  type: z.literal("scene"),
  duration: z.number().optional(),
  blocks: z.array(Block),
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

export const TrackItem = z.discriminatedUnion("type", [Scene, Transition])

export const Track = z.object({
  id: z.string().uuid().optional(),
  duration: z.number().default(0).optional(),
  items: z.array(TrackItem),
})

export const Background = z.object({
  backgroundColor: z.union([z.string(), z.array(z.string())]).optional(),
  backgroundGradient: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundVideo: z.string().optional(),
  animationSpeed: z.number().optional(),
  animationType: z.enum(["crossfade", "hard"]).optional(),
})

export type TrackType = z.infer<typeof Track>
export type TrackItemType = z.infer<typeof TrackItem>
export type SceneType = z.infer<typeof Scene>
export type TransitionType = z.infer<typeof Transition>
export type BlockType = z.infer<typeof Block>
export type AudioBlockType = z.infer<typeof AudioBlock>
export type TitleBlockType = z.infer<typeof TitleBlock>
export type CaptionBlockType = z.infer<typeof CaptionBlock>
export type ImageBlockType = z.infer<typeof ImageBlock>
export type CameraBlockType = z.infer<typeof CameraBlock>
export type EmojiBlockType = Omit<z.infer<typeof EmojiBlock>, "emoji"> & {
  emoji: React.ComponentProps<typeof AnimatedEmoji>["emoji"]
}
export type BackgroundType = z.infer<typeof Background>

export type { RevealType } from "./reveal"
export type TransitionReveal = z.infer<typeof RevealSchema>
export type ProgressEasing = {
  inDuration?: number
  outDuration?: number
  inEasing?: string
  outEasing?: string
  duration?: number
  easing?: string
}

export type { Keyframe } from "./keyframe"

export type { Timing } from "./timing"
