import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidCpf, normalizeCpf } from "./cpf.js";

test("accepts a valid CPF", () => {
  assert.equal(isValidCpf("111.444.777-35"), true);
});

test("rejects wrong check digits", () => {
  assert.equal(isValidCpf("111.444.777-36"), false);
});

test("rejects repeated-digit sequences despite passing the check-digit math", () => {
  assert.equal(isValidCpf("111.111.111-11"), false);
  assert.equal(isValidCpf("000.000.000-00"), false);
});

test("rejects wrong length", () => {
  assert.equal(isValidCpf("123.456.789"), false);
});

test("normalizeCpf strips formatting", () => {
  assert.equal(normalizeCpf("111.444.777-35"), "11144477735");
});
