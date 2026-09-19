export type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
};
/**
 * Link "adicionar ao Google Calendar" pré-preenchido — mesmo truque do
 * `whatsapp-link`: URL pública sem API/OAuth, quem clica só confirma e salva.
 */
export declare function buildGoogleCalendarLink(event: CalendarEvent): string;
/**
 * Gera um arquivo `.ics` (RFC 5545) pra quem usa Outlook/Apple Calendar em vez
 * do Google — cobre o caso que o link acima não cobre. `UID`/`DTSTAMP` são
 * campos obrigatórios da spec (não são enfeite): sem eles, alguns clientes de
 * calendário rejeitam ou duplicam o evento silenciosamente.
 */
export declare function buildIcsFile(event: CalendarEvent): string;
