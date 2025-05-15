import { Style } from "@/schemas"

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

export function getStyle(
  userStyle: Style | undefined,
  baseStyle: React.CSSProperties = {},
): React.CSSProperties {
  if (!userStyle) return baseStyle
  if (typeof userStyle === "string") {
    return { ...baseStyle, ...parseStyleString(userStyle) }
  }
  return { ...baseStyle, ...(userStyle as React.CSSProperties) }
}
