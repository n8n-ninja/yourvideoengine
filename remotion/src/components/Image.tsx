import React from "react"
import { Img } from "remotion"
import { Layout } from "@/components/Layout"
import { Effects } from "@/schemas/effect"
import { Reveal } from "@/schemas/reveal"
import { Timing } from "@/schemas/timing"
import { Position } from "@/schemas/position"
import { Style } from "@/schemas/style"
import { getStyle } from "@/utils/getStyle"

/**
 * Image: affiche une image avec style custom.
 * @param url L'URL de l'image à afficher
 * @param objectFit Le mode d'ajustement de l'image
 * @param style Le style custom de l'image
 * @param timing La progression de révélation de l'image
 * @param reveal La révélation de l'image
 * @param position La position de l'image
 * @param effects Les effets de l'image
 * @param layoutStyle Le style de mise en page de l'image
 */
export const Image: React.FC<{
  url: string
  objectFit?: "fill" | "cover" | "contain" | "none" | "scale-down"
  style?: string | Record<string, string | number>
  timing?: Timing
  reveal?: Reveal
  position?: Position
  effects?: Effects
  layoutStyle?: Style
}> = ({
  url,
  objectFit = "cover",
  style,
  timing,
  reveal,
  position,
  effects,
  layoutStyle,
}) => {
  const userStyle = getStyle(style)
  return (
    <Layout
      timing={timing}
      reveal={reveal}
      position={position}
      effects={effects}
      style={layoutStyle}
    >
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
    </Layout>
  )
}
