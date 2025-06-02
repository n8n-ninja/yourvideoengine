import React from "react"
import { Folder } from "remotion"
import { TemplateSample } from "@/compositions/templates/Sample"
import { TemplateVideoBackgroundComment } from "@/compositions/templates/VideoBackgroundComment"
import "@/styles/fonts.css"

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Projects">
        <TemplateSample />
        <TemplateVideoBackgroundComment />
      </Folder>
    </>
  )
}
