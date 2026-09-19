import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchAddressByCep } from "./cep-lookup.js";
const originalFetch = globalThis.fetch;
test.after(() => {
    globalThis.fetch = originalFetch;
});
test("retorna o endereço quando o CEP existe", async () => {
    globalThis.fetch = (async () => new Response(JSON.stringify({ cep: "01310-100", logradouro: "Avenida Paulista", bairro: "Bela Vista", localidade: "São Paulo", uf: "SP" })));
    assert.deepEqual(await fetchAddressByCep("01310-100"), {
        cep: "01310-100",
        street: "Avenida Paulista",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
    });
});
test("retorna null quando o ViaCEP responde {erro: true}", async () => {
    globalThis.fetch = (async () => new Response(JSON.stringify({ erro: true })));
    assert.equal(await fetchAddressByCep("00000000"), null);
});
test("lança se a resposta HTTP não for ok", async () => {
    globalThis.fetch = (async () => new Response("", { status: 500 }));
    await assert.rejects(() => fetchAddressByCep("01310100"));
});
test("lança se o CEP não tiver 8 dígitos", async () => {
    await assert.rejects(() => fetchAddressByCep("123"));
});
