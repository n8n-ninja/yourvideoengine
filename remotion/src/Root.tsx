import React from "react"
import { Composition, Folder, getInputProps } from "remotion"
import { Storyboard, LayerType, SegmentType } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { DemoCamera } from "@/demo/demo-camera"
import { DemoCaption } from "@/demo/demo-caption"

import "./styles/fonts.css"
import { DemoEffect } from "./demo/demo-effect"
import { DemoImage } from "./demo/demo-image"
import { DemoPosition } from "./demo/demo-position"
import { DemoReveal } from "./demo/demo-reveal"
import { DemoSound } from "./demo/demo-sound"
import { DemoTitle } from "./demo/demo-title"
import { DemoTransition } from "./demo/demo-tansition"
import { DemoOverlayOnly } from "./demo/demo-overlay-only"
import { DemoEmoji } from "./demo/demo-emoji"
import { ClientDemoShawheen } from "./demo/client-demo-shawheen"

export const RemotionRoot: React.FC = () => {
  const inputProps = getInputProps<{
    fps: number
    width: number
    height: number
    tracks: SegmentType[]
    overlay?: LayerType[]
  }>()

  const fps = inputProps.fps || 30
  const width = inputProps.width || 1080
  const height = inputProps.height || 1920

  return (
    <>
      <Composition
        id="Edit"
        component={ProjectComposition}
        fps={fps}
        width={width}
        height={height}
        schema={Storyboard}
        calculateMetadata={calculateMetadata}
      />

      <Folder name="ClientDemo">
        <ClientDemoShawheen />
      </Folder>

      <Folder name="TechnicalDemo">
        <DemoOverlayOnly />
        <DemoCamera />
        <DemoCaption />
        <DemoEffect />
        <DemoImage />
        <DemoPosition />
        <DemoReveal />
        <DemoSound />
        <DemoTitle />
        <DemoTransition />
        <DemoEmoji />
      </Folder>
    </>
  )
}
