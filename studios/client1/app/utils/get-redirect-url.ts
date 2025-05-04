export const getRedirectUrl = (): string => {
  const isProd = process.env.NODE_ENV === "production"
  return isProd
    ? "https://connect.yourvideoengine.com"
    : "http://connect.yourvideoengine.local:3000"
}
