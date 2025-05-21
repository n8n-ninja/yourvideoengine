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

  const scenes = inputProps.scenes
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
        defaultProps={{
          background: "#1A1728",
          scenes,
          globalTimeline,
          theme,
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
    </>
  )
}
