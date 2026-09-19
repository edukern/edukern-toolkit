import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPixCopyPaste } from "./pix-copy-paste.js";
test("payload é TLV bem formado terminando em 63 + CRC de 4 hex", () => {
    const payload = buildPixCopyPaste({ pixKey: "11144477735", merchantName: "Fulano de Tal", merchantCity: "BRASILIA" });
    assert.match(payload, /^00020101021126330014BR\.GOV\.BCB\.PIX0111111444777355204000053039865802BR5913Fulano de Tal6008BRASILIA62070503\*\*\*6304[0-9A-F]{4}$/);
});
test("CRC é autoconsistente (recalculado bate com o final do payload)", () => {
    const payload = buildPixCopyPaste({ pixKey: "chave-pix@exemplo.com", merchantName: "Loja X", merchantCity: "SAO PAULO", amount: 10 });
    const withoutCrc = payload.slice(0, -4);
    const crc = payload.slice(-4);
    let acc = 0xffff;
    for (let i = 0; i < withoutCrc.length; i++) {
        acc ^= withoutCrc.charCodeAt(i) << 8;
        for (let bit = 0; bit < 8; bit++)
            acc = acc & 0x8000 ? ((acc << 1) ^ 0x1021) & 0xffff : (acc << 1) & 0xffff;
    }
    assert.equal(crc, acc.toString(16).toUpperCase().padStart(4, "0"));
});
test("inclui valor formatado com 2 casas quando amount é passado", () => {
    const payload = buildPixCopyPaste({ pixKey: "11144477735", merchantName: "Loja", merchantCity: "SP", amount: 10 });
    assert.ok(payload.includes("540510.00"));
});
test("nome e cidade são truncados no limite do campo EMV (25 / 15 chars)", () => {
    const longName = "Nome de Comerciante Muito Muito Longo";
    const longCity = "Cidade Extremamente Longa Demais";
    const payload = buildPixCopyPaste({ pixKey: "11144477735", merchantName: longName, merchantCity: longCity });
    assert.ok(payload.includes(`5925${longName.slice(0, 25)}`));
    assert.ok(payload.includes(`6015${longCity.slice(0, 15)}`));
});
test("CRC16/CCITT-FALSE bate com o vetor de teste padrão da indústria", () => {
    // "123456789" -> 0x29B1 é o valor de referência publicado pra essa variante do CRC16.
    const withoutCrc = "123456789";
    let acc = 0xffff;
    for (let i = 0; i < withoutCrc.length; i++) {
        acc ^= withoutCrc.charCodeAt(i) << 8;
        for (let bit = 0; bit < 8; bit++)
            acc = acc & 0x8000 ? ((acc << 1) ^ 0x1021) & 0xffff : (acc << 1) & 0xffff;
    }
    assert.equal(acc.toString(16).toUpperCase().padStart(4, "0"), "29B1");
});
test("lança sem pixKey/merchantName/merchantCity", () => {
    assert.throws(() => buildPixCopyPaste({ pixKey: "", merchantName: "X", merchantCity: "Y" }));
    assert.throws(() => buildPixCopyPaste({ pixKey: "x", merchantName: "", merchantCity: "Y" }));
    assert.throws(() => buildPixCopyPaste({ pixKey: "x", merchantName: "X", merchantCity: "" }));
});
