import "server-only";
import { createClient } from "@supabase/supabase-js";
import { signTenantToken } from "./sign-tenant-token.js";
export { signTenantToken } from "./sign-tenant-token.js";
/**
 * Cliente Supabase com escopo de UM tenant via RLS: usa `signTenantToken` como header
 * `Authorization`, que o PostgREST expõe em `request.jwt.claims` — sua policy de RLS lê a claim
 * pra isolar linhas por tenant. NÃO usa `SET LOCAL` (não sobrevive a um connection pooler, ex.
 * Supabase em modo transaction/PgBouncer).
 */
export async function createTenantClient(tenantId, options = {}) {
    const { urlEnvVar = "SUPABASE_URL", anonKeyEnvVar = "SUPABASE_ANON_KEY" } = options;
    const url = process.env[urlEnvVar];
    const anonKey = process.env[anonKeyEnvVar];
    if (!url || !anonKey)
        throw new Error(`${urlEnvVar} e ${anonKeyEnvVar} são obrigatórios`);
    const token = await signTenantToken(tenantId, options);
    return createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
    });
}
