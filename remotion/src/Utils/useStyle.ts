import { z } from "zod"
import React from "react"

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

export const StyleSchema = z.union([z.record(z.unknown()), z.string()])

export function useStyle(
  userStyle: Record<string, unknown> | string | undefined,
  baseStyle: React.CSSProperties = {},
): React.CSSProperties {
  if (!userStyle) return baseStyle
  if (typeof userStyle === "string") {
    return { ...baseStyle, ...parseStyleString(userStyle) }
  }
  return { ...baseStyle, ...(userStyle as React.CSSProperties) }
}
