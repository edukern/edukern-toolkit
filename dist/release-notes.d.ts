/** Categorias fixas da tela "Novidades" (mesmas do changelog do Claude: Novo / Aprimorado / Corrigido). */
export declare const RELEASE_NOTE_KINDS: readonly ["novo", "aprimorado", "corrigido"];
export type ReleaseNoteKind = (typeof RELEASE_NOTE_KINDS)[number];
/** Uma versão publicada. `date` em ISO (`YYYY-MM-DD`); cada categoria é uma lista de frases voltadas ao usuário final. */
export type ReleaseNote = {
    date: string;
    version?: string;
} & Partial<Record<ReleaseNoteKind, string[]>>;
/** Mais recente primeiro. ISO compara como string, então não depende de `Date`/fuso. Não muta o array de entrada. */
export declare function sortReleaseNotes(notes: readonly ReleaseNote[]): ReleaseNote[];
/**
 * `2026-09-18` -> `18 de setembro de 2026`. Não usa `Intl.DateTimeFormat` de
 * propósito: num Node com ICU mínimo (comum em Windows/containers) pode sair
 * em inglês ou lançar — mesmo motivo de `currency-br`.
 */
export declare function formatDatePtBR(isoDate: string): string;
/** Quantas versões são posteriores à última visita (`lastSeenDate` ISO, ou `null` se nunca abriu). Alimenta a bolinha "novo" do menu. */
export declare function countUnseen(notes: readonly ReleaseNote[], lastSeenDate: string | null): number;
