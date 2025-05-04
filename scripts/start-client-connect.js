#!/usr/bin/env node

const { spawn } = require("child_process")

const client = process.argv[2]

if (!client) {
  console.error("❌ Please provide a client name: start-both <client>")
  process.exit(1)
}

console.log(`🚀 Starting 'connect' and client '${client}' in parallel\n`)

const start = (name, command) => {
  const proc = spawn("pnpm", command, {
    stdio: "inherit",
    shell: true,
  })

  proc.on("exit", (code) => {
    console.log(`❌ ${name} exited with code ${code}`)
  })
}

start("connect", ["--filter", "connect", "run", "dev"])
start(client, ["--filter", client, "run", "dev"])
