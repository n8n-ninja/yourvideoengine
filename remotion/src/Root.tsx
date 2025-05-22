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

  const scenes = inputProps.scenes
  const globalTimeline = inputProps.globalTimeline ?? []

  const totalFrames = 1

  const theme = {}

  const testScenes = {
    fps: 30,
    width: 1080,
    height: 1920,
    background: "#1A1728",
    scenes: [
      {
        duration: 0.2,
        timeline: [
          {
            type: "camera",
            timing: {
              start: 0,
              end: 100,
            },
            videoUrl:
              "https://files2.heygen.ai/aws_pacific/avatar_tmp/c330096d4fe2412196a174937603458f/afb22e4fc5ae4adcac619e1b1388d427.mp4?Expires=1748526298&Signature=eRch2WSnhw0iAGOtDZL2zo35TV7XK-oAGfa8FZSEx8Y8GPWsztNJSBlMKre~Zi9nNfhErUUSuWMzFB5iefuF5RbcQ0Luw9Y6OSo5Rk75NsCcS11sLwnsMmZVJOhB-~GsETrEK4E--PUrdtTmjicVGm~T2PC70WZ67PquJy7xe6I9W4GThYpvijTdQagS5Wfm1aX9nXjMVbdFMjSen3TPjT0IxvBhFceAUa65NlJsegF8~vX1IgCNcWBX-9TR12zmnoLGOe-0LXQWnYPIMjeUXT3HSPAjMPtDpnySUyhWNvFfrS3ZNYmUWdHOApSrjlc9smxTl8VzOH1AsHo4m6bEUw__&Key-Pair-Id=K38HBHX5LX3X2H",
          },
        ],
      },
    ],
  }
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
        defaultProps={testScenes}
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
