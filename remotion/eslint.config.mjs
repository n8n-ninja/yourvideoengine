import { config } from "@remotion/eslint-config-flat"

export default {
  ...config,
  rules: {
    ...(config.rules || {}),
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
}
