import "server-only";
import { type SupabaseClient } from "@supabase/supabase-js";
import { type TenantTokenOptions } from "./sign-tenant-token.js";
export { signTenantToken, type TenantTokenOptions } from "./sign-tenant-token.js";
type TenantClientOptions = TenantTokenOptions & {
    urlEnvVar?: string;
    anonKeyEnvVar?: string;
};
/**
 * Cliente Supabase com escopo de UM tenant via RLS: usa `signTenantToken` como header
 * `Authorization`, que o PostgREST expõe em `request.jwt.claims` — sua policy de RLS lê a claim
 * pra isolar linhas por tenant. NÃO usa `SET LOCAL` (não sobrevive a um connection pooler, ex.
 * Supabase em modo transaction/PgBouncer).
 */
export declare function createTenantClient(tenantId: string, options?: TenantClientOptions): Promise<SupabaseClient>;
