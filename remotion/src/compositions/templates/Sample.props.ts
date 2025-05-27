import { z } from "zod"

export const CompositionName = "Sample"

export const Schema = z.object({
  title: z.string(),
  url: z.string(),
})

export const defaultProps = {
  title: "Sample text",
  url: "https://diwa7aolcke5u.cloudfront.net/uploads/0d9256b1c3494d71adc592ffebf7ba85.mp4",
}
