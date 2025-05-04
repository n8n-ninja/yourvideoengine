export function getClientSlug(request) {
    const host = request.headers.get("host");
    if (!host)
        return null;
    const slug = host.split(".")[0];
    return slug;
}
