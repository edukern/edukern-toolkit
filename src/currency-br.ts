/**
 * Formata um valor em reais sem depender do locale ICU instalado no
 * runtime. `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'})`
 * pode formatar errado (ou lançar) num Node com build "small-icu" — comum em
 * Windows/containers mínimos, que só traz o locale en-US por padrão.
 * Achado real: `financeiro-ponto-e/src/lib/formato.ts` já evitava `Intl` por
 * esse motivo exato; esta função segue a mesma estratégia (string, não
 * `Intl`).
 */
export function formatBRL(value: number): string {
  const negative = value < 0;
  const abs = Math.abs(value).toFixed(2);
  const [integer, cents] = abs.split(".");
  const withThousands = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${negative ? "-" : ""}${withThousands},${cents}`;
}
