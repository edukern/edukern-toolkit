import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/**
 * Passe para trocar de sistema já logado (botão "RH" no financeiro, "Recompra" no estoque).
 * Formato `<payload base64url>.<hmac-sha256 hex>`, payload `{u, aud, jti, exp, v}`:
 * - `u`: id do usuário NO DESTINO (o mapa origem→destino é explícito, nunca por nome);
 * - `aud`: nome do destino — com segredo próprio por destino, passe de um nunca vale no outro;
 * - `jti`: o destino queima no primeiro uso (ver `docs/switcher-entre-sistemas.md`);
 * - `v`: origem de volta para o botão "Voltar" (só http/https, só a origem).
 * Extraído de financeiro-ponto-e (`/ir/rh`) + rh-pontoe (`/api/auth/painel`), 15/10/2026.
 */
export type PasseVerificado = { usuarioId: string | number; jti: string; exp: number; volta: string };

const VALIDADE_MS = 60_000;
const FOLGA_MAX_MS = 120_000;

/** Segredo do env com mínimo de 32 caracteres; null = recusar tudo (nunca aceitar passe sem segredo). */
export function segredoDoEnv(nome: string, env: Record<string, string | undefined> = process.env): string | null {
  const s = env[nome];
  return s && s.length >= 32 ? s : null;
}

/** Só a origem http(s), sem caminho nem usuário — o que pode virar href do "Voltar". */
export function origemSegura(url: unknown): string | null {
  if (typeof url !== "string") return null;
  try {
    const u = new URL(url);
    if ((u.protocol !== "http:" && u.protocol !== "https:") || u.username || u.password) return null;
    return u.origin;
  } catch {
    return null;
  }
}

export function assinarPasse(
  dados: { usuarioId: string | number; aud: string; volta: string },
  segredo: string,
  agoraMs = Date.now()
): string {
  const payload = Buffer.from(
    JSON.stringify({ u: dados.usuarioId, aud: dados.aud, jti: randomUUID(), exp: agoraMs + VALIDADE_MS, v: dados.volta })
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", segredo).update(payload).digest("hex")}`;
}

/** Confere assinatura, destino, validade (no máx. 120s à frente) e forma. Não queima o jti: isso é do destino. */
export function verificarPasse(
  token: unknown,
  segredo: string | null,
  aud: string,
  agoraMs = Date.now()
): PasseVerificado | null {
  if (!segredo || typeof token !== "string") return null;
  const partes = token.split(".");
  if (partes.length !== 2 || !partes[0] || !partes[1]) return null;
  const [payload, sig] = partes;
  const esperado = Buffer.from(createHmac("sha256", segredo).update(payload).digest("hex"));
  const veio = Buffer.from(sig);
  if (veio.length !== esperado.length || !timingSafeEqual(veio, esperado)) return null;
  let p: Record<string, unknown>;
  try {
    p = JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
  if (p?.aud !== aud) return null;
  const exp = p.exp;
  if (typeof exp !== "number" || !Number.isInteger(exp) || exp < agoraMs || exp > agoraMs + FOLGA_MAX_MS) return null;
  const jti = p.jti;
  if (typeof jti !== "string" || jti.length < 16 || jti.length > 64) return null;
  const u = p.u;
  if (!(typeof u === "string" || (typeof u === "number" && Number.isInteger(u)))) return null;
  if (String(u).length === 0 || String(u).length > 64) return null;
  const volta = origemSegura(p.v);
  if (!volta) return null;
  return { usuarioId: u, jti, exp, volta };
}
