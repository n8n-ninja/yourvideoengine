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
 * @param keyFrames Optional array of keyframes for camera effects.
 * @param offsetX Optional X offset for fine positioning.
 * @param offsetY Optional Y offset for fine positioning.
 * @param style Optional style string for custom styles.
 * @param speed Optional playback rate for the video.
 * @param volume Optional volume for the video.
 * @param loop Optional loop for the video.
 * @returns A Video element that fills its parent (object-fit: cover) and animates inside a fixed container.
 */
const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)
}

const CameraComponent: React.FC<Camera> = ({
  videoUrl,
  keyFrames,
  offsetX = 0,
  offsetY = 0,
  style,
  speed = 1,
  volume = 1,
  loop = false,
}) => {
  const userStyle = style ? parseStyleString(style) : {}

  const interpolated =
    useKeyframes<Record<string, number | string | undefined>>(
      keyFrames && keyFrames.length > 0 ? keyFrames : [],
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

  const hasKeyframes = !!keyFrames && keyFrames.length > 0

  const videoStyle = {
    ...cameraVideoStyle,
    transform: hasKeyframes
      ? `translate(${offsetX}px, ${offsetY}px) scale(${finalScale}) rotate(${rotation}deg)`
      : `translate(${offsetX}px, ${offsetY}px)`,
    filter: hasKeyframes ? `${filter} blur(${blur}px)` : undefined,
    ...userStyle,
  }

  return (
    <div style={cameraContainerStyle}>
      {isImage(videoUrl) ? (
        <img
          src={videoUrl}
          alt="Camera content"
          style={videoStyle}
          draggable={false}
        />
      ) : (
        <Video
          src={videoUrl}
          playbackRate={speed}
          volume={(_) => (typeof kfVolume === "number" ? kfVolume : volume)}
          loop={loop}
          style={videoStyle}
        />
      )}
    </div>
  )
}

export { CameraComponent as Camera }
