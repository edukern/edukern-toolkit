import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Compara duas strings em tempo constante (hasheando antes, já que
 * timingSafeEqual exige buffers do mesmo tamanho). Use para comparar
 * segredos/códigos vindos do usuário contra um valor esperado — nunca `===`.
 */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}
