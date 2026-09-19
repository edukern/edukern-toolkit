import { test } from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppLink } from "./whatsapp-link.js";

test("monta link com telefone limpo e mensagem codificada", () => {
  assert.equal(buildWhatsAppLink("11987654321", "Olá!"), "https://wa.me/11987654321?text=Ol%C3%A1!");
});

test("remove formatação do telefone (+, espaço, parênteses, traço)", () => {
  assert.equal(buildWhatsAppLink("+55 (11) 98765-4321", "oi"), "https://wa.me/5511987654321?text=oi");
});

test("lança se não sobrar nenhum dígito no telefone", () => {
  assert.throws(() => buildWhatsAppLink("abc", "oi"));
});
