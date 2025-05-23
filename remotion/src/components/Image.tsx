import React from "react"
import { Image as ImageType } from "@/schemas"
import { parseStyleString } from "@/utils/getStyle"

/**
 * Image: affiche une image avec style custom.
 * @param image L'objet image à afficher (type ImageType)
 */
export const Image: React.FC<{ image: ImageType; revealProgress?: number }> = ({
  image,
  revealProgress = 1,
}) => {
  const userStyle = image.style ? parseStyleString(image.style) : {}
  const objectFit = image.objectFit ?? "cover"
  return (
    <img
      src={image.url}
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
