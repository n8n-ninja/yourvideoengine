#!/usr/bin/env node

const { execSync } = require("child_process")

// On récupère le message depuis argv[2]
let message = process.argv.slice(2).join(" ").trim()

if (!message) {
  const now = new Date()
  message = now.toISOString().replace("T", " ").split(".")[0]
}

console.log(`📦 Committing with message: "${message}"`)

try {
  execSync("git add .", { stdio: "inherit" })
  execSync(`git commit -m "${message}"`, { stdio: "inherit" })
  execSync("git push origin main", { stdio: "inherit" })
  console.log("✅ Code pushed to main.")
} catch (error) {
  console.error("❌ Push failed.")
  process.exit(1)
}
