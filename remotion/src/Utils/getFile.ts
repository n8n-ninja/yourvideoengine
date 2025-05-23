import { staticFile } from "remotion"

/**
 * Retourne l'URL d'un fichier, qu'il soit distant (http) ou local (staticFile).
 * @param src Chemin ou URL du fichier
 * @param baseDir Dossier de base pour les fichiers locaux (optionnel)
 */
export const getFile = (src: string, baseDir?: string) => {
  if (src.startsWith("http")) return src
  return staticFile(baseDir ? `${baseDir}/${src}` : src)
}

/**
 * Retourne l'URL d'un fichier audio, par défaut dans /public/audio
 * @param src Chemin ou URL du fichier audio
 */
export const getAudio = (src: string) => getFile(src, "audio")
