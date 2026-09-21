function onlyDigits(value: string): string {
  return String(value ?? "").replace(/\D/g, "");
}

function checkDigit(base: string): number {
  let sum = 0;
  let weight = base.length + 1;
  for (let i = 0; i < base.length; i++) {
    sum += parseInt(base[i], 10) * weight;
    weight--;
  }
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

/** Normaliza um CPF pra só dígitos. */
export function normalizeCpf(cpf: string): string {
  return onlyDigits(cpf);
}

/**
 * Valida CPF pelo algoritmo padrão de dígito verificador. Rejeita sequências
 * repetidas (111.111.111-11, 000.000.000-00 etc.) — passam na conta do
 * dígito verificador, mas nunca são CPF real.
 */
export function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  const d1 = checkDigit(digits.slice(0, 9));
  const d2 = checkDigit(digits.slice(0, 9) + String(d1));
  return digits[9] === String(d1) && digits[10] === String(d2);
}
