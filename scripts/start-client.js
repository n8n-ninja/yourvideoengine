#!/usr/bin/env node

const { execSync } = require("child_process")

const client = process.argv[2]

if (!client) {
  console.error("❌ Please provide a client name: start-client <client-slug>")
  process.exit(1)
}

console.log(`🚀 Launching studio for client: ${client}\n`)

execSync(`pnpm --filter ${client} run dev`, {
  stdio: "inherit",
})
