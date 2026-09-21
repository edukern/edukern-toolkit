import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "./password-hash.js";

test("hash e verify fazem roundtrip", async () => {
  const hash = await hashPassword("segredo123");
  assert.equal(await verifyPassword("segredo123", hash), true);
});

test("senha errada não verifica", async () => {
  const hash = await hashPassword("segredo123");
  assert.equal(await verifyPassword("outra-coisa", hash), false);
});

test("hash ausente não verifica, mas ainda roda bcrypt.compare (não retorna na hora)", async () => {
  const start = Date.now();
  const result = await verifyPassword("qualquer-coisa", null);
  const elapsed = Date.now() - start;
  assert.equal(result, false);
  assert.ok(elapsed >= 5, `deveria gastar tempo de bcrypt (cost 10), levou ${elapsed}ms`);
});

test("hash vazio também não verifica", async () => {
  assert.equal(await verifyPassword("x", ""), false);
});

test("dois hashes da mesma senha são diferentes (salt aleatório)", async () => {
  const h1 = await hashPassword("segredo123");
  const h2 = await hashPassword("segredo123");
  assert.notEqual(h1, h2);
});
