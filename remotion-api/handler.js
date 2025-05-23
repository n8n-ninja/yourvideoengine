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

// module.exports.renderVideo = async (event) => {
//   console.log("Hello from Lambda")
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ pong: true }),
//   }
// }

module.exports.renderVideo = async (event) => {
  let bodyRaw = event.body
  let body
  try {
    console.log("[renderVideo] Body brut reçu:", bodyRaw)
    body = JSON.parse(bodyRaw)
  } catch (err) {
    console.error(
      "[renderVideo] Erreur parsing JSON:",
      err,
      "Body reçu:",
      bodyRaw,
    )
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: "Invalid JSON",
        details: err.message,
      }),
    }
  }

  // Validation des champs obligatoires
  if (!body.composition || !body.inputProps) {
    console.error("[renderVideo] Champs manquants:", {
      composition: body.composition,
      inputProps: body.inputProps,
    })
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: "Missing required fields: composition and inputProps",
      }),
    }
  }

  // Valeurs par défaut pour inputProps
  const {
    composition,
    inputProps,
    framesPerLambda,
    webhookUrl,
    webhookSecret,
    durationInFrames,
    customData,
  } = body

  const inputPropsWithDefaults = {
    fps: 30,
    width: 1080,
    height: 1920,
    background: "#1A1728",
    ...inputProps,
    durationInFrames: durationInFrames ?? inputProps.durationInFrames ?? 90,
  }

  try {
    // Automatically detect environment from request
    const environment = detectEnvironment(event)
    const config = getConfig(environment)

    console.log("[renderVideo] Params envoyés à Remotion Lambda:", {
      serveUrl: body.serveUrl || config.serveUrl,
      composition,
      inputProps: inputPropsWithDefaults,
      region: "us-east-1",
      codec: "h264",
      functionName: config.remotionLambdaFunctionName,
      framesPerLambda: framesPerLambda ?? 12,
      webhook: webhookUrl,
      customData,
    })

    const { renderId, bucketName } = await renderMediaOnLambda({
      serveUrl: body.serveUrl || config.serveUrl,
      composition,
      inputProps: inputPropsWithDefaults,
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
