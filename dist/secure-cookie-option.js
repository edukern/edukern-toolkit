function isHttpsRequest(headers, protocol) {
    const forwardedProto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    if (forwardedProto)
        return forwardedProto === "https";
    return protocol === "https:";
}
/**
 * Decide a flag `secure` do cookie. `AUTH_COOKIE_SECURE=true/false` força (útil em LAN/rede
 * interna sem HTTPS). Sem override e sem `request`, cai em `NODE_ENV === "production"` — mas
 * isso mente atrás de um proxy que termina TLS antes do processo Node (comum em deploy on-prem);
 * passe `request` (`{ headers: req.headers, protocol: req.nextUrl.protocol }` num Route Handler)
 * pra detectar HTTPS de verdade via `x-forwarded-proto`.
 */
export function resolveSecureCookieOption(request) {
    const override = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();
    if (override === "true")
        return true;
    if (override === "false")
        return false;
    if (request)
        return isHttpsRequest(request.headers, request.protocol);
    return process.env.NODE_ENV === "production";
}
