import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidCpf, formatCpf, isValidCnpj, formatCnpj, formatBrPhone } from "./br-formatters.js";

test("CPF válido (com e sem formatação) passa", () => {
  assert.equal(isValidCpf("11144477735"), true);
  assert.equal(isValidCpf("111.444.777-35"), true);
});

test("CPF com dígito verificador errado ou repetido falha", () => {
  assert.equal(isValidCpf("11144477736"), false);
  assert.equal(isValidCpf("11111111111"), false);
});

test("formatCpf pontua 000.000.000-00", () => {
  assert.equal(formatCpf("11144477735"), "111.444.777-35");
});

test("CNPJ válido (com e sem formatação) passa", () => {
  assert.equal(isValidCnpj("11222333000181"), true);
  assert.equal(isValidCnpj("11.222.333/0001-81"), true);
});

test("CNPJ com dígito verificador errado ou repetido falha", () => {
  assert.equal(isValidCnpj("11222333000180"), false);
  assert.equal(isValidCnpj("11111111111111"), false);
});

test("formatCnpj pontua 00.000.000/0000-00", () => {
  assert.equal(formatCnpj("11222333000181"), "11.222.333/0001-81");
});

test("formatBrPhone cobre celular (11) e fixo (10)", () => {
  assert.equal(formatBrPhone("11987654321"), "(11) 98765-4321");
  assert.equal(formatBrPhone("1133334444"), "(11) 3333-4444");
});

test("formatBrPhone lança pra quantidade de dígitos inválida", () => {
  assert.throws(() => formatBrPhone("123"));
});
