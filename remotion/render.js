import { renderMediaOnLambda } from "@remotion/lambda/client"
import fs from "fs"
import path from "path"

const env = process.env.REMOTION_ENV || "dev"
const configPath = path.join(__dirname, `remotion-config.${env}.json`)
let remotionConfig = {}
if (fs.existsSync(configPath)) {
  remotionConfig = JSON.parse(fs.readFileSync(configPath, "utf8"))
}

const functionName = remotionConfig.remotionLambdaFunctionName
const serveUrl = remotionConfig.serveUrl

await renderMediaOnLambda({
  region: "us-east-1",
  functionName,
  composition: "Edit",
  serveUrl,
  codec: "h264",
  framesPerLambda: 200,
})
