export type TenantTokenOptions = {
    jwtSecretEnvVar?: string;
    tenantClaim?: string;
};
/**
 * JWT curto (60s) com a claim de tenant e `role: "authenticated"`, pra um client Supabase
 * assumir esse header e a policy de RLS isolar por tenant (ver `supabase-tenant-client.ts`).
 * Fail-closed: lança se faltar `tenantId` (nunca assina um token "vazio" que vazaria entre
 * tenants).
 */
export declare function signTenantToken(tenantId: string, options?: TenantTokenOptions): Promise<string>;
