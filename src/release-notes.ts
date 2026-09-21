/** Categorias fixas da tela "Novidades" (mesmas do changelog do Claude: Novo / Aprimorado / Corrigido). */
export const RELEASE_NOTE_KINDS = ["novo", "aprimorado", "corrigido"] as const;
export type ReleaseNoteKind = (typeof RELEASE_NOTE_KINDS)[number];

/** Uma versão publicada. `date` em ISO (`YYYY-MM-DD`); cada categoria é uma lista de frases voltadas ao usuário final. */
export type ReleaseNote = {
  date: string;
  version?: string;
} & Partial<Record<ReleaseNoteKind, string[]>>;

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** Mais recente primeiro. ISO compara como string, então não depende de `Date`/fuso. Não muta o array de entrada. */
export function sortReleaseNotes(notes: readonly ReleaseNote[]): ReleaseNote[] {
  return [...notes].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * `2026-09-18` -> `18 de setembro de 2026`. Não usa `Intl.DateTimeFormat` de
 * propósito: num Node com ICU mínimo (comum em Windows/containers) pode sair
 * em inglês ou lançar — mesmo motivo de `currency-br`.
 */
export function formatDatePtBR(isoDate: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  const mes = m ? MESES[Number(m[2]) - 1] : undefined;
  if (!m || !mes) throw new Error(`data inválida: ${isoDate}`);
  return `${Number(m[3])} de ${mes} de ${m[1]}`;
}

/** Quantas versões são posteriores à última visita (`lastSeenDate` ISO, ou `null` se nunca abriu). Alimenta a bolinha "novo" do menu. */
export function countUnseen(notes: readonly ReleaseNote[], lastSeenDate: string | null): number {
  return lastSeenDate === null ? notes.length : notes.filter((n) => n.date > lastSeenDate).length;
}
