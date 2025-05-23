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

const demoScenes: SceneOrTransition[] = [
  {
    duration: 2.187,
    timeline: [
      {
        type: "camera",
        videoUrl:
          "https://files2.heygen.ai/aws_pacific/avatar_tmp/c330096d4fe2412196a174937603458f/14559ba5dd6341599bbbdc24c1e51e6f.mp4?Expires=1748552412&Signature=FGKlJoXiiyOlHn2IiWB652qV9e~0gp5mcUVmrQlOFZUMG3M1Vu84ALVsYOR~DR6MgHAFmyZI4CPLLo2FmHPbmOcZQJeaYjdIKDyp~X5QgcnyBnPnq2FLjZSbLcK4p~4I5JEsgoe9WzAs418POWudriqooOgIRgtQo7DPq7HJIr5AOcv0FAtnf7kYtLDaMR6NitOrafiv6QzIW8DzukCTX4bEXXXRL1bJ-76LCwHVECLfwH6JROQ-pmZUdOy1vHCRPlYni4GTIeRvxiKA0xOPVWPhRjOY4nZM6-mk4wnfFL7LNffblgsC6-rV8jJmrZxCITvuwi0fnRISfPw3~WNxEQ__&Key-Pair-Id=K38HBHX5LX3X2H",
      },
    ],
  },
  {
    type: "transition",
    animation: "wipe",
    duration: 1,
    direction: "from-left",
    sound: "woosh-1.mp3",
  },
  {
    duration: 2.187,
    timeline: [
      {
        type: "camera",
        videoUrl:
          "https://files2.heygen.ai/aws_pacific/avatar_tmp/c330096d4fe2412196a174937603458f/71113fefbd604550a0f855e8f0299b91.mp4?Expires=1748556612&Signature=f-cJEVfGet9lfmho7raGsn1W3SwZlEF02k-JjqIZz0tvJQKvQKNDcmyRbpy~8pGW~CuP2MSF7yg7E7s~vTENPQC1kHCu~KDMX6l3V6QvcbX7L3JqAXaE7Um8FxspcFW3sO-SpGsJI4gKFvRIMjsGeqmXOxaB58G1REAa71ksA2nIo3t7KjFcNiGUk4sms0U~V~23FH6aKJI7mN9gEURwZCZyd7dumtdYikCRzRRSjJ61~wwt15E8K6caRvSQNauDzAegY8rp9CfMsYGbmFtAoX8EeFFoAw41V~NyfS9tpCZoroUeFhIeoKebIeHfq3OQG4XnrDluffwHSOHo6Ax6Ag__&Key-Pair-Id=K38HBHX5LX3X2H",
      },
    ],
  },
]

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
          scenes: demoScenes,
          globalTimeline,
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
      </Folder>
    </>
  )
}
