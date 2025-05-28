import React from "react"
import { Folder } from "remotion"
import { TemplateSample } from "@/compositions/templates/Sample"
import "@/styles/fonts.css"

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Projects">
        <TemplateSample />
      </Folder>
    </>
  )
}
