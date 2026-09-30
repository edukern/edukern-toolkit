import { resolveSecureCookieOption } from "./secure-cookie-option.js";
export { resolveSecureCookieOption } from "./secure-cookie-option.js";
/** Grava um token de sessão (ver `signed-session`) num cookie httpOnly seguro. */
export async function setSignedCookieIn(store, name, token, maxAgeMs, request) {
    await store.set(name, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: resolveSecureCookieOption(request),
        path: "/",
        maxAge: Math.floor(maxAgeMs / 1000),
    });
}
/**
 * Apaga gravando vazio com as MESMAS opções do set. `delete` manda sem `Secure`, e o navegador
 * ignora isso num cookie `__Host-` (a sessão continuaria valendo).
 */
export async function clearSignedCookieIn(store, name, request) {
    await store.set(name, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: resolveSecureCookieOption(request),
        path: "/",
        maxAge: 0,
    });
}
export async function readSignedCookieIn(store, name) {
    return store.get(name);
}
