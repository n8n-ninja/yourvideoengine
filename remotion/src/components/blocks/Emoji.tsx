import { AnimatedEmoji } from "@remotion/animated-emoji"
import { EmojiBlockType } from "@/schemas/project"

const CDN_URL = "https://diwa7aolcke5u.cloudfront.net/emojies" // adapte à ton hébergement

// type EmojiName = React.ComponentProps<typeof AnimatedEmoji>["emoji"]

export const Emoji: React.FC<{ emoji: EmojiBlockType }> = ({ emoji }) => (
  <AnimatedEmoji
    emoji={emoji.emoji}
    calculateSrc={({ emoji, scale, format }) => {
      const ext = format === "hevc" ? "mp4" : "webm"
      return `${CDN_URL}/${emoji}-${scale}x.${ext}`
    }}
  />
)
