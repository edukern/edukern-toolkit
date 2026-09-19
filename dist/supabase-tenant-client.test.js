import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { jwtVerify } from "jose";
import { signTenantToken } from "./sign-tenant-token.js";
process.env.TEST_JWT_SECRET = "segredo-jwt-de-teste-bem-longo-o-suficiente";
const secret = new TextEncoder().encode("segredo-jwt-de-teste-bem-longo-o-suficiente");
// createTenantClient importa "server-only", que lança fora do bundler do
// Next por design — mockar como no-op aqui não desliga a proteção real
// (session-cookie.ts, supabase-client.ts continuam guardados em produção),
// só permite testar a lógica de criação do client isoladamente.
mock.module("server-only", {});
const { createTenantClient } = await import("./supabase-tenant-client.js");
test("lança fail-closed se tenantId estiver vazio", async () => {
    await assert.rejects(() => signTenantToken(""));
});
test("assina um JWT com a claim de tenant e expira em ~60s", async () => {
    const token = await signTenantToken("empresa-123", { jwtSecretEnvVar: "TEST_JWT_SECRET" });
    const { payload } = await jwtVerify(token, secret, { audience: "authenticated" });
    assert.equal(payload.tenant_id, "empresa-123");
    assert.equal(payload.role, "authenticated");
    assert.ok((payload.exp ?? 0) - (payload.iat ?? 0) <= 61);
});
test("usa o nome da claim customizado quando passado", async () => {
    const token = await signTenantToken("empresa-456", {
        jwtSecretEnvVar: "TEST_JWT_SECRET",
        tenantClaim: "empresa_id",
    });
    const { payload } = await jwtVerify(token, secret, { audience: "authenticated" });
    assert.equal(payload.empresa_id, "empresa-456");
});
test("lança se o segredo JWT não existir", async () => {
    await assert.rejects(() => signTenantToken("empresa-789", { jwtSecretEnvVar: "SEGREDO_QUE_NAO_EXISTE" }));
});
test("createTenantClient cria o client sem lançar, dado env+tenantId válidos", async () => {
    process.env.TEST_SB_URL = "https://example.supabase.co";
    process.env.TEST_SB_ANON = "anon-fake-key";
    const client = await createTenantClient("empresa-999", {
        jwtSecretEnvVar: "TEST_JWT_SECRET",
        urlEnvVar: "TEST_SB_URL",
        anonKeyEnvVar: "TEST_SB_ANON",
    });
    assert.ok(client);
});
test("createTenantClient lança se faltar URL ou anon key", async () => {
    await assert.rejects(() => createTenantClient("empresa-1", {
        jwtSecretEnvVar: "TEST_JWT_SECRET",
        urlEnvVar: "TEST_SB_URL_QUE_NAO_EXISTE",
        anonKeyEnvVar: "TEST_SB_ANON_QUE_NAO_EXISTE",
    }));
});
