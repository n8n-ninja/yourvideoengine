/* global process */
const { renderMediaOnLambda, getRenderProgress } = require("@remotion/lambda")
const { getConfig } = require("./config")

// Helper function to detect environment from request
const detectEnvironment = (event) => {
  // First try to extract from API Gateway stage (most reliable)
  if (event.requestContext && event.requestContext.stage) {
    return event.requestContext.stage === "prod" ? "prod" : "dev"
  }

  // Then use the environment variable set during deployment
  // (serverless.yml sets REMOTION_ENV: ${opt:stage, 'dev'})
  return process.env.REMOTION_ENV || "dev"
}

module.exports.renderVideo = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const {
      composition,
      inputProps,
      framesPerLambda,
      webhookUrl,
      webhookSecret,
      durationInFrames,
      customData,
    } = body

    // Automatically detect environment from request
    const environment = detectEnvironment(event)
    const config = getConfig(environment)

    const { renderId, bucketName } = await renderMediaOnLambda({
      serveUrl: body.serveUrl || config.serveUrl,
      composition,
      inputProps: {
        ...inputProps,
        durationInFrames: durationInFrames ?? 90,
      },
      region: "us-east-1",
      codec: "h264",
      functionName: config.remotionLambdaFunctionName,
      framesPerLambda: framesPerLambda ?? 12,
      webhook: webhookUrl
        ? {
            url: webhookUrl,
            secret: webhookSecret,
          }
        : undefined,
      customData,
    })

    const statusUrl = `${config.remotionUrl}/status?renderId=${renderId}&bucketName=${bucketName}`

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        renderId,
        bucketName,
        statusUrl,
        environment,
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

    // Automatically detect environment from request
    const environment = detectEnvironment(event)

    if (!renderId || !bucketName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing renderId or bucketName",
        }),
      }
    }

    const config = getConfig(environment)

    const result = await getRenderProgress({
      renderId,
      bucketName,
      region: "us-east-1",
      functionName: config.remotionLambdaFunctionName,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        ...result,
        environment,
      }),
    }
  } catch (err) {
    console.error("❌ getStatus error:", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    }
  }
}
