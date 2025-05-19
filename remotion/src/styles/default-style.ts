import { CSSProperties } from "react"

export const cameraContainerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  display: "block",
}

export const cameraVideoStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transformOrigin: "50% 50%",
}
