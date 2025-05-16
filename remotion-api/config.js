const environments = {
  dev: {
    remotionLambdaFunctionName:
      "remotion-render-4-0-304-mem2048mb-disk10240mb-900sec",
    remotionUrl: "https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev",
    serveUrl:
      "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine-dev/index.html", // Replace with your actual dev site URL
  },
  prod: {
    remotionLambdaFunctionName:
      "remotion-render-4-0-304-mem2048mb-disk10240mb-900sec",
    remotionUrl: "https://0lxwxeqkpl.execute-api.us-east-1.amazonaws.com/prod",
    serveUrl:
      "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine-prod/index.html", // Replace with your actual prod site URL
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
