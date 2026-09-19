/**
 * Monta um link `wa.me` que abre o WhatsApp do destinatário com uma mensagem
 * pré-preenchida — sem precisar da API paga do WhatsApp Business. `phone` aceita
 * qualquer formatação (`+55 (11) 91234-5678`, etc.); só os dígitos importam pro
 * wa.me, que exige código do país + número sem `+`, espaço ou traço.
 */
export function buildWhatsAppLink(phone, message) {
    const digits = phone.replace(/\D/g, "");
    if (!digits)
        throw new Error("buildWhatsAppLink() exige phone com ao menos um dígito");
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
