import { test } from "node:test";
import assert from "node:assert/strict";
import { jwtVerify } from "jose";
import { signTenantToken } from "./sign-tenant-token.js";

process.env.TEST_JWT_SECRET = "segredo-jwt-de-teste-bem-longo-o-suficiente";
const secret = new TextEncoder().encode("segredo-jwt-de-teste-bem-longo-o-suficiente");

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
