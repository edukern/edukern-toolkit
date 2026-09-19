import { randomUUID } from "node:crypto";

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
};

function toUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Link "adicionar ao Google Calendar" pré-preenchido — mesmo truque do
 * `whatsapp-link`: URL pública sem API/OAuth, quem clica só confirma e salva.
 */
export function buildGoogleCalendarLink(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toUtcStamp(event.start)}/${toUtcStamp(event.end)}`,
  });
  if (event.description) params.set("details", event.description);
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/**
 * Gera um arquivo `.ics` (RFC 5545) pra quem usa Outlook/Apple Calendar em vez
 * do Google — cobre o caso que o link acima não cobre. `UID`/`DTSTAMP` são
 * campos obrigatórios da spec (não são enfeite): sem eles, alguns clientes de
 * calendário rejeitam ou duplicam o evento silenciosamente.
 */
export function buildIcsFile(event: CalendarEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${randomUUID()}@edukern-toolkit`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(event.start)}`,
    `DTEND:${toUtcStamp(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : "",
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.filter(Boolean).join("\r\n") + "\r\n";
}
