import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveSecureCookieOption } from "./secure-cookie-option.js";

function fakeRequest(proto: string | null, forwardedProto?: string) {
  return {
    headers: { get: (name: string) => (name === "x-forwarded-proto" ? (forwardedProto ?? null) : null) },
    protocol: proto ?? undefined,
  };
}

test("override AUTH_COOKIE_SECURE=true vence qualquer coisa", () => {
  process.env.AUTH_COOKIE_SECURE = "true";
  assert.equal(resolveSecureCookieOption(fakeRequest("http:")), true);
  delete process.env.AUTH_COOKIE_SECURE;
});

test("override AUTH_COOKIE_SECURE=false vence qualquer coisa", () => {
  process.env.AUTH_COOKIE_SECURE = "false";
  assert.equal(resolveSecureCookieOption(fakeRequest("https:")), false);
  delete process.env.AUTH_COOKIE_SECURE;
});

test("sem override, usa x-forwarded-proto quando presente", () => {
  assert.equal(resolveSecureCookieOption(fakeRequest("http:", "https")), true);
  assert.equal(resolveSecureCookieOption(fakeRequest("https:", "http")), false);
});

test("sem forwarded-proto, cai pro protocol da request", () => {
  assert.equal(resolveSecureCookieOption(fakeRequest("https:")), true);
  assert.equal(resolveSecureCookieOption(fakeRequest("http:")), false);
});

test("sem request nenhuma, cai pro NODE_ENV", () => {
  const original = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  assert.equal(resolveSecureCookieOption(), true);
  process.env.NODE_ENV = "development";
  assert.equal(resolveSecureCookieOption(), false);
  process.env.NODE_ENV = original;
});
