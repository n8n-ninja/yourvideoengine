import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import type { Configuration } from "webpack"

export const webpackOverride = (currentConfig: Configuration) => {
  if (!currentConfig.resolve) currentConfig.resolve = {}

  currentConfig.resolve.plugins = [
    ...(currentConfig.resolve.plugins || []),
    new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }),
  ]

  currentConfig.stats = {
    warningsFilter: [
      /Serializing big strings.*impacts deserialization performance/,
    ],
  }

  currentConfig.infrastructureLogging = {
    ...currentConfig.infrastructureLogging,
    level: "error",
  }

  return currentConfig
}
