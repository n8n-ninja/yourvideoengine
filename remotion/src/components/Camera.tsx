import React from "react"
import { Video } from "remotion"
import { Camera } from "@/schemas"
import { useKeyframes } from "@/hooks/useKeyframes"
import { parseStyleString } from "@/utils/getStyle"
import { cameraContainerStyle, cameraVideoStyle } from "@/styles/default-style"

/**
 * Camera: renders a video with animated camera effects (scale, blur, rotation, filter, volume) using keyframes.
 * Supports offsetX, offsetY, style, frameStyle, speed, volume, and loop for fine positioning, custom styles, and playback options.
 *
 * @param videoUrl The video source URL.
 * @param animationKeyframes Optional array of keyframes for camera effects.
 * @param offsetX Optional X offset for fine positioning.
 * @param offsetY Optional Y offset for fine positioning.
 * @param style Optional style string for custom styles.
 * @param frameStyle Optional frame style string for custom styles.
 * @param speed Optional playback rate for the video.
 * @param volume Optional volume for the video.
 * @param loop Optional loop for the video.
 * @returns A Video element that fills its parent (object-fit: cover) and animates inside a fixed container.
 */
const CameraComponent: React.FC<Camera> = ({
  videoUrl,
  animationKeyframes,
  offsetX = 0,
  offsetY = 0,
  style,
  frameStyle,
  speed = 1,
  volume = 1,
  loop = false,
}) => {
  const userStyle = style ? parseStyleString(style) : {}
  const frameUserStyle = frameStyle ? parseStyleString(frameStyle) : {}

  const interpolated =
    useKeyframes<Record<string, number | string | undefined>>(
      animationKeyframes && animationKeyframes.length > 0
        ? animationKeyframes
        : [],
    ) || {}

  const {
    scale = 1,
    blur = 0,
    rotation = 0,
    filter = "",
    volume: kfVolume,
  } = interpolated
  const scaleNum = Number(scale)
  const blurNum = Number(blur)
  const scaleBlur = 1 + (isNaN(blurNum) ? 0 : blurNum / 80)
  const finalScale = (isNaN(scaleNum) ? 1 : scaleNum) * scaleBlur

  const hasKeyframes = !!animationKeyframes && animationKeyframes.length > 0

  const videoStyle = {
    ...cameraVideoStyle,
    transform: hasKeyframes
      ? `translate(${offsetX}px, ${offsetY}px) scale(${finalScale}) rotate(${rotation}deg)`
      : `translate(${offsetX}px, ${offsetY}px)`,
    filter: hasKeyframes ? `${filter} blur(${blur}px)` : undefined,
    ...userStyle,
  }

  const containerStyle = {
    ...cameraContainerStyle,
    ...frameUserStyle,
  }

  return (
    <div style={containerStyle}>
      <Video
        src={videoUrl}
        playbackRate={speed}
        volume={(_) => (typeof kfVolume === "number" ? kfVolume : volume)}
        loop={loop}
        style={videoStyle}
      />
    </div>
  )
}

export { CameraComponent as Camera }
