import { Composition } from "remotion"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard } from "@/schemas/project"

const MUSIC_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1748099564616-mbgrk0.mp3"
const CAMERA_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/4e629c9b-f4f9-4628-9cc5-d561d477dbdd.mp4"

export const DemoOverlayOnly = ({
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
      id="DemoOverlayOnly"
      component={ProjectComposition}
      durationInFrames={300}
      fps={fps}
      width={width}
      height={height}
      schema={Storyboard}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        overlay: {
          duration: 12,
          layers: [
            {
              type: "camera",
              url: CAMERA_URL,
            },
            {
              type: "title",
              title: "Overlay Only",
              timing: { start: 0, duration: 3 },
            },
            {
              type: "title",
              title: "With no scenes",
              timing: { start: 4, duration: 3 },
            },
            {
              type: "audio",
              sound: MUSIC_URL,
              timing: { start: 3 },
              volume: 0.2,
            },
          ],
        },
      }}
    />
  )
}
