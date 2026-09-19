import { createHash } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const cache = new Map<string, SupabaseClient>();

/**
 * Cliente Supabase com service-role key, cacheado por par (url, key). Só chame
 * do lado do servidor — a service-role key ignora RLS.
 */
export function getServiceClient(
  urlEnvVar = "SUPABASE_URL",
  keyEnvVar = "SUPABASE_SERVICE_ROLE_KEY",
): SupabaseClient {
  const url = process.env[urlEnvVar];
  const key = process.env[keyEnvVar];
  if (!url || !key) {
    throw new Error(`${urlEnvVar} e ${keyEnvVar} são obrigatórios`);
  }
  const cacheKey = `${url}:${createHash("sha256").update(key).digest("hex")}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  cache.set(cacheKey, client);
  return client;
}
