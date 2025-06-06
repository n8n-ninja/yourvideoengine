import { WordSchema } from "../../schemas/word"
import { z } from "zod"

export const CompositionName = "VideoBackgroundComment"

export const Schema = z.object({
  hook: z.string(),
  backgroundUrl: z.string(),
  overlayUrl: z.string(),
  duration: z.number(),
  captions: z.array(WordSchema),
  color: z.string(),
  position: z.enum(["left", "right", "center"]).default("right"),
  size: z.enum(["small", "medium", "large"]).default("medium"),
})

const sampleCaptions = [
  {
    word: "those",
    start: 0.16,
    end: 0.64,
    confidence: 0.9817223,
  },
  {
    word: "people",
    start: 0.64,
    end: 1.12,
    confidence: 0.86048317,
  },
  {
    word: "they",
    start: 1.12,
    end: 1.28,
    confidence: 0.9975599,
  },
  {
    word: "are",
    start: 1.28,
    end: 1.4399999,
    confidence: 0.5323789,
  },
  {
    word: "so",
    start: 1.4399999,
    end: 1.5999999,
    confidence: 0.98462695,
  },
  {
    word: "hilarious",
    start: 1.5999999,
    end: 2.24,
    confidence: 0.8230935,
  },
  {
    word: "i",
    start: 2.24,
    end: 2.32,
    confidence: 0.99965537,
  },
  {
    word: "just",
    start: 2.32,
    end: 2.48,
    confidence: 0.9954,
  },
  {
    word: "can't",
    start: 2.48,
    end: 2.72,
    confidence: 0.9984536,
  },
  {
    word: "stop",
    start: 2.72,
    end: 2.96,
    confidence: 0.99904937,
  },
  {
    word: "laughing",
    start: 2.96,
    end: 3.28,
    confidence: 0.9997142,
  },
  {
    word: "when",
    start: 3.28,
    end: 3.52,
    confidence: 0.9983791,
  },
  {
    word: "i",
    start: 3.52,
    end: 3.6,
    confidence: 0.9930443,
  },
  {
    word: "look",
    start: 3.6,
    end: 3.76,
    confidence: 0.99667335,
  },
  {
    word: "at",
    start: 3.76,
    end: 3.84,
    confidence: 0.9984792,
  },
  {
    word: "them",
    start: 3.84,
    end: 4.3199997,
    confidence: 0.8950557,
  },
  {
    word: "and",
    start: 4.3199997,
    end: 4.56,
    confidence: 0.9982957,
  },
  {
    word: "guess",
    start: 4.56,
    end: 4.88,
    confidence: 0.98839825,
  },
  {
    word: "why",
    start: 4.88,
    end: 5.52,
    confidence: 0.8608279,
  },
  {
    word: "their",
    start: 5.68,
    end: 6,
    confidence: 0.8821414,
  },
  {
    word: "shoes",
    start: 6,
    end: 6.8,
    confidence: 0.7572926,
  },
  {
    word: "they",
    start: 6.96,
    end: 7.2,
    confidence: 0.9986212,
  },
  {
    word: "were",
    start: 7.2,
    end: 7.3599997,
    confidence: 0.9952443,
  },
  {
    word: "crocs",
    start: 7.3599997,
    end: 7.8399997,
    confidence: 0.88075846,
  },
]

export const defaultProps: z.infer<typeof Schema> = {
  hook: "This guy is a genuis!",
  backgroundUrl:
    "https://fynsadrjafvxmynpmexz.supabase.co/storage/v1/object/public/yourvideoengines-upload/thais-id/1749056669793-WhatsApp_Video_2025-05-29_at_20.47.28.mp4",
  overlayUrl:
    "https://diwa7aolcke5u.cloudfront.net/jobs/b2ddc2dc-44a5-4790-aff9-33c7b06b0b5f.webm",
  duration: 9.057,
  captions: sampleCaptions,
  color: "#F92F63",
  position: "right",
  size: "large",
}
