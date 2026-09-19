import { test } from "node:test";
import assert from "node:assert/strict";
import { createSignedSession } from "./signed-session.js";

process.env.TEST_SESSION_SECRET = "segredo-de-teste-bem-longo-o-suficiente";

type Payload = { role: "admin" | "user"; userId?: string };
function isValid(p: unknown): p is Payload {
  return !!p && typeof p === "object" && (p as Payload).role !== undefined &&
    ["admin", "user"].includes((p as Payload).role);
}

test("assina e verifica um payload válido", () => {
  const session = createSignedSession<Payload>("TEST_SESSION_SECRET");
  const token = session.sign({ role: "admin" });
  const result = session.verify(token, 60_000, isValid);
  assert.equal(result?.role, "admin");
});

test("rejeita assinatura adulterada", () => {
  const session = createSignedSession<Payload>("TEST_SESSION_SECRET");
  const token = session.sign({ role: "admin" });
  const [body] = token.split(".");
  const adulterado = `${body}.assinatura-forjada`;
  assert.equal(session.verify(adulterado, 60_000, isValid), null);
});

test("rejeita token expirado", async () => {
  const session = createSignedSession<Payload>("TEST_SESSION_SECRET");
  const token = session.sign({ role: "user" }, Date.now() - 120_000);
  assert.equal(session.verify(token, 60_000, isValid), null);
});

test("rejeita payload com shape inválido", () => {
  const session = createSignedSession<Payload>("TEST_SESSION_SECRET");
  const token = session.sign({ role: "admin" });
  const alwaysFalse = (_p: unknown): _p is Payload => false;
  assert.equal(session.verify(token, 60_000, alwaysFalse), null);
});

test("iatOriginal preserva o início da sessão ao reassinar", () => {
  const session = createSignedSession<Payload>("TEST_SESSION_SECRET");
  const original = Date.now() - 30_000;
  const token = session.sign({ role: "user" }, original);
  const result = session.verify(token, 60_000, isValid);
  assert.equal(result?.iat, original);
});
