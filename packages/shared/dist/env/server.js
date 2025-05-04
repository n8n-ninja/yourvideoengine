export const isProd = process.env.NODE_ENV === "production";
export const domain = isProd ? ".yourvideoengine.com" : ".yourvideoengine.local";
export const protocol = isProd ? "https://" : "http://";
export const getClientUrl = (slug) => `${protocol}${slug}.studio${domain}${!isProd ? ":4000" : ""}`;
export const getConnectUrl = () => `${protocol}connect${domain}${!isProd ? ":3000" : ""}`;
