import { CSSProperties } from "react"

export const timelineElementContainerStyle: CSSProperties = {
  overflow: "hidden",
  display: "block",
}

export const cameraVideoStyle: CSSProperties = {
  minWidth: "100%",
  minHeight: "100%",
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

export const captionBoxStyle: CSSProperties = {
  backgroundColor: "rgba(0,0,0,0.7)",
  borderRadius: 18,
  padding: "1.5em 4em",
  lineHeight: 1.4,
  textWrap: "balance",
  textAlign: "center",
  margin: "30px",
}

export const captionTextStyle: CSSProperties = {
  color: "#fff",
  fontFamily: "Montserrat, sans-serif",
  fontSize: 75,
  textShadow: "0 2px 30px #000, 0 1px 10px #000",
  fontWeight: 900,
  display: "inline-block",
  margin: "0em 0.1em",
  transition: "all 0.12s cubic-bezier(0.4,0,0.2,1)",
}

export const captionActiveWordStyle: CSSProperties = {
  color: "#F7C500",
  textShadow: "0 2px 30px #000, 0 1px 10px #000",
}
