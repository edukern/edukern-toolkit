import { test } from "node:test";
import assert from "node:assert/strict";
import { generateOpaqueToken, hashOpaqueToken } from "./revocable-token.js";

process.env.TEST_TOKEN_SECRET = "segredo-de-teste-bem-longo-o-suficiente";

test("gera token do tamanho esperado (base64url)", () => {
  const t = generateOpaqueToken(48);
  assert.equal(typeof t, "string");
  assert.ok(t.length > 0);
  assert.doesNotMatch(t, /[+/=]/); // base64url não usa esses caracteres
});

test("dois tokens gerados não colidem", () => {
  assert.notEqual(generateOpaqueToken(), generateOpaqueToken());
});

test("hash é determinístico pro mesmo token+segredo", () => {
  const t = generateOpaqueToken();
  assert.equal(hashOpaqueToken(t, "TEST_TOKEN_SECRET"), hashOpaqueToken(t, "TEST_TOKEN_SECRET"));
});

test("hash muda se o token muda", () => {
  assert.notEqual(
    hashOpaqueToken(generateOpaqueToken(), "TEST_TOKEN_SECRET"),
    hashOpaqueToken(generateOpaqueToken(), "TEST_TOKEN_SECRET"),
  );
});

test("lança se o segredo não existir", () => {
  assert.throws(() => hashOpaqueToken("x", "TOKEN_SECRET_QUE_NAO_EXISTE"));
});
