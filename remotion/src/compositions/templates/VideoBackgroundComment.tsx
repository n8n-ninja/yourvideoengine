import { z } from "zod"
import { Composition } from "remotion"
import { AbsoluteFill } from "remotion"
import { defaultProps } from "./VideoBackgroundComment.props"
import { Schema, CompositionName } from "./VideoBackgroundComment.props"
import { Camera } from "@/components/Camera"
import { Title } from "@/components/Title"
import { Caption } from "@/components/Caption"

const FPS = 30

const getOverlayCamera = (props: z.infer<typeof Schema>) => {
  const position = props.position || "right"
  const size = props.size || "medium"

  const scale = size === "small" ? 50 : size === "medium" ? 40 : 30

  const positions = {
    center: {
      top: scale,
      left: scale / 2,
      bottom: 0,
      right: scale / 2,
    },
    left: {
      top: scale,
      left: 0,
      bottom: 0,
      right: scale,
    },
    right: {
      top: scale,
      left: scale,
      bottom: 0,
      right: 0,
    },
  }

  return (
    <>
      <Camera url={props.overlayUrl} position={positions[position]} />
      <Camera
        url={props.overlayUrl}
        position={positions[position]}
        volume={0}
      />
      <Camera
        url={props.overlayUrl}
        position={positions[position]}
        volume={0}
      />
    </>
  )
}

export const Component = (props: z.infer<typeof Schema>) => {
  return (
    <AbsoluteFill style={{ background: props.color }}>
      <Camera url={props.backgroundUrl} volume={0} />
      {getOverlayCamera(props)}
      <Title
        title={props.hook}
        boxStyle={{
          fontFamily: "Raleway",
          fontSize: 100,
          letterSpacing: "0.05em",
          color: props.color,
          textShadow: "none",
          lineHeight: "1.2",
        }}
        timing={{
          start: 0,
          duration: 2.5,
        }}
        reveal={{
          outDuration: 0.3,
          outType: "slide-down",
        }}
        textStyle={{
          backgroundColor: "white",
          display: "inline",
          lineHeight: "1.5",
          borderRadius: "0.25em",
          padding: "0.2em 0.5em",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          textShadow: "0 0 10px rgba(100, 10, 10, 0.5)",
          borderBottom: `8px solid ${props.color}`,
        }}
        position={{
          bottom: 70,
        }}
      />
      <Caption
        words={props.captions}
        boxStyle={{
          background: "transparent",
        }}
        textStyle={{
          fontFamily: "Raleway",
          fontSize: 70,
          fontWeight: 600,
        }}
        position={{
          top: 40,
          bottom: 50,
        }}
        activeWord={{
          style: {
            color: "#fff",
          },
          background: {
            style: {
              background: props.color,
              borderRadius: "1.25em",
            },
            padding: {
              x: 20,
              y: 5,
            },
          },
        }}
      />
    </AbsoluteFill>
  )
}

export const calculateMetadata = ({
  props,
}: {
  props: z.infer<typeof Schema>
}) => {
  return {
    durationInFrames: Math.round(props.duration * FPS),
  }
}

export const TemplateVideoBackgroundComment = () => {
  return (
    <Composition
      id={CompositionName}
      component={Component}
      schema={Schema}
      fps={FPS}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        ...defaultProps,
      }}
    />
  )
}
