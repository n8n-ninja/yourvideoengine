import { Composition } from "remotion"
import { getInputProps } from "remotion"

import {
  BlacksmithComposition,
  BlacksmithSchema,
} from "@/compositions/BlacksmithShorts/Composition"
import {
  DemoShortsComposition,
  DemoShortsSchema,
} from "@/compositions/DemoShorts/Composition"
import {
  CaptionsComposition,
  CaptionsSchema,
} from "@/compositions/Captions/Composition"

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
      <Composition
        id="Captions"
        component={CaptionsComposition}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={CaptionsSchema}
        defaultProps={{
          videoUrl:
            "https://files2.heygen.ai/aws_pacific/avatar_tmp/57ec360eba014be689b1992950c520f7/873be32229784da083ceac3b7eebefe0.mp4?Expires=1747395461&Signature=KBw-prseIuyekM~u~pN1vD3c~qJ2wDKe8ivG7bW3yolHza4AUh--MNHy3IuHpSEW12B5Ig4CWHnJlrnLhgWJJjHVV3d-uAfrkD3bzsslVx64AhpUtw2f2bAT-VXBaNN2hbQw7ZkZRflgiDTuuLT1PY~6hb1--g5ZMk4CfU0ENlYy4w~JvwagQfyYBc2Mdp0lhRp2NSrRzSoWZfEuUZSz825GWAQ51O6P09F8nRYn18rhBKktJ8Qx~LI1fuZkEmeMKHkBMiEMRlSyrQpfzqhCSZoqeImVUPT-0~YhR0U0jqklBJF5zaNWSGwDdpJW94NgSj-AgyyYVWmU~OQnIwzWXA__&Key-Pair-Id=K38HBHX5LX3X2H",
          srt: `1\n00:00:00,000 --> 00:00:04,000\nI take Zest Colostrum gummies because the peach flavor actually makes me want to take them.\n\n2\n00:00:04,000 --> 00:00:07,000\nTwo a day for gut repair, immunity, and energy.\n\n3\n00:00:07,000 --> 00:00:09,000\nIt's the easiest switch I've made.`,
          style: {
            // color: "#fff",
            // backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
      />
    </>
  )
}
