const fs = require("fs")
const path = require("path")

const env = process.env.REMOTION_ENV || "dev"
const configPath = path.join(__dirname, `remotion-config.${env}.json`)
let remotionConfig = {}
if (fs.existsSync(configPath)) {
  remotionConfig = JSON.parse(fs.readFileSync(configPath, "utf8"))
}

const environments = {
  dev: {
    remotionLambdaFunctionName: remotionConfig.remotionLambdaFunctionName,
    remotionUrl: "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev",
    serveUrl: remotionConfig.serveUrl,
  },
  prod: {
    remotionLambdaFunctionName: remotionConfig.remotionLambdaFunctionName,
    remotionUrl: "https://0lxwxeqkpl.execute-api.us-east-1.amazonaws.com/prod",
    serveUrl: remotionConfig.serveUrl,
  },
}

module.exports = {
  getConfig: (env = process.env.REMOTION_ENV || "dev") => {
    if (!environments[env]) {
      console.warn(`Environment "${env}" not found, falling back to "dev"`)
      return environments.dev
    }
    return environments[env]
  },
}
