import { renderMediaOnLambda } from "@remotion/lambda/client"

const { bucketName, renderId } = await renderMediaOnLambda({
  region: "us-east-1",
  functionName: "remotion-render-bds9aab",
  composition: "BlacksmithShort",
  serveUrl:
    "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/blacksmith-shorts",
  codec: "h264",
  framesPerLambda: 200,
})

console.log(`Rendu lancé avec succès!`)
console.log(`Bucket: ${bucketName}`)
console.log(`ID de rendu: ${renderId}`)
