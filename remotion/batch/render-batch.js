#!/usr/bin/env node

// 1. Imports
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// 2. Constantes
const inputDir = path.resolve(__dirname, "inputs")
const outputDir = path.resolve(__dirname, "outputs")
const composition = "Edit" // Adapter selon le nom de ta composition Remotion
const remotionRoot = path.resolve(__dirname, "..")

// 3. Création du dossier de sortie si besoin
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 4. Lecture des fichiers JSON et JS
const inputFiles = fs
  .readdirSync(inputDir)
  .filter((file) => file.endsWith(".json") || file.endsWith(".js"))
  .map((file) => ({ name: file, fullPath: path.join(inputDir, file) }))

if (inputFiles.length === 0) {
  console.log("Aucun fichier .json ou .js trouvé dans", inputDir)
  process.exit(0)
}

// 5. Boucle sur chaque fichier
inputFiles.forEach(({ name, fullPath }) => {
  const outputName = name.replace(/\.(json|js)$/, ".mp4")
  const outputPath = path.join(outputDir, outputName)
  console.log(`\n[Batch] Rendu de ${name} → ${outputName}`)

  let propsString = ""
  if (name.endsWith(".json")) {
    propsString = fs.readFileSync(fullPath, "utf8")
    console.log(`[Batch] Type: JSON`)
  } else if (name.endsWith(".js")) {
    // Charger dynamiquement le module JS
    const mod = require(path.resolve(fullPath))
    // Prendre export default, ou caption, ou tout l'objet
    const data = mod.default || mod.caption || mod
    propsString = JSON.stringify(data)
    console.log(`[Batch] Type: JS (module)`)
  } else {
    console.log(`[Batch] Fichier ignoré: ${name}`)
    return
  }

  // Commande Remotion CLI
  // --props permet de passer le JSON comme props à la composition
  const cmd = `npx remotion render ${composition} ${outputPath} --props='${propsString}' --root=${remotionRoot}`
  try {
    execSync(cmd, { stdio: "inherit" })
  } catch (err) {
    console.error(`[Batch] Erreur lors du rendu de ${name}:`, err.message)
  }
})

console.log("\n[Batch] Terminé. Vidéos générées dans", outputDir)
