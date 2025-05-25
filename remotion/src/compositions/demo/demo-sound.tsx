import { Composition } from "remotion"
import { SceneType } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard } from "@/schemas/project"

const scenes: SceneType[] = [
  {
    duration: 39.057,
    layers: [
      {
        type: "audio",
        sound: "https://files.catbox.moe/mbgrk0.mp3",
        timing: { start: 3 },
        volume: 1,
        reveal: {
          type: "fade",
          duration: 10,
        },
      },
      {
        type: "camera",
        url: "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demohook.mp4",
      },
    ],
  },
]

export const DemoSound = ({
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
      id="DemoSound"
      component={ProjectComposition}
      durationInFrames={Math.ceil(scenes[0].duration * fps)}
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
