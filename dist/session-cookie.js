import "server-only";
import { cookies } from "next/headers";
/** Grava um token de sessão (ver `signed-session`) num cookie httpOnly seguro. */
export async function setSignedCookie(name, token, maxAgeMs) {
    const jar = await cookies();
    jar.set(name, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: Math.floor(maxAgeMs / 1000),
    });
}
export async function clearSignedCookie(name) {
    const jar = await cookies();
    jar.delete(name);
}
export async function readSignedCookie(name) {
    const jar = await cookies();
    return jar.get(name)?.value;
}
