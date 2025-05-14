// Utilities for mapping animation/interpolated values to React style objects

export function applyAnimationToStyle(
  baseStyle: React.CSSProperties,
  interp: Record<string, number | string>,
): React.CSSProperties {
  const style = { ...baseStyle }

  if (interp.opacity !== undefined) style.opacity = interp.opacity
  if (interp.backgroundColor !== undefined)
    style.backgroundColor = interp.backgroundColor as string
  if (interp.borderRadius !== undefined)
    style.borderRadius = interp.borderRadius

  if (interp.width !== undefined) {
    if (typeof interp.width === "number") {
      style.width = `${interp.width}px`
    } else {
      style.width = interp.width
    }
  }

  if (interp.height !== undefined) {
    if (typeof interp.height === "number") {
      style.height = `${interp.height}px`
    } else {
      style.height = interp.height
    }
  }

  // Ajout : gestion de transform (slide, scale, rotate)
  const transforms: string[] = []
  if (interp.translateX !== undefined)
    transforms.push(`translateX(${interp.translateX}px)`)
  if (interp.translateY !== undefined)
    transforms.push(`translateY(${interp.translateY}px)`)
  if (interp.scale !== undefined) transforms.push(`scale(${interp.scale})`)
  if (interp.rotate !== undefined)
    transforms.push(`rotate(${interp.rotate}deg)`)
  if (transforms.length > 0) style.transform = transforms.join(" ")

  return style
}

export function parseStyleString(style: string): React.CSSProperties {
  const obj = style
    .split(";")
    .filter(Boolean)
    .reduce((acc: Record<string, string>, rule: string) => {
      const [key, value] = rule.split(":")
      if (!key || !value) return acc
      const jsKey: string = key
        .trim()
        .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      acc[jsKey] = value.trim()
      return acc
    }, {})
  return obj as React.CSSProperties
}
