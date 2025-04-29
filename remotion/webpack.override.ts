import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import type { Configuration } from "webpack"

export const webpackOverride = (currentConfig: Configuration) => {
  if (!currentConfig.resolve) currentConfig.resolve = {}

  currentConfig.resolve.plugins = [
    ...(currentConfig.resolve.plugins || []),
    new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }),
  ]

  return currentConfig
}
