/**
 * filter.ts - Utilities for parsing and building CSS filter strings
 *
 * - parseFilter: parses a CSS filter string into an object
 * - buildFilter: builds a CSS filter string from an object
 */

/**
 * Parses a CSS filter string into an object.
 * Example: 'brightness(1.2) sepia(0.5)' => { brightness: 1.2, sepia: 0.5 }
 */
export function parseFilter(filterStr: string): Record<string, number> {
  const regex = /(?<name>\w+)\(([^)]+)\)/g
  const result: Record<string, number> = {}
  let match
  while ((match = regex.exec(filterStr))) {
    const key = match[1]
    const value = parseFloat(match[2])
    if (!isNaN(value)) result[key] = value
  }
  return result
}

/**
 * Builds a CSS filter string from an object.
 * Example: { brightness: 1.2, sepia: 0.5 } => 'brightness(1.2) sepia(0.5)'
 */
export function buildFilter(obj: Record<string, number>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${k}(${v})`)
    .join(" ")
}
