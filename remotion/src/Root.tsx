import React from "react"
import "./styles/fonts.css"
import { Composition, Folder, getInputProps } from "remotion"
import {
  ProjectComposition,
  TimelineElement,
} from "./compositions/ProjectComposition"
import { ProjectSchema } from "@/schemas/timeline"
import { calculateMetadata } from "./compositions/ProjectComposition"
import { SceneOrTransition } from "@/schemas/timeline"
import transition from "../demo/transition"
import caption from "../demo/caption"
import effect from "../demo/effect"
import title from "../demo/title"
import camera from "../demo/camera"
import position from "../demo/position"
import image from "../demo/image"
import reveal from "../demo/reveal"
import shawheen from "../demo/shawheen"
import sound from "../demo/sound"

export const RemotionRoot: React.FC = () => {
  const inputProps = getInputProps<{
    fps: number
    width: number
    height: number
    scenes: SceneOrTransition[]
    globalTimeline?: TimelineElement[]
  }>()

  const fps = inputProps.fps || 30
  const width = inputProps.width || 1080
  const height = inputProps.height || 1920

  const scenes: SceneOrTransition[] = inputProps.scenes ?? []
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
        id="Playground"
        component={ProjectComposition}
        fps={fps}
        width={width}
        height={height}
        schema={ProjectSchema}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          background: "#1A1728",
          scenes: sound.scenes,
          globalTimeline: sound.globalTimeline,
        }}
      />

      <Folder name="Features">
        <Composition
          id="DemoSceneTransition"
          component={ProjectComposition}
          durationInFrames={100}
          fps={fps}
          width={width}
          height={height}
          schema={ProjectSchema}
          calculateMetadata={calculateMetadata}
          defaultProps={{
            background: "#1A1728",
            scenes: transition.scenes,
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

        <Composition
          id="DemoReveal"
          component={ProjectComposition}
          durationInFrames={100}
          fps={fps}
          width={width}
          height={height}
          schema={ProjectSchema}
          calculateMetadata={calculateMetadata}
          defaultProps={{
            background: "#1A1728",
            scenes: reveal.scenes,
            globalTimeline,
            theme,
          }}
        />
      </Folder>
    </>
  )
}
