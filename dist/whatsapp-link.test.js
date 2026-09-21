import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizePhoneBR, buildWhatsAppLink } from "./whatsapp-link.js";
test("prepends 55 to an 11-digit DDD+number", () => {
    assert.equal(normalizePhoneBR("11999999999"), "5511999999999");
});
test("prepends 55 to a 10-digit DDD+number", () => {
    assert.equal(normalizePhoneBR("1133334444"), "551133334444");
});
test("DDD 55 (Santa Maria/RS) still gets the DDI prefix, not skipped", () => {
    assert.equal(normalizePhoneBR("55999999999"), "5555999999999");
});
test("leaves an already-DDI number untouched", () => {
    assert.equal(normalizePhoneBR("5511999999999"), "5511999999999");
});
test("strips formatting characters before counting digits", () => {
    assert.equal(normalizePhoneBR("(11) 99999-9999"), "5511999999999");
});
test("builds a link with URL-encoded message", () => {
    assert.equal(buildWhatsAppLink("11999999999", "Oi! Tudo bem?"), "https://wa.me/5511999999999?text=Oi!%20Tudo%20bem%3F");
});
test("builds a link without message when omitted", () => {
    assert.equal(buildWhatsAppLink("11999999999"), "https://wa.me/5511999999999");
});
