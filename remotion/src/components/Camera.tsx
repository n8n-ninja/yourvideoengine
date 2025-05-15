import React from "react"
import { AbsoluteFill, Video, useCurrentFrame } from "remotion"
import { Camera } from "@/schemas"
import { useKeyframes } from "@/hooks/useKeyframes"
import { Keyframe } from "@/schemas"

/**
 * Camera: renders a video with animated camera effects (scale, blur, rotation, filter, position) using keyframes.
 *
 * @param videoUrl The video source URL.
 * @param animationKeyframes Optional array of keyframes for camera effects.
 * @returns An AbsoluteFill with a styled Video element.
 */
const CameraComponent: React.FC<Camera> = ({
  videoUrl,
  animationKeyframes,
}) => {
  useCurrentFrame()

  const safeKeyframes: Keyframe<Record<string, number | string | undefined>>[] =
    animationKeyframes && animationKeyframes.length > 0
      ? animationKeyframes
      : [
          {
            time: 0,
            value: { scale: 1 },
          },
        ]

  // Interpolated keyframe for the current frame
  const interpolated =
    useKeyframes<Record<string, number | string | undefined>>(safeKeyframes) ||
    {}

  const {
    scale = 1,
    blur = 0,
    rotation = 0,
    filter = "",
    top = 0,
    left = 0,
  } = interpolated

  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: `scale(${scale}) rotate(${rotation}deg) translate(${left}px, ${top}px)`,
    filter: `${filter} blur(${blur}px)`,
    transformOrigin: "50% 50%",
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video src={videoUrl} style={videoStyle} />
    </AbsoluteFill>
  )
}

export { CameraComponent as Camera }
