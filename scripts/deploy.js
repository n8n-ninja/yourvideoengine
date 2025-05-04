#!/usr/bin/env node

const { execSync } = require("child_process")

const target = process.argv[2]

if (!target) {
  console.error("❌ Please specify a target package: pnpm d <target>")
  process.exit(1)
}

console.log(`🚀 Deploying project: ${target}`)

try {
  execSync(`pnpm --filter ${target} run deploy`, {
    stdio: "inherit",
  })
} catch (err) {
  console.error(`❌ Deployment for "${target}" failed.`)
  process.exit(1)
}
