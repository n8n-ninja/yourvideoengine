import React from "react"
import "./fonts.css"
import { Composition, getInputProps } from "remotion"
import {
  ProjectComposition,
  Scene,
  TimelineElement,
} from "./compositions/ProjectComposition"
import { ProjectSchema } from "@/schemas/timeline"
import { calculateMetadata } from "./compositions/ProjectComposition"

import caption from "../batch/inputs/caption"
import effect from "../batch/inputs/effect"
import title from "../batch/inputs/title"
import camera from "../batch/inputs/camera"
import position from "../batch/inputs/position"
import image from "../batch/inputs/image"

export const RemotionRoot: React.FC = () => {
  const inputProps = getInputProps<{
    fps: number
    width: number
    height: number
    scenes: Scene[]
    globalTimeline?: TimelineElement[]
  }>()

  const fps = inputProps.fps || 30
  const width = inputProps.width || 1080
  const height = inputProps.height || 1920

  const scenes = inputProps.scenes ?? []
  const globalTimeline = inputProps.globalTimeline ?? []

  const totalFrames = 1

  const theme = {}

  return (
    <>
      <Composition
        id="Edit"
        component={ProjectComposition}
        durationInFrames={totalFrames}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          scenes,
          globalTimeline,
        }}
      />

      <Composition
        id="DemoSceneTest"
        component={ProjectComposition}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          background: "#1A1728",
          scenes: [
            {
              duration: 2.187,
              timeline: [
                {
                  type: "camera",
                  videoUrl:
                    "https://files2.heygen.ai/aws_pacific/avatar_tmp/c330096d4fe2412196a174937603458f/14559ba5dd6341599bbbdc24c1e51e6f.mp4?Expires=1748552412&Signature=FGKlJoXiiyOlHn2IiWB652qV9e~0gp5mcUVmrQlOFZUMG3M1Vu84ALVsYOR~DR6MgHAFmyZI4CPLLo2FmHPbmOcZQJeaYjdIKDyp~X5QgcnyBnPnq2FLjZSbLcK4p~4I5JEsgoe9WzAs418POWudriqooOgIRgtQo7DPq7HJIr5AOcv0FAtnf7kYtLDaMR6NitOrafiv6QzIW8DzukCTX4bEXXXRL1bJ-76LCwHVECLfwH6JROQ-pmZUdOy1vHCRPlYni4GTIeRvxiKA0xOPVWPhRjOY4nZM6-mk4wnfFL7LNffblgsC6-rV8jJmrZxCITvuwi0fnRISfPw3~WNxEQ__&Key-Pair-Id=K38HBHX5LX3X2H",
                },
                {
                  type: "caption",
                  words: [
                    {
                      word: "hello",
                      start: 0.24,
                      end: 0.64,
                      confidence: 0.6826452,
                    },
                    {
                      word: "salutu",
                      start: 0.64,
                      end: 1.12,
                      confidence: 0.60326016,
                    },
                    {
                      word: "fabienne",
                      start: 1.12,
                      end: 1.52,
                      confidence: 0.760355,
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />

      <Composition
        id="DemoCaption"
        component={ProjectComposition}
        durationInFrames={100}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          background: "#1A1728",
          scenes: caption.scenes,
          globalTimeline,
          theme,
        }}
      />

      <Composition
        id="DemoEffect"
        component={ProjectComposition}
        durationInFrames={100}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          background: "#1A1728",
          scenes: effect.scenes,
          globalTimeline,
          theme,
        }}
      />

      <Composition
        id="DemoTitle"
        component={ProjectComposition}
        durationInFrames={100}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          background: "#1A1728",
          scenes: title.scenes,
          globalTimeline,
          theme,
        }}
      />

      <Composition
        id="DemoCamera"
        component={ProjectComposition}
        durationInFrames={100}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          background: "#1A1728",
          scenes: camera.scenes,
          globalTimeline,
          theme,
        }}
      />

      <Composition
        id="DemoPosition"
        component={ProjectComposition}
        durationInFrames={100}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          background: "#1A1728",
          scenes: position.scenes,
          globalTimeline,
          theme,
        }}
      />

      <Composition
        id="DemoImage"
        component={ProjectComposition}
        durationInFrames={100}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          background: "#1A1728",
          scenes: image.scenes,
          globalTimeline,
          theme,
        }}
      />
    </>
  )
}
