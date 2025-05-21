import { z } from "zod"
import { PositionSchema, StyleSchema } from "./index"

/**
 * Schéma Zod pour la configuration d'une légende (caption).
 * Permet le timing mot à mot, la position, les styles (boîte, texte, mot actif),
 * la gestion multi-couleurs et la combinaison de tokens.
 */
export const CaptionSchema = z.object({
  words: z
    .array(
      z.object({
        word: z.string().describe("Mot affiché"),
        start: z.number().describe("Début du mot (en secondes)"),
        end: z.number().describe("Fin du mot (en secondes)"),
      }),
    )
    .describe("Liste des mots avec timing"),
  position: PositionSchema.optional().describe("Position de la légende"),
  boxStyle: StyleSchema.optional().describe("Style de la boîte de fond"),
  textStyle: StyleSchema.optional().describe("Style du texte"),
  activeWordStyle: StyleSchema.optional().describe("Style du mot actif"),
  multiColors: z
    .array(z.string())
    .optional()

    .describe("Couleurs multiples pour les mots"),
  combineTokensWithinMilliseconds: z
    .number()
    .optional()

    .describe("Combiner les tokens proches (en ms)"),
})

/**
 * Type TypeScript inféré du schéma CaptionSchema.
 */
export type Caption = z.infer<typeof CaptionSchema>
