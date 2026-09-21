import "server-only";
import { cookies } from "next/headers";
import type { CookieStore } from "./session-cookie-core.js";
import {
  setSignedCookieIn,
  clearSignedCookieIn,
  readSignedCookieIn,
} from "./session-cookie-core.js";
import type { RequestLike } from "./secure-cookie-option.js";

export { resolveSecureCookieOption, type RequestLike } from "./secure-cookie-option.js";
export type { CookieStore, CookieSetOptions } from "./session-cookie-core.js";
export {
  setSignedCookieIn,
  clearSignedCookieIn,
  readSignedCookieIn,
} from "./session-cookie-core.js";

async function nextCookieStore(): Promise<CookieStore> {
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
export async function setSignedCookie(
  name: string,
  token: string,
  maxAgeMs: number,
  request?: RequestLike,
): Promise<void> {
  await setSignedCookieIn(await nextCookieStore(), name, token, maxAgeMs, request);
}

export async function clearSignedCookie(name: string): Promise<void> {
  await clearSignedCookieIn(await nextCookieStore(), name);
}

export async function readSignedCookie(name: string): Promise<string | undefined> {
  return readSignedCookieIn(await nextCookieStore(), name);
}
