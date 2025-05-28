import React from "react"
import { AnimatedEmoji } from "@remotion/animated-emoji"
import { Layout } from "@/components/Layout"
import { Effects } from "@/schemas/effect"
import { Reveal } from "@/schemas/reveal"
import { Timing } from "@/schemas/timing"
import { Position } from "@/schemas/position"
import { Style } from "@/schemas/style"

const CDN_URL = "https://diwa7aolcke5u.cloudfront.net/emojies"

type EmojiName = React.ComponentProps<typeof AnimatedEmoji>["emoji"]

export const Emoji: React.FC<{
  emoji: EmojiName
  timing?: Timing
  reveal?: Reveal
  position?: Position
  effects?: Effects
  layoutStyle?: Style
}> = ({ emoji, timing, reveal, position, effects, layoutStyle }) => (
  <Layout
    timing={timing}
    reveal={reveal}
    position={position}
    effects={effects}
    style={layoutStyle}
  >
    <AnimatedEmoji
      emoji={emoji}
      style={{
        width: "100%",
        height: "100%",
      }}
      calculateSrc={({ emoji, scale, format }) => {
        const ext = format === "hevc" ? "mp4" : "webm"
        return `${CDN_URL}/${emoji}-${scale}x.${ext}`
      }}
    />
  </Layout>
)
