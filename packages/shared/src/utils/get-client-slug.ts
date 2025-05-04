export function getClientSlug(request: Request): string | null {
    const host = request.headers.get("host")
  
    if (!host) return null
  
    const slug = host.split(".")[0]
    return slug
  }
  