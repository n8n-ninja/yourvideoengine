import React from "react"
import { Video } from "remotion"
import { Camera } from "@/schemas"
import { useKeyframes } from "@/hooks/useKeyframes"
import { parseStyleString } from "@/utils/getStyle"

/**
 * Camera: renders a video with animated camera effects (scale, blur, rotation, filter) using keyframes.
 * Supports offsetX, offsetY, style, speed, volume, and loop for fine positioning, custom styles, and playback options.
 *
 * @param videoUrl The video source URL.
 * @param animationKeyframes Optional array of keyframes for camera effects.
 * @param offsetX Optional X offset for fine positioning.
 * @param offsetY Optional Y offset for fine positioning.
 * @param style Optional style string for custom styles.
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
  speed = 1,
  volume = 1,
  loop = false,
}) => {
  const userStyle = style ? parseStyleString(style) : {}

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    display: "block",
    ...userStyle,
  }

  // Toujours appeler le hook (même si on ne l'utilise pas)
  const interpolated =
    useKeyframes<Record<string, number | string | undefined>>(
      animationKeyframes && animationKeyframes.length > 0
        ? animationKeyframes
        : [],
    ) || {}

  // Si pas de keyframes, juste la vidéo sans animation
  if (!animationKeyframes || animationKeyframes.length === 0) {
    return (
      <div style={containerStyle}>
        <Video
          src={videoUrl}
          playbackRate={speed}
          volume={() => volume}
          loop={loop}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transformOrigin: "50% 50%",
            transform: `translate(${offsetX}px, ${offsetY}px)`,
          }}
        />
      </div>
    )
  }

  const { scale = 1, blur = 0, rotation = 0, filter = "" } = interpolated
  const scaleNum = Number(scale)
  const blurNum = Number(blur)
  const scaleBlur = 1 + (isNaN(blurNum) ? 0 : blurNum / 80)
  const finalScale = (isNaN(scaleNum) ? 1 : scaleNum) * scaleBlur

  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `translate(${offsetX}px, ${offsetY}px) scale(${finalScale}) rotate(${rotation}deg)`,
    filter: `${filter} blur(${blur}px)`,
    transformOrigin: "50% 50%",
    display: "block",
  }

  return (
    <div style={containerStyle}>
      <Video
        src={videoUrl}
        playbackRate={speed}
        volume={() => volume}
        loop={loop}
        style={videoStyle}
      />
    </div>
  )
}

export { CameraComponent as Camera }
