import { test } from "node:test";
import assert from "node:assert/strict";
import { sortReleaseNotes, formatDatePtBR, countUnseen, type ReleaseNote } from "./release-notes.js";

const notes: ReleaseNote[] = [
  { date: "2026-09-10", novo: ["a"] },
  { date: "2026-09-18", corrigido: ["b"] },
  { date: "2026-09-15", version: "1.1.0", aprimorado: ["c"] },
];

test("sorts newest first without mutating the input", () => {
  assert.deepEqual(sortReleaseNotes(notes).map((n) => n.date), ["2026-09-18", "2026-09-15", "2026-09-10"]);
  assert.equal(notes[0]!.date, "2026-09-10");
});

test("formats pt-BR without Intl, dropping the leading zero", () => {
  assert.equal(formatDatePtBR("2026-09-08"), "8 de setembro de 2026");
  assert.equal(formatDatePtBR("2026-03-30"), "30 de março de 2026");
});

test("rejects malformed dates", () => {
  assert.throws(() => formatDatePtBR("18/09/2026"));
  assert.throws(() => formatDatePtBR("2026-13-01"));
});

test("counts only versions after the last visit", () => {
  assert.equal(countUnseen(notes, "2026-09-15"), 1);
  assert.equal(countUnseen(notes, "2026-09-18"), 0);
  assert.equal(countUnseen(notes, null), 3);
});
