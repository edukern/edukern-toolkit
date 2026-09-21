/**
 * Lógica de cookie de sessão sem import de framework nenhum — testável com
 * `node --test` puro. `session-cookie.ts` é a casca pra Next.js
 * (`next/headers`); um consumidor fora do Next usa isto direto, injetando o
 * próprio adapter de leitura/escrita de cookie.
 */
import type { RequestLike } from "./secure-cookie-option.js";
import { resolveSecureCookieOption } from "./secure-cookie-option.js";

export { resolveSecureCookieOption, type RequestLike } from "./secure-cookie-option.js";

/** Store mínimo de cookie que qualquer framework consegue implementar. */
export interface CookieStore {
  set(name: string, value: string, options: CookieSetOptions): void | Promise<void>;
  delete(name: string): void | Promise<void>;
  get(name: string): string | undefined | Promise<string | undefined>;
}

export interface CookieSetOptions {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  maxAge: number;
}

/** Grava um token de sessão (ver `signed-session`) num cookie httpOnly seguro. */
export async function setSignedCookieIn(
  store: CookieStore,
  name: string,
  token: string,
  maxAgeMs: number,
  request?: RequestLike,
): Promise<void> {
  await store.set(name, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: resolveSecureCookieOption(request),
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
  });
}

export async function clearSignedCookieIn(store: CookieStore, name: string): Promise<void> {
  await store.delete(name);
}

export async function readSignedCookieIn(
  store: CookieStore,
  name: string,
): Promise<string | undefined> {
  return store.get(name);
}
