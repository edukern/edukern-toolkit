import "server-only";
import { type SupabaseClient } from "@supabase/supabase-js";
/**
 * Cliente Supabase com service-role key, cacheado por par (url, key). Só chame
 * do lado do servidor (rota de API, Server Action, Server Component) — a
 * service-role key ignora RLS.
 */
export declare function getServiceClient(urlEnvVar?: string, keyEnvVar?: string): SupabaseClient;
