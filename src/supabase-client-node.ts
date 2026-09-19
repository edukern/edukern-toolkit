/**
 * Igual a `supabase-client`, sem o guard `server-only` — para scripts Node
 * (tsx, workers) que rodam fora do bundler do Next e não podem importá-lo.
 * Você é responsável por nunca chamar isso do lado do cliente.
 */
export { getServiceClient } from "./supabase-client-core.js";
