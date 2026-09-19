export type RequestLike = {
    headers: {
        get(name: string): string | null;
    };
    protocol?: string;
};
/**
 * Decide a flag `secure` do cookie. `AUTH_COOKIE_SECURE=true/false` força (útil em LAN/rede
 * interna sem HTTPS). Sem override e sem `request`, cai em `NODE_ENV === "production"` — mas
 * isso mente atrás de um proxy que termina TLS antes do processo Node (comum em deploy on-prem);
 * passe `request` (`{ headers: req.headers, protocol: req.nextUrl.protocol }` num Route Handler)
 * pra detectar HTTPS de verdade via `x-forwarded-proto`.
 */
export declare function resolveSecureCookieOption(request?: RequestLike): boolean;
