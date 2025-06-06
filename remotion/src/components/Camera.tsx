import React from "react"
import { Img, Video } from "remotion"
import { Layout } from "@/components/Layout"
import { Keyframe } from "@/schemas/keyframe"
import { useKeyframes } from "@/hooks/useKeyframes"
import { getStyle } from "@/utils/getStyle"
import { cameraVideoStyle } from "@/styles/default-style"
import { Reveal } from "@/schemas/reveal"
import { Timing } from "@/schemas/timing"
import { Position } from "@/schemas/position"
import { Style } from "@/schemas/style"
import { Effects } from "@/schemas/effect"

/**
 * Camera: renders a video with animated camera effects (scale, blur, rotation, filter, volume) using keyframes.
 * Supports offsetX, offsetY, style, frameStyle, speed, volume, and loop for fine positioning, custom styles, and playback options.
 *
 * @param url The video source URL.
 * @param keyFrames Optional array of keyframes for camera effects.
 * @param offsetX Optional X offset for fine positioning.
 * @param offsetY Optional Y offset for fine positioning.
 * @param style Optional style string for custom styles.
 * @param speed Optional playback rate for the video.
 * @param volume Optional volume for the video.
 * @param loop Optional loop for the video.
 * @param revealProgress Optional progress for revealing the video.
 * @param timing Optional timing for the video.
 * @param reveal Optional reveal for the video.
 * @param position Optional position for the video.
 * @param effects Optional effects for the video.
 * @param layoutStyle Optional layout style for the video.
 * @returns A Video element that fills its parent (object-fit: cover) and animates inside a fixed container.
 */
const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)
}

export const Camera: React.FC<{
  url: string
  keyFrames?: Keyframe[]
  offsetX?: number
  offsetY?: number
  style?: Style
  speed?: number
  volume?: number
  loop?: boolean
  timing?: Timing
  reveal?: Reveal
  position?: Position
  effects?: Effects
  layoutStyle?: Style
}> = ({
  url,
  keyFrames,
  offsetX = 0,
  offsetY = 0,
  style,
  speed = 1,
  volume = 1,
  loop = false,
  timing,
  reveal,
  position,
  effects,
  layoutStyle,
}) => {
  const userStyle = getStyle(style)

  const interpolated =
    useKeyframes<Record<string, number | string | undefined>>(
      keyFrames && keyFrames.length > 0 ? keyFrames : [],
    ) || {}

  const {
    scale = 1,
    rotation = 0,
    left = 0,
    top = 0,
    filter = "",
    volume: kfVolume,
    blur = 0,
  } = interpolated
  const scaleNum = Number(scale)
  const blurNum = Number(blur)
  const scaleBlur = 1 + (isNaN(blurNum) ? 0 : blurNum / 80)
  const finalScale = (isNaN(scaleNum) ? 1 : scaleNum) * scaleBlur

  const hasKeyframes = !!keyFrames && keyFrames.length > 0

  const videoStyle = {
    ...cameraVideoStyle,
    transform: hasKeyframes
      ? `translate(${left || offsetX}px, ${top || offsetY}px) scale(${finalScale}) rotate(${rotation}deg)`
      : `translate(${left || offsetX}px, ${top || offsetY}px)`,
    filter: hasKeyframes ? `${filter}` : undefined,
    ...userStyle,
  }

  return (
    <Layout
      timing={timing}
      reveal={reveal}
      position={position}
      effects={effects}
      style={layoutStyle}
    >
      {isImage(url) ? (
        <Img
          src={url}
          alt="Camera content"
          style={videoStyle}
          draggable={false}
        />
      ) : (
        <Video
          src={url}
          playbackRate={speed}
          volume={(_) => (typeof kfVolume === "number" ? kfVolume : volume)}
          loop={loop}
          style={videoStyle}
          preload="true"
        />
      )}
    </Layout>
  )
}
