import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGoogleCalendarLink, buildIcsFile } from "./calendar-invite.js";
const event = {
    title: "Entrevista, fase 1",
    start: new Date("2026-10-01T13:00:00Z"),
    end: new Date("2026-10-01T13:30:00Z"),
    description: "Traga documento com foto.",
    location: "Sala 3",
};
test("link do Google Calendar tem action=TEMPLATE e datas em UTC", () => {
    const url = new URL(buildGoogleCalendarLink(event));
    assert.equal(url.origin + url.pathname, "https://calendar.google.com/calendar/render");
    assert.equal(url.searchParams.get("action"), "TEMPLATE");
    assert.equal(url.searchParams.get("dates"), "20261001T130000Z/20261001T133000Z");
    assert.equal(url.searchParams.get("details"), event.description);
    assert.equal(url.searchParams.get("location"), event.location);
});
test("link sem description/location omite esses parâmetros", () => {
    const url = new URL(buildGoogleCalendarLink({ title: "X", start: event.start, end: event.end }));
    assert.equal(url.searchParams.has("details"), false);
    assert.equal(url.searchParams.has("location"), false);
});
test(".ics tem BEGIN/END VCALENDAR e VEVENT, com UID e DTSTAMP", () => {
    const ics = buildIcsFile(event);
    assert.match(ics, /^BEGIN:VCALENDAR\r\nVERSION:2\.0\r\nBEGIN:VEVENT\r\n/);
    assert.match(ics, /UID:[^\r\n]+@edukern-toolkit\r\n/);
    assert.match(ics, /DTSTAMP:\d{8}T\d{6}Z\r\n/);
    assert.match(ics, /DTSTART:20261001T130000Z\r\n/);
    assert.match(ics, /DTEND:20261001T133000Z\r\n/);
    assert.match(ics, /END:VEVENT\r\nEND:VCALENDAR\r\n$/);
});
test(".ics escapa vírgula/ponto-e-vírgula no título (RFC 5545)", () => {
    const ics = buildIcsFile(event);
    assert.match(ics, /SUMMARY:Entrevista\\, fase 1/);
});
