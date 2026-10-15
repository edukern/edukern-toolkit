/**
 * Passe para trocar de sistema já logado (botão "RH" no financeiro, "Recompra" no estoque).
 * Formato `<payload base64url>.<hmac-sha256 hex>`, payload `{u, aud, jti, exp, v}`:
 * - `u`: id do usuário NO DESTINO (o mapa origem→destino é explícito, nunca por nome);
 * - `aud`: nome do destino — com segredo próprio por destino, passe de um nunca vale no outro;
 * - `jti`: o destino queima no primeiro uso (ver `docs/switcher-entre-sistemas.md`);
 * - `v`: origem de volta para o botão "Voltar" (só http/https, só a origem).
 * Extraído de financeiro-ponto-e (`/ir/rh`) + rh-pontoe (`/api/auth/painel`), 15/10/2026.
 */
export type PasseVerificado = {
    usuarioId: string | number;
    jti: string;
    exp: number;
    volta: string;
};
/** Segredo do env com mínimo de 32 caracteres; null = recusar tudo (nunca aceitar passe sem segredo). */
export declare function segredoDoEnv(nome: string, env?: Record<string, string | undefined>): string | null;
/** Só a origem http(s), sem caminho nem usuário — o que pode virar href do "Voltar". */
export declare function origemSegura(url: unknown): string | null;
export declare function assinarPasse(dados: {
    usuarioId: string | number;
    aud: string;
    volta: string;
}, segredo: string, agoraMs?: number): string;
/** Confere assinatura, destino, validade (no máx. 120s à frente) e forma. Não queima o jti: isso é do destino. */
export declare function verificarPasse(token: unknown, segredo: string | null, aud: string, agoraMs?: number): PasseVerificado | null;
