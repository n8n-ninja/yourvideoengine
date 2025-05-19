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

// 4. Lecture des fichiers JSON
const jsonFiles = fs
  .readdirSync(inputDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({ name: file, fullPath: path.join(inputDir, file) }))

if (jsonFiles.length === 0) {
  console.log("Aucun fichier JSON trouvé dans", inputDir)
  process.exit(0)
}

// 5. Boucle sur chaque JSON
jsonFiles.forEach(({ name, fullPath }) => {
  const outputName = name.replace(/\.json$/, ".mp4")
  const outputPath = path.join(outputDir, outputName)
  console.log(`\n[Batch] Rendu de ${name} → ${outputName}`)

  // Commande Remotion CLI
  // --props permet de passer le JSON comme props à la composition
  const cmd = `npx remotion render ${composition} ${outputPath} --props='${fs.readFileSync(fullPath, "utf8")}' --root=${remotionRoot}`
  try {
    execSync(cmd, { stdio: "inherit" })
  } catch (err) {
    console.error(`[Batch] Erreur lors du rendu de ${name}:`, err.message)
  }
})

console.log("\n[Batch] Terminé. Vidéos générées dans", outputDir)
