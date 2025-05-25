import React from "react"
import { ImageLayerType } from "@/schemas/project"
import { parseStyleString } from "@/utils/getStyle"

/**
 * Image: affiche une image avec style custom.
 * @param image L'image à afficher
 * @param revealProgress La progression de révélation de l'image
 */
export const Image: React.FC<{
  image: ImageLayerType
  revealProgress?: number
}> = ({ image, revealProgress = 1 }) => {
  const { url, objectFit = "cover", style } = image
  const userStyle = style ? parseStyleString(style) : {}
  return (
    <img
      src={url}
      alt="Image content"
      style={{
        width: "100%",
        height: "100%",
        objectFit,
        ...userStyle,
      }}
      draggable={false}
      aria-label="Image content"
    />
  )
}
