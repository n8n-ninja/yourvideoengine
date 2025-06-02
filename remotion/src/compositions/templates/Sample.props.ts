import { WordSchema } from "../../schemas/word"
import { z } from "zod"

export const CompositionName = "Sample"

export const Schema = z.object({
  title: z.string(),
  intro: z.string(),
  introDuration: z.number(),
  introCaption: z.array(WordSchema),
  body: z.string(),
  bodyDuration: z.number(),
  bodyCaption: z.array(WordSchema),
  outro: z.string(),
  outroDuration: z.number(),
  outroCaption: z.array(WordSchema),
  music: z.string(),
  emoji: z.string(),
})

const sampleCaptions = [
  {
    word: "the",
    start: 0.16,
    end: 0.48,
    confidence: 0.9627397,
  },
  {
    word: "most",
    start: 0.48,
    end: 0.71999997,
    confidence: 0.9995771,
  },
  {
    word: "powerful",
    start: 0.71999997,
    end: 1.04,
    confidence: 0.99909914,
  },
  {
    word: "solution",
    start: 1.04,
    end: 1.4399999,
    confidence: 0.9988889,
  },
  {
    word: "to",
    start: 1.4399999,
    end: 1.68,
    confidence: 0.9996848,
  },
  {
    word: "automate",
    start: 1.68,
    end: 2,
    confidence: 0.9996444,
  },
  {
    word: "your",
    start: 2,
    end: 2.24,
    confidence: 0.99906975,
  },
  {
    word: "video",
    start: 2.24,
    end: 2.56,
    confidence: 0.9994635,
  },
  {
    word: "production",
    start: 2.56,
    end: 2.96,
    confidence: 0.9990239,
  },
  {
    word: "using",
    start: 2.96,
    end: 3.28,
    confidence: 0.99762136,
  },
  {
    word: "the",
    start: 3.28,
    end: 3.4399998,
    confidence: 0.9985489,
  },
  {
    word: "latest",
    start: 3.4399998,
    end: 3.76,
    confidence: 0.9998343,
  },
  {
    word: "ai",
    start: 3.76,
    end: 4.16,
    confidence: 0.9933907,
  },
  {
    word: "technology",
    start: 4.16,
    end: 4.64,
    confidence: 0.9472135,
  },
]

export const defaultProps = {
  title: "Sample text",
  intro:
    "https://diwa7aolcke5u.cloudfront.net/uploads/0d9256b1c3494d71adc592ffebf7ba85.mp4",
  introDuration: 5.36,
  introCaption: sampleCaptions,
  body: "https://diwa7aolcke5u.cloudfront.net/uploads/9720d87ed3ef47418eaff1bb8b3af4eb.mp4",
  bodyDuration: 2.8,
  bodyCaption: sampleCaptions,
  outro:
    "https://diwa7aolcke5u.cloudfront.net/uploads/ddcc9b95cc87473fa66f9501a44f1907.mp4",
  outroDuration: 3,
  outroCaption: sampleCaptions,
  music:
    "https://diwa7aolcke5u.cloudfront.net/uploads/1748099564616-mbgrk0.mp3",
  emoji: "100",
}
