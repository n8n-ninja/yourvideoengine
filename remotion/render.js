import { renderMediaOnLambda } from "@remotion/lambda/client"

await renderMediaOnLambda({
  region: "us-east-1",
  functionName: "remotion-render-4-0-304-mem2048mb-disk10240mb-900sec",
  composition: "Edit",
  serveUrl:
    "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine-dev",
  codec: "h264",
  framesPerLambda: 200,
})
