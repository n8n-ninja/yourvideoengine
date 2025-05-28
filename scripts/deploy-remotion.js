#!/usr/bin/env node

const { execSync, spawnSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const NC = "\x1b[0m"

const printHeader = (msg) => {
  console.log(`\n${YELLOW}====== ${msg} ======${NC}\n`)
}

const rootDir = path.resolve(__dirname, "..")

const env = process.argv[2]
const component = process.argv[3] || "all"

if (!env) {
  console.error("Please specify an environment (dev or prod)")
  console.error("Usage: node scripts/deploy-remotion.js <env> [component]")
  process.exit(1)
}
if (env !== "dev" && env !== "prod") {
  console.error("Environment must be 'dev' or 'prod'")
  process.exit(1)
}
if (!["frontend", "api", "all"].includes(component)) {
  console.error("Component must be 'frontend', 'api', or 'all'")
  process.exit(1)
}

let lambdaName = ""

const deployFrontend = () => {
  printHeader(`Deploying Remotion frontend (${env})`)
  const remotionDir = path.join(rootDir, "remotion")
  process.chdir(remotionDir)
  if (env === "dev") {
    execSync("npm run d", { stdio: "inherit" })
  } else {
    execSync("npm run d:prod", { stdio: "inherit" })
  }
  printHeader("Deploying Remotion engine")
  // Capture output for Lambda name extraction
  const engineProc = spawnSync("npm", ["run", "d:engine"], {
    encoding: "utf-8",
  })
  process.stdout.write(engineProc.stdout)
  process.stderr.write(engineProc.stderr)
  const output = engineProc.stdout + engineProc.stderr
  // Try to extract Lambda name
  let match = output.match(/Already exists as ([^\s]+)/)
  if (match) {
    lambdaName = match[1]
  } else {
    match = output.match(/Deployed as ([^\s]+)/)
    if (match) lambdaName = match[1]
  }
  if (!lambdaName) {
    console.error(
      "❌ Impossible de trouver le nom de la Lambda Remotion dans la sortie CLI",
    )
    process.exit(1)
  }
  console.log(`Remotion Lambda function name: ${lambdaName}`)
  process.chdir(rootDir)
  console.log(`${GREEN}Frontend deployment complete!${NC}`)
}

const deployApi = () => {
  printHeader(`Deploying Remotion API (${env})`)
  const apiDir = path.join(rootDir, "remotion-api")
  process.chdir(apiDir)
  execSync(`npx serverless deploy --stage ${env}`, { stdio: "inherit" })
  process.chdir(rootDir)
  console.log(`${GREEN}API deployment complete!${NC}`)
}

if (component === "frontend" || component === "all") {
  deployFrontend()
}
if (component === "api" || component === "all") {
  deployApi()
}

printHeader("Deployment Summary")
console.log(`Environment: ${GREEN}${env}${NC}`)
console.log(`Components deployed: ${GREEN}${component}${NC}`)
console.log("")

let renderUrl = ""
let statusUrl = ""
if (env === "prod") {
  renderUrl =
    "https://0lxwxeqkpl.execute-api.us-east-1.amazonaws.com/prod/render"
  statusUrl =
    "https://0lxwxeqkpl.execute-api.us-east-1.amazonaws.com/prod/status"
} else {
  renderUrl =
    "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/render"
  statusUrl =
    "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/status"
}
console.log(`${YELLOW}Remotion Render URL:${NC}  ${GREEN}${renderUrl}${NC}`)
console.log(`${YELLOW}Remotion Status URL:${NC}  ${GREEN}${statusUrl}${NC}`)
console.log("")

const configFile = `remotion-config.${env}.json`
const configPath = path.join(rootDir, configFile)
const configJson = {
  remotionLambdaFunctionName: lambdaName,
  serveUrl: `https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine-${env}`,
  renderUrl,
  statusUrl,
}
fs.writeFileSync(configPath, JSON.stringify(configJson, null, 2))
fs.copyFileSync(configPath, path.join(rootDir, "remotion-api", configFile))
fs.copyFileSync(configPath, path.join(rootDir, "remotion", configFile))
console.log(`${GREEN}Deployment completed successfully!${NC}`)
