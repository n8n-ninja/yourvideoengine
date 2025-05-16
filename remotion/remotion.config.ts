/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config"
import { webpackOverride } from "./webpack.override"

Config.overrideWebpackConfig(webpackOverride)

Config.setVideoImageFormat("png")

Config.setOverwriteOutput(true)

export const getRenderMetadata = () => ({
  maxFramesPerLambda: 200,
})
