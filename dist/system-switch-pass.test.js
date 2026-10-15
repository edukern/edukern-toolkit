import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { assinarPasse, verificarPasse, segredoDoEnv, origemSegura } from "./system-switch-pass.js";
const SEGREDO = "s".repeat(40);
const AGORA = 1_800_000_000_000;
function cru(dados, segredo = SEGREDO) {
    const payload = Buffer.from(JSON.stringify(dados)).toString("base64url");
    return `${payload}.${createHmac("sha256", segredo).update(payload).digest("hex")}`;
}
const base = { u: "id-no-destino", aud: "rh", jti: "0123456789abcdef0123", exp: AGORA + 60_000, v: "http://10.0.0.5:3500/x" };
test("ida e volta: o que assinarPasse gera, verificarPasse aceita", () => {
    const p = verificarPasse(assinarPasse({ usuarioId: 7, aud: "rh", volta: "http://10.0.0.5:3500/menu" }, SEGREDO, AGORA), SEGREDO, "rh", AGORA);
    assert.equal(p?.usuarioId, 7);
    assert.equal(p?.volta, "http://10.0.0.5:3500");
    assert.equal(p?.exp, AGORA + 60_000);
});
test("cada passe tem jti próprio", () => {
    const jti = (t) => JSON.parse(Buffer.from(t.split(".")[0], "base64url").toString()).jti;
    const dados = { usuarioId: 1, aud: "rh", volta: "http://x" };
    assert.notEqual(jti(assinarPasse(dados, SEGREDO)), jti(assinarPasse(dados, SEGREDO)));
});
test("assinatura errada, adulterada ou de outro segredo é recusada", () => {
    assert.equal(verificarPasse(cru(base, "t".repeat(40)), SEGREDO, "rh", AGORA), null);
    const [payload] = cru(base).split(".");
    assert.equal(verificarPasse(`${payload}.${"0".repeat(64)}`, SEGREDO, "rh", AGORA), null);
    const sig = cru(base).split(".")[1];
    const outro = Buffer.from(JSON.stringify({ ...base, u: "outra-pessoa" })).toString("base64url");
    assert.equal(verificarPasse(`${outro}.${sig}`, SEGREDO, "rh", AGORA), null);
});
test("vencido ou longe demais no futuro é recusado", () => {
    assert.equal(verificarPasse(cru(base), SEGREDO, "rh", base.exp + 1), null);
    assert.equal(verificarPasse(cru({ ...base, exp: AGORA + 121_000 }), SEGREDO, "rh", AGORA), null);
});
test("passe de outro destino não vale", () => {
    assert.equal(verificarPasse(cru(base), SEGREDO, "estoque", AGORA), null);
    assert.equal(verificarPasse(cru({ c: 8, exp: AGORA + 60_000 }), SEGREDO, "rh", AGORA), null);
});
test("volta perigosa é recusada", () => {
    for (const v of ["javascript:alert(1)", "data:text/html,x", "https://x@golpe.com", "ftp://a", "nada"]) {
        assert.equal(verificarPasse(cru({ ...base, v }), SEGREDO, "rh", AGORA), null, v);
    }
});
test("sem segredo, sem jti ou lixo: recusa", () => {
    assert.equal(verificarPasse(cru(base), null, "rh", AGORA), null);
    assert.equal(verificarPasse(cru({ ...base, jti: undefined }), SEGREDO, "rh", AGORA), null);
    assert.equal(verificarPasse("a.b.c", SEGREDO, "rh", AGORA), null);
    assert.equal(verificarPasse(undefined, SEGREDO, "rh", AGORA), null);
});
test("segredoDoEnv exige 32+ e origemSegura tira caminho", () => {
    assert.equal(segredoDoEnv("X", {}), null);
    assert.equal(segredoDoEnv("X", { X: "curto" }), null);
    assert.equal(segredoDoEnv("X", { X: SEGREDO }), SEGREDO);
    assert.equal(origemSegura("https://a.com/b?c=1"), "https://a.com");
});
