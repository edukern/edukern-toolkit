/** Valida CPF pelo dígito verificador (módulo 11) — aceita com ou sem formatação. */
export declare function isValidCpf(value: string): boolean;
export declare function formatCpf(value: string): string;
/**
 * Valida CNPJ pelo dígito verificador. Peso cíclico (2..9, repete) é diferente
 * do CPF (peso linear sem repetir) — não dá pra compartilhar a mesma função de
 * checksum entre os dois, mesmo parecendo o mesmo problema.
 */
export declare function isValidCnpj(value: string): boolean;
export declare function formatCnpj(value: string): string;
/** Formata telefone BR (10 dígitos = fixo, 11 = celular), com ou sem DDD já incluso no input. */
export declare function formatBrPhone(value: string): string;
