export type CaptionTheme = {
  boxStyle?: React.CSSProperties
  textStyle?: React.CSSProperties
  activeWordStyle?: React.CSSProperties
}

export type CameraTheme = {
  videoStyle?: React.CSSProperties
}

export type TitleTheme = {
  style?: React.CSSProperties
}

export type OverlayTheme = {
  scanlineStyle?: React.CSSProperties
  vignetteStyle?: React.CSSProperties
  colorStyle?: React.CSSProperties
}

export type ImageTheme = {
  imageStyle?: React.CSSProperties
}

export type GlobalTheme = {
  caption?: CaptionTheme
  camera?: CameraTheme
  title?: TitleTheme
  overlay?: OverlayTheme
  image?: ImageTheme
  containerStyle?: React.CSSProperties
}
