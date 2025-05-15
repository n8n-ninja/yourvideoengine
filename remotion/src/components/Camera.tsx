import React from "react"
import { AbsoluteFill, Video, useCurrentFrame } from "remotion"
import { z } from "zod"
import { useKeyframes, Keyframe } from "@/Utils/useKeyframes"

/**
 * CameraSchema: zod schema for camera props validation.
 */
export const CameraSchema = z.object({
  videoUrl: z.string(),
  animationKeyframes: z
    .array(
      z.object({
        time: z.number(),
        value: z.object({
          scale: z.number().optional(),
          blur: z.number().optional(),
          rotation: z.number().optional(),
          filter: z.string().optional(),
          top: z.number().optional(),
          left: z.number().optional(),
        }),
      }),
    )
    .optional(),
})

type CameraProps = z.infer<typeof CameraSchema>

type CameraValue = {
  scale?: number
  blur?: number
  rotation?: number
  filter?: string
  top?: number
  left?: number
}

/**
 * Camera component: interpolates keyframes for camera movement and effects.
 */
export const Camera: React.FC<CameraProps> = ({
  videoUrl,
  animationKeyframes,
}) => {
  useCurrentFrame()

  const safeKeyframes: Keyframe<CameraValue>[] =
    animationKeyframes && animationKeyframes.length > 0
      ? animationKeyframes
      : [
          {
            time: 0,
            value: { scale: 1 },
          },
        ]

  // Interpolated keyframe for the current frame
  const interpolated = useKeyframes<CameraValue>(safeKeyframes) || {}

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
