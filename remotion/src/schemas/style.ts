import { z } from "zod"

/**
 * Zod schema for a style configuration.
 * Accepts either a record (object) or a string (CSS style string).
 */
// export const StyleSchema = z.union([
//   z.record(z.union([z.string(), z.number()])),
//   z.string(),
// ])

export const StyleSchema = z.string()

/**
 * Type inferred from StyleSchema.
 */
export type Style = z.infer<typeof StyleSchema>
