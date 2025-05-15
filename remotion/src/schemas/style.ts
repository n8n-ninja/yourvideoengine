import { z } from "zod"

export const StyleSchema = z.union([z.record(z.unknown()), z.string()])

export type Style = z.infer<typeof StyleSchema>
