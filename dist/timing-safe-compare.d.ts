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
export declare function timingSafeStringEqual(a: string, b: string): boolean;
