import { test } from "node:test";
import assert from "node:assert/strict";
import { getServiceClient } from "./supabase-client-core.js";
test("lança se URL ou key não existirem", () => {
    delete process.env.TEST_SB_CORE_URL;
    delete process.env.TEST_SB_CORE_KEY;
    assert.throws(() => getServiceClient("TEST_SB_CORE_URL", "TEST_SB_CORE_KEY"));
});
test("cacheia o client pro mesmo par url+key", () => {
    process.env.TEST_SB_CORE_URL = "https://example.supabase.co";
    process.env.TEST_SB_CORE_KEY = "chave-fake-de-teste";
    const a = getServiceClient("TEST_SB_CORE_URL", "TEST_SB_CORE_KEY");
    const b = getServiceClient("TEST_SB_CORE_URL", "TEST_SB_CORE_KEY");
    assert.equal(a, b);
});
test("key diferente gera client diferente (cache não colide)", () => {
    process.env.TEST_SB_CORE_URL = "https://example.supabase.co";
    process.env.TEST_SB_CORE_KEY = "chave-fake-de-teste";
    process.env.TEST_SB_CORE_KEY2 = "outra-chave-fake";
    const a = getServiceClient("TEST_SB_CORE_URL", "TEST_SB_CORE_KEY");
    const b = getServiceClient("TEST_SB_CORE_URL", "TEST_SB_CORE_KEY2");
    assert.notEqual(a, b);
});
