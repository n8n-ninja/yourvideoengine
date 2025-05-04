export const getClientUrl = (slug: string) =>
  `${window.location.protocol}//${slug}.studio.${window.location.hostname}`

export const getConnectUrl = () =>
  `${window.location.protocol}//connect.${window.location.hostname}`
