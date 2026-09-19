/**
 * Monta um link `wa.me` que abre o WhatsApp do destinatário com uma mensagem
 * pré-preenchida — sem precisar da API paga do WhatsApp Business. `phone` aceita
 * qualquer formatação (`+55 (11) 91234-5678`, etc.); só os dígitos importam pro
 * wa.me, que exige código do país + número sem `+`, espaço ou traço.
 */
export declare function buildWhatsAppLink(phone: string, message: string): string;
