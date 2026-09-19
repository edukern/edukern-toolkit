import { SignJWT } from "jose";
const secretCache = new Map();
function getSecret(secretEnvVar) {
    const cached = secretCache.get(secretEnvVar);
    if (cached)
        return cached;
    const s = process.env[secretEnvVar];
    if (!s)
        throw new Error(`${secretEnvVar} ausente — exigido pra assinar token de tenant`);
    const encoded = new TextEncoder().encode(s);
    secretCache.set(secretEnvVar, encoded);
    return encoded;
}
/**
 * JWT curto (60s) com a claim de tenant e `role: "authenticated"`, pra um client Supabase
 * assumir esse header e a policy de RLS isolar por tenant (ver `supabase-tenant-client.ts`).
 * Fail-closed: lança se faltar `tenantId` (nunca assina um token "vazio" que vazaria entre
 * tenants).
 */
export async function signTenantToken(tenantId, options = {}) {
    if (!tenantId) {
        throw new Error("signTenantToken() exige tenantId — fail-closed pra não vazar entre tenants");
    }
    const { jwtSecretEnvVar = "SUPABASE_JWT_SECRET", tenantClaim = "tenant_id" } = options;
    const now = Math.floor(Date.now() / 1000);
    return new SignJWT({ [tenantClaim]: tenantId, role: "authenticated" })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt(now)
        .setExpirationTime(now + 60)
        .setAudience("authenticated")
        .sign(getSecret(jwtSecretEnvVar));
}
