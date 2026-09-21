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
export async function clearSignedCookieIn(store, name) {
    await store.delete(name);
}
export async function readSignedCookieIn(store, name) {
    return store.get(name);
}
