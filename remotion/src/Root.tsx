import { Composition } from "remotion"
import { getInputProps } from "remotion"

import {
  BlacksmithComposition,
  BlacksmithSchema,
} from "@/_compositions/BlacksmithShorts/Composition"
import {
  DemoShortsComposition,
  DemoShortsSchema,
} from "@/_compositions/DemoShorts/Composition"

type InputProps = {
  durationInFrames?: number
  // tu peux ajouter ici les autres props si besoin
}

const inputProps = getInputProps<InputProps>()
const duration = inputProps?.durationInFrames ?? 1350

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Demo"
        component={DemoShortsComposition}
        durationInFrames={duration}
        fps={30}
        width={1080}
        height={1920}
        schema={DemoShortsSchema}
        defaultProps={{
          text: "Receive a summary of your emails in Notion",
        }}
      />
      <Composition
        id="BlacksmithShort"
        component={BlacksmithComposition}
        durationInFrames={duration}
        fps={30}
        width={1080}
        height={1920}
        schema={BlacksmithSchema}
        defaultProps={{
          number: 1,
          problem: "You write product descriptions one by one?",
          solution_1: "Let AI generate high-converting text",
          solution_2: "based on your product features.",
          hero_image:
            "https://img.theapi.app/temp/30dda8f7-54b9-4f76-89ff-2d26113878d2.png",
          steps: [
            {
              logo: "https://themovemento.s3.eu-west-1.amazonaws.com/logos-services/shopify.png",
              note: "A new product is created",
              node: "Shopify",
            },
            {
              logo: "https://themovemento.s3.eu-west-1.amazonaws.com/logos-services/perplexity.png",
              note: "Fetch similar product references",
              node: "Perplexity",
            },
            {
              logo: "https://themovemento.s3.eu-west-1.amazonaws.com/logos-services/openai.png",
              note: "Write a catchy description",
              node: "OpenAI",
            },
            {
              logo: "https://themovemento.s3.eu-west-1.amazonaws.com/logos-services/shopify.png",
              note: "Update the product with the new text",
              node: "Shopify",
            },
          ],
        }}
      />
    </>
  )
}
