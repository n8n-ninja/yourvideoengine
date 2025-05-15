import { useEffect, useState } from "react"

export type ExampleType = "camera" | "title" | "overlay" | "sound" | "caption"

export interface ExampleList {
  camera: string[]
  title: string[]
  overlay: string[]
  sound: string[]
  caption: string[]
}

const EXAMPLE_TYPES: ExampleType[] = [
  "camera",
  "title",
  "overlay",
  "sound",
  "caption",
]

export const useExampleList = (): ExampleList => {
  const [examples, setExamples] = useState<ExampleList>({
    camera: [],
    title: [],
    overlay: [],
    sound: [],
    caption: [],
  })

  useEffect(() => {
    const fetchExamples = async () => {
      const result: ExampleList = {
        camera: [],
        title: [],
        overlay: [],
        sound: [],
        caption: [],
      }
      await Promise.all(
        EXAMPLE_TYPES.map(async (type) => {
          try {
            const res = await fetch(`/examples/${type}/`)
            if (res.ok) {
              // On suppose que le serveur retourne la liste des fichiers (à adapter selon config serveur)
              const files: string[] = await res.json()
              result[type] = files.filter((f) => f.endsWith(".json"))
            }
          } catch {
            // ignore
          }
        }),
      )
      setExamples(result)
    }
    fetchExamples()
  }, [])

  return examples
}
