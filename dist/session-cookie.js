import "server-only";
import { cookies } from "next/headers";
import { setSignedCookieIn, clearSignedCookieIn, readSignedCookieIn, } from "./session-cookie-core.js";
export { resolveSecureCookieOption } from "./secure-cookie-option.js";
export { setSignedCookieIn, clearSignedCookieIn, readSignedCookieIn, } from "./session-cookie-core.js";
async function nextCookieStore() {
    const jar = await cookies();
    return {
        set: (name, value, options) => {
            jar.set(name, value, options);
        },
        delete: (name) => {
            jar.delete(name);
        },
        get: (name) => jar.get(name)?.value,
    };
}
/** Grava um token de sessão (ver `signed-session`) num cookie httpOnly seguro. */
export async function setSignedCookie(name, token, maxAgeMs, request) {
    await setSignedCookieIn(await nextCookieStore(), name, token, maxAgeMs, request);
}
export async function clearSignedCookie(name) {
    await clearSignedCookieIn(await nextCookieStore(), name);
}
export async function readSignedCookie(name) {
    return readSignedCookieIn(await nextCookieStore(), name);
}
