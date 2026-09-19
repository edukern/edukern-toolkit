import { test } from "node:test";
import assert from "node:assert/strict";
import { timingSafeStringEqual } from "./timing-safe-compare.js";

test("strings iguais comparam true", () => {
  assert.equal(timingSafeStringEqual("segredo123", "segredo123"), true);
});

test("strings diferentes comparam false", () => {
  assert.equal(timingSafeStringEqual("segredo123", "outra-coisa"), false);
});

test("tamanhos diferentes não quebram (hash equaliza o tamanho)", () => {
  assert.equal(timingSafeStringEqual("a", "muito-mais-longa-que-a"), false);
});
