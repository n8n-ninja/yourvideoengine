import React from "react"
import { Folder } from "remotion"
import { DemoCamera } from "@/compositions/demo/demo-camera"
import { DemoCaption } from "@/compositions/demo/demo-caption"
import { DemoEffect } from "@/compositions/demo/demo-effect"
import { DemoImage } from "@/compositions/demo/demo-image"
import { DemoPosition } from "@/compositions/demo/demo-position"
import { DemoReveal } from "@/compositions/demo/demo-reveal"
import { DemoSound } from "@/compositions/demo/demo-sound"
import { DemoTitle } from "@/compositions/demo/demo-title"
import { DemoTransition } from "@/compositions/demo/demo-tansition"
import { DemoOverlayOnly } from "@/compositions/demo/demo-overlay-only"
import { DemoEmoji } from "@/compositions/demo/demo-emoji"
import { DemoBackground } from "@/compositions/demo/demo-background"
import { ClientDemoShawheen } from "@/compositions/demo/client-demo-shawheen"
import { Template3shots } from "@/compositions/templates/3shots"
import "./styles/fonts.css"

export const RemotionRoot: React.FC = () => {
  // const inputProps = getInputProps<{
  //   fps: number
  //   width: number
  //   height: number
  // }>()

  // const fps = inputProps.fps || 30
  // const width = inputProps.width || 1080
  // const height = inputProps.height || 1920

  return (
    <>
      {/* <Composition
        id="Edit"
        component={ProjectComposition}
        fps={fps}
        width={width}
        height={height}
        schema={Storyboard}
        calculateMetadata={calculateMetadata}
      /> */}

      <Folder name="Projects">
        <Template3shots />
      </Folder>

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
        <Folder name="Background">
          <DemoBackground bgKey={0} />
          <DemoBackground bgKey={1} />
          <DemoBackground bgKey={2} />
          <DemoBackground bgKey={3} />
          <DemoBackground bgKey={4} />
          <DemoBackground bgKey={5} />
        </Folder>
      </Folder>
    </>
  )
}
