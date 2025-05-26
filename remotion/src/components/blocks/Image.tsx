import React from "react"
import { ImageBlockType } from "@/schemas/project"
import { getStyle } from "@/utils/getStyle"
import { Img } from "remotion"

/**
 * Image: affiche une image avec style custom.
 * @param image L'image à afficher
 * @param revealProgress La progression de révélation de l'image
 */
export const Image: React.FC<{
  image: ImageBlockType
  revealProgress?: number
}> = ({ image, revealProgress = 1 }) => {
  const { url, objectFit = "cover", style } = image
  const userStyle = getStyle(style)
  return (
    <Img
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
