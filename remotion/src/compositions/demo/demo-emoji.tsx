import { Composition } from "remotion"
import { SceneType } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard } from "@/schemas/project"

const emojiNames = [
  "blush",
  "smile",
  "grin",
  "joy",
  "wink",
  "kissing-heart",
  "heart-eyes",
  "star-struck",
  "melting",
  "money-face",
  "kiss",
  "fire-heart",
]

const scenes: SceneType[] = emojiNames.map((emoji) => ({
  duration: 3,
  layers: [
    {
      type: "emoji",
      emoji,
      position: { horizontalAlign: "center", verticalAlign: "center" },
    },
    {
      type: "title",
      title: emoji,
      position: { verticalAlign: "end" },
    },
  ],
}))

export const DemoEmoji = ({
  fps = 30,
  width = 1080,
  height = 1920,
}: {
  fps?: number
  width?: number
  height?: number
}) => {
  return (
    <Composition
      id="DemoEmoji"
      component={ProjectComposition}
      durationInFrames={scenes.length * 30}
      fps={fps}
      width={width}
      height={height}
      schema={Storyboard}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        tracks: scenes,
      }}
    />
  )
}
