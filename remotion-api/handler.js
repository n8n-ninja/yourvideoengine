/* global process */
const {
  renderMediaOnLambda,
  getRenderProgress,
} = require("@remotion/lambda/client")

const REMOTION_LAMBDA_FUNCTION_NAME = "remotion-render-4-0-293-mem2048mb-disk10240mb-900sec";
const REMOTION_URL = "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com"
module.exports.renderVideo = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const {
      serveUrl,
      composition,
      inputProps,
      framesPerLambda,
      webhookUrl,
      webhookSecret,
      durationInFrames,
      customData,
    } = body

    const { renderId, bucketName } = await renderMediaOnLambda({
      serveUrl,
      composition,
      inputProps: {
        ...inputProps,
        durationInFrames: durationInFrames ?? 90,
      },
      region: "us-east-1",
      codec: "h264",
      functionName: REMOTION_LAMBDA_FUNCTION_NAME,
      framesPerLambda: framesPerLambda ?? 12,
      webhook: webhookUrl
        ? {
            url: webhookUrl,
            secret: webhookSecret,
          }
        : undefined,
      customData,
    })

    const statusUrl = `${REMOTION_URL}/dev/status?renderId=${renderId}&bucketName=${bucketName}`

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        renderId,
        bucketName,
        statusUrl,
      }),
    }
  } catch (err) {
    console.error("❌ renderVideo error:", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    }
  }
}

module.exports.getStatus = async (event) => {
  try {
    const renderId = event.queryStringParameters?.renderId
    const bucketName = event.queryStringParameters?.bucketName

    if (!renderId || !bucketName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing renderId or bucketName",
        }),
      }
    }

    const result = await getRenderProgress({
      renderId,
      bucketName,
      region: "us-east-1",
      functionName: REMOTION_LAMBDA_FUNCTION_NAME,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ...result }),
    }
  } catch (err) {
    console.error("❌ getStatus error:", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    }
  }
}
