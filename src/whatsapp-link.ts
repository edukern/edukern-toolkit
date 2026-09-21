/**
 * Normaliza um telefone BR pro formato do link wa.me: só dígitos, com DDI 55.
 * Decide o prefixo por CONTAGEM de dígito, não por conteúdo — checar se o
 * número já "começa com 55" erra pra qualquer DDD 55 (Santa Maria/RS): um
 * telefone local desse DDD com 10-11 dígitos já começa com "55" sem ter DDI
 * nenhum, e a checagem por conteúdo pularia o prefixo por engano.
 */
export function normalizePhoneBR(phone: string): string {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return "55" + digits;
  return digits;
}

/** Monta um link wa.me com mensagem pré-preenchida (sem pagar API do WhatsApp Business). */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const base = `https://wa.me/${normalizePhoneBR(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
