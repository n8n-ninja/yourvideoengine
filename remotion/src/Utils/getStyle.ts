/**
 * Parses a CSS style string into a React.CSSProperties object.
 * Supports kebab-case to camelCase conversion.
 *
 * @param style The CSS style string (e.g. 'font-size:12px; color:red;').
 * @returns A React.CSSProperties object.
 */
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

/**
 * Merges a user style string with a base style.
 * If userStyle is a string, it is parsed as CSS. If undefined, returns baseStyle.
 *
 * @param userStyle The user style string.
 * @param baseStyle The base style (default: empty object).
 * @returns The merged React.CSSProperties object.
 */
export function getStyle(
  userStyle: string | undefined,
  baseStyle: React.CSSProperties = {},
): React.CSSProperties {
  if (!userStyle) return baseStyle
  return { ...baseStyle, ...parseStyleString(userStyle) }
}
