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
import {
  CameraZoomComposition,
  CameraZoomSchema,
} from "@/compositions/CameraZoom/Composition"

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
        durationInFrames={duration}
        fps={30}
        width={1080}
        height={1920}
        schema={CaptionsSchema}
        defaultProps={{
          videoUrl:
            "https://files2.heygen.ai/aws_pacific/avatar_tmp/57ec360eba014be689b1992950c520f7/873be32229784da083ceac3b7eebefe0.mp4?Expires=1747395461&Signature=KBw-prseIuyekM~u~pN1vD3c~qJ2wDKe8ivG7bW3yolHza4AUh--MNHy3IuHpSEW12B5Ig4CWHnJlrnLhgWJJjHVV3d-uAfrkD3bzsslVx64AhpUtw2f2bAT-VXBaNN2hbQw7ZkZRflgiDTuuLT1PY~6hb1--g5ZMk4CfU0ENlYy4w~JvwagQfyYBc2Mdp0lhRp2NSrRzSoWZfEuUZSz825GWAQ51O6P09F8nRYn18rhBKktJ8Qx~LI1fuZkEmeMKHkBMiEMRlSyrQpfzqhCSZoqeImVUPT-0~YhR0U0jqklBJF5zaNWSGwDdpJW94NgSj-AgyyYVWmU~OQnIwzWXA__&Key-Pair-Id=K38HBHX5LX3X2H",
          combineTokensWithinMilliseconds: 1000,
          fontSize: 75,
          boxStyle: {
            height: "500px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            width: "70%",
            flexWrap: "wrap",
            borderRadius: "0",
            boxShadow: "32px 32px 2px 1px #2E257D",
          },

          words: [
            { word: "i", start: 0.16, end: 0.39999998, confidence: 0.9945892 },
            { word: "take", start: 0.39999998, end: 0.64, confidence: 0.99927 },
            { word: "zest", start: 0.64, end: 0.96, confidence: 0.6916837 },
            {
              word: "colostrum",
              start: 0.96,
              end: 1.4399999,
              confidence: 0.8575974,
            },
            {
              word: "gummies",
              start: 1.4399999,
              end: 1.76,
              confidence: 0.97747594,
            },
            { word: "because", start: 1.76, end: 2, confidence: 0.99583 },
            { word: "the", start: 2, end: 2.08, confidence: 0.9996182 },
            { word: "peach", start: 2.08, end: 2.32, confidence: 0.99922985 },
            {
              word: "flavor",
              start: 2.32,
              end: 2.6399999,
              confidence: 0.9978225,
            },
            {
              word: "actually",
              start: 2.6399999,
              end: 2.96,
              confidence: 0.9991147,
            },
            {
              word: "makes",
              start: 2.96,
              end: 3.1999998,
              confidence: 0.99987113,
            },
            { word: "me", start: 3.1999998, end: 3.36, confidence: 0.9997949 },
            { word: "wanna", start: 3.36, end: 3.6, confidence: 0.5927559 },
            { word: "take", start: 3.6, end: 3.84, confidence: 0.9983217 },
            { word: "them", start: 3.84, end: 4.32, confidence: 0.99440384 },
            { word: "two", start: 4.4, end: 4.64, confidence: 0.9886763 },
            { word: "a", start: 4.64, end: 4.7999997, confidence: 0.9971071 },
            { word: "day", start: 4.7999997, end: 4.88, confidence: 0.999574 },
            { word: "for", start: 4.88, end: 5.04, confidence: 0.9997718 },
            { word: "gut", start: 5.04, end: 5.2799997, confidence: 0.9992924 },
            {
              word: "repair",
              start: 5.2799997,
              end: 5.8399997,
              confidence: 0.99716365,
            },
            {
              word: "immunity",
              start: 5.8399997,
              end: 6.3999996,
              confidence: 0.98596424,
            },
            {
              word: "and",
              start: 6.3999996,
              end: 6.56,
              confidence: 0.99984396,
            },
            {
              word: "energy",
              start: 6.56,
              end: 7.2799997,
              confidence: 0.9621496,
            },
            {
              word: "it's",
              start: 7.2799997,
              end: 7.6,
              confidence: 0.99839437,
            },
            { word: "the", start: 7.6, end: 7.68, confidence: 0.9997588 },
            { word: "easiest", start: 7.68, end: 8, confidence: 0.9998888 },
            { word: "switch", start: 8, end: 8.32, confidence: 0.99953973 },
            {
              word: "i've",
              start: 8.32,
              end: 8.559999,
              confidence: 0.99952996,
            },
            { word: "made", start: 8.559999, end: 8.72, confidence: 0.995906 },
          ],
        }}
      />

      <Composition
        id="CameraZoom"
        component={CameraZoomComposition}
        durationInFrames={inputProps?.durationInFrames || 90}
        fps={30}
        width={1080}
        height={1920}
        schema={CameraZoomSchema}
        defaultProps={{
          videoUrl:
            "https://files2.heygen.ai/aws_pacific/avatar_tmp/57ec360eba014be689b1992950c520f7/873be32229784da083ceac3b7eebefe0.mp4?Expires=1747395461&Signature=KBw-prseIuyekM~u~pN1vD3c~qJ2wDKe8ivG7bW3yolHza4AUh--MNHy3IuHpSEW12B5Ig4CWHnJlrnLhgWJJjHVV3d-uAfrkD3bzsslVx64AhpUtw2f2bAT-VXBaNN2hbQw7ZkZRflgiDTuuLT1PY~6hb1--g5ZMk4CfU0ENlYy4w~JvwagQfyYBc2Mdp0lhRp2NSrRzSoWZfEuUZSz825GWAQ51O6P09F8nRYn18rhBKktJ8Qx~LI1fuZkEmeMKHkBMiEMRlSyrQpfzqhCSZoqeImVUPT-0~YhR0U0jqklBJF5zaNWSGwDdpJW94NgSj-AgyyYVWmU~OQnIwzWXA__&Key-Pair-Id=K38HBHX5LX3X2H",

          keyframes: [
            {
              time: 0,
              filter: "brightness(1) sepia(0)",
            },
            { time: 1, filter: "brightness(1.3) sepia(0.5) contrast(2)" },
          ],
        }}
      />
    </>
  )
}
