/** Normaliza um CPF pra só dígitos. */
export declare function normalizeCpf(cpf: string): string;
/**
 * Valida CPF pelo algoritmo padrão de dígito verificador. Rejeita sequências
 * repetidas (111.111.111-11, 000.000.000-00 etc.) — passam na conta do
 * dígito verificador, mas nunca são CPF real.
 */
export declare function isValidCpf(cpf: string): boolean;
