import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Compara duas strings em tempo constante (hasheando antes, já que
 * timingSafeEqual exige buffers do mesmo tamanho). Use para comparar
 * segredos/códigos vindos do usuário contra um valor esperado — nunca `===`.
 *
 * Retorna `false` (não lança) se `b` não for uma string não-vazia — sem essa
 * guarda, uma variável de ambiente não configurada vira `undefined`, e
 * `.update(undefined)` lança `TypeError`, transformando "não autorizado" em
 * erro 500 (achado real: revisor-impacto 2026-09-21).
 */
export function timingSafeStringEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string" || !b) return false;
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}
