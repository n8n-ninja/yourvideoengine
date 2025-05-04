export const isProd = process.env.NODE_ENV === "production"
export const domain = isProd ? ".yourvideoengine.com" : ".yourvideoengine.local"
export const protocol = isProd ? "https://" : "http://"

export const getClientUrl = (slug: string) =>
  `${protocol}${slug}.studio.${domain}`

export const getConnectUrl = () => `${protocol}connect.${domain}`
