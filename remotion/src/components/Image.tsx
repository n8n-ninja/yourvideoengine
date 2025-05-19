import React from "react"
import { Image as ImageType } from "@/schemas"
import { parseStyleString } from "@/utils/getStyle"

/**
 * Image: affiche une image avec style custom.
 * @param image L'objet image à afficher (type ImageType)
 */
export const Image: React.FC<{ image: ImageType }> = ({ image }) => {
  const userStyle = image.style ? parseStyleString(image.style) : {}
  return (
    <img
      src={image.url}
      alt="Image content"
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        ...userStyle,
      }}
      draggable={false}
      aria-label="Image content"
    />
  )
}
