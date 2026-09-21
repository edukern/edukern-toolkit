import { test } from "node:test";
import assert from "node:assert/strict";
import { formatBRL } from "./currency-br.js";

test("formata valor simples", () => {
  assert.equal(formatBRL(1629.74), "R$ 1.629,74");
});

test("formata valor negativo", () => {
  assert.equal(formatBRL(-50), "R$ -50,00");
});

test("formata milhares", () => {
  assert.equal(formatBRL(1234567.89), "R$ 1.234.567,89");
});

test("formata zero", () => {
  assert.equal(formatBRL(0), "R$ 0,00");
});

test("completa com zero à direita quando falta casa decimal", () => {
  assert.equal(formatBRL(10.5), "R$ 10,50");
});
