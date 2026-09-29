import { test } from "node:test";
import assert from "node:assert/strict";
import { createInvite, inviteStatus, inviteUrl } from "./invite-link.js";
const AGORA = new Date("2026-09-29T12:00:00Z");
const DEPOIS = "2026-09-30T12:00:00Z";
const ANTES = "2026-09-28T12:00:00Z";
test("builds the invite URL from the origin", () => {
    assert.equal(inviteUrl("https://portal.example", "/convite", "abc"), "https://portal.example/convite/abc");
});
test("tolerates a base path with or without slashes", () => {
    assert.equal(inviteUrl("https://portal.example", "convite/", "abc"), "https://portal.example/convite/abc");
});
test("keeps the path from the origin even when the base URL has one", () => {
    assert.equal(inviteUrl("https://portal.example/admin", "/convite", "abc"), "https://portal.example/convite/abc");
});
test("percent-encodes a token with URL-unsafe characters", () => {
    assert.equal(inviteUrl("https://portal.example", "/convite", "a/b?c"), "https://portal.example/convite/a%2Fb%3Fc");
});
test("createInvite hashes the token and never returns the hash as the link", () => {
    const convite = createInvite("https://portal.example", "/convite", (t) => `hash(${t})`);
    assert.equal(convite.tokenHash, `hash(${convite.token})`);
    assert.equal(convite.url, `https://portal.example/convite/${convite.token}`);
    assert.ok(!convite.url.includes(convite.tokenHash));
});
test("two invites never share a token", () => {
    const hash = (t) => t;
    const a = createInvite("https://portal.example", "/convite", hash);
    const b = createInvite("https://portal.example", "/convite", hash);
    assert.notEqual(a.token, b.token);
    assert.ok(a.token.length >= 40);
});
test("an untouched invite inside its window is valid", () => {
    assert.equal(inviteStatus({ expires_at: DEPOIS }, AGORA), "valid");
});
test("expiry is exclusive: the exact instant is already expired", () => {
    assert.equal(inviteStatus({ expires_at: AGORA }, AGORA), "expired");
});
test("used wins over expired, so the screen never blames the clock for a used link", () => {
    assert.equal(inviteStatus({ expires_at: ANTES, used_at: ANTES }, AGORA), "used");
});
test("revoked is reported while still inside the window", () => {
    assert.equal(inviteStatus({ expires_at: DEPOIS, revoked_at: ANTES }, AGORA), "revoked");
});
test("null marks do not count as used or revoked", () => {
    assert.equal(inviteStatus({ expires_at: DEPOIS, used_at: null, revoked_at: null }, AGORA), "valid");
});
test("accepts Date as well as ISO text", () => {
    assert.equal(inviteStatus({ expires_at: new Date(DEPOIS) }, AGORA), "valid");
});
