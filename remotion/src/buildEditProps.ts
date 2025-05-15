import fs from "fs"
import path from "path"

type ExampleType = "camera" | "title" | "overlay" | "sound" | "caption"

interface BuildOptions {
  camera: string // chemin vers l'exemple camera
  title?: string
  overlay?: string
  sound?: string
  caption?: string
}

export const buildEditProps = (options: BuildOptions) => {
  const baseScene: any = {}

  // Charger chaque composant sélectionné
  for (const key of Object.keys(options) as ExampleType[]) {
    if (options[key]) {
      const filePath = path.join(
        __dirname,
        "../../public/examples",
        key,
        options[key],
      )
      baseScene[key === "camera" ? "camera" : key + "s"] = JSON.parse(
        fs.readFileSync(filePath, "utf-8"),
      )[key]
    }
  }

  // Structure finale
  const editProps = { scenes: [baseScene] }

  // Sauvegarder pour test visuel
  fs.writeFileSync(
    path.join(__dirname, "../compositions/editProps.json"),
    JSON.stringify(editProps, null, 2),
  )
  console.log("editProps.json généré pour test visuel !")
}
