import "server-only";
import type { RequestLike } from "./secure-cookie-option.js";
export { resolveSecureCookieOption, type RequestLike } from "./secure-cookie-option.js";
export type { CookieStore, CookieSetOptions } from "./session-cookie-core.js";
export { setSignedCookieIn, clearSignedCookieIn, readSignedCookieIn, } from "./session-cookie-core.js";
/** Grava um token de sessão (ver `signed-session`) num cookie httpOnly seguro. */
export declare function setSignedCookie(name: string, token: string, maxAgeMs: number, request?: RequestLike): Promise<void>;
export declare function clearSignedCookie(name: string): Promise<void>;
export declare function readSignedCookie(name: string): Promise<string | undefined>;
