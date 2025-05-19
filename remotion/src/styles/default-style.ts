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

export const titleBaseStyle: CSSProperties = {
  color: "#fff",
  fontFamily: "Montserrat, sans-serif",
  fontSize: 90,
  textAlign: "center",
  fontWeight: 900,
  margin: 50,
  textWrap: "balance",
  textShadow: "0 2px 30px #000, 0 1px 10px #000",
  lineHeight: 1.1,
}
