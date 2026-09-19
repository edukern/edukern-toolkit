function onlyDigits(value) {
    return value.replace(/\D/g, "");
}
function isRepeatedDigit(digits) {
    return /^(\d)\1+$/.test(digits);
}
function cpfCheckDigit(base) {
    let sum = 0;
    for (let i = 0; i < base.length; i++)
        sum += Number(base[i]) * (base.length + 1 - i);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
}
/** Valida CPF pelo dígito verificador (módulo 11) — aceita com ou sem formatação. */
export function isValidCpf(value) {
    const digits = onlyDigits(value);
    if (digits.length !== 11 || isRepeatedDigit(digits))
        return false;
    const base = digits.slice(0, 9);
    const d1 = cpfCheckDigit(base);
    const d2 = cpfCheckDigit(base + d1);
    return digits === `${base}${d1}${d2}`;
}
export function formatCpf(value) {
    const d = onlyDigits(value);
    if (d.length !== 11)
        throw new Error("formatCpf() exige 11 dígitos");
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}
function cnpjCheckDigit(base) {
    let sum = 0;
    let weight = 2;
    for (let i = base.length - 1; i >= 0; i--) {
        sum += Number(base[i]) * weight;
        weight = weight === 9 ? 2 : weight + 1;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
}
/**
 * Valida CNPJ pelo dígito verificador. Peso cíclico (2..9, repete) é diferente
 * do CPF (peso linear sem repetir) — não dá pra compartilhar a mesma função de
 * checksum entre os dois, mesmo parecendo o mesmo problema.
 */
export function isValidCnpj(value) {
    const digits = onlyDigits(value);
    if (digits.length !== 14 || isRepeatedDigit(digits))
        return false;
    const base = digits.slice(0, 12);
    const d1 = cnpjCheckDigit(base);
    const d2 = cnpjCheckDigit(base + d1);
    return digits === `${base}${d1}${d2}`;
}
export function formatCnpj(value) {
    const d = onlyDigits(value);
    if (d.length !== 14)
        throw new Error("formatCnpj() exige 14 dígitos");
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}
/** Formata telefone BR (10 dígitos = fixo, 11 = celular), com ou sem DDD já incluso no input. */
export function formatBrPhone(value) {
    const d = onlyDigits(value);
    if (d.length === 11)
        return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10)
        return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    throw new Error("formatBrPhone() exige 10 (fixo) ou 11 (celular) dígitos, com DDD");
}
