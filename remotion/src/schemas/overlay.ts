import { z } from "zod"
import { TimingSchema } from "./timing"
import { RevealSchema } from "./reveal"

export const ScanlineOverlaySchema = z.object({
  type: z.literal("scanline"),
  timing: TimingSchema,
  reveal: RevealSchema,
  opacity: z.number().optional(),
  intensity: z.number(),
  color: z.string().optional(),
  speed: z.number().optional(),
  frame: z.number().optional(),
})

export const VignetteOverlaySchema = z.object({
  type: z.literal("vignette"),
  timing: TimingSchema,
  reveal: RevealSchema,
  opacity: z.number().optional(),
  intensity: z.number().optional(),
  size: z.number().optional(),
  color: z.string().optional(),
})

export const ColorOverlaySchema = z.object({
  type: z.literal("color"),
  timing: TimingSchema,
  reveal: RevealSchema,
  opacity: z.number().optional(),
  color: z.string().optional(),
  intensity: z.number().optional(),
})

export const OverlaySchema = z.discriminatedUnion("type", [
  ScanlineOverlaySchema,
  VignetteOverlaySchema,
  ColorOverlaySchema,
])

export type Overlay = z.infer<typeof OverlaySchema>
