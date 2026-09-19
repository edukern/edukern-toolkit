/**
 * Token de sessão assinado por HMAC-SHA256, formato `<payload-base64url>.<assinatura>`.
 * Sem estado no servidor (não é um JWT só porque não carrega header nem alg
 * negociável — o algoritmo é fixo, não dá pra downgrade attack).
 *
 * `secretEnvVar` aponta pra variável de ambiente com o segredo (≥16 chars).
 * `T` é o formato do seu payload de sessão (role, ids, etc.) — valide o shape
 * na função `isValid` que você passa pra `verify`.
 */
export declare function createSignedSession<T extends object>(secretEnvVar: string): {
    /** `iatOriginal` preserva o início de uma sessão ao reassinar (troca de papel/contexto sem reiniciar o relógio de expiração). */
    sign(payload: T, iatOriginal?: number): string;
    verify(token: string | undefined, maxAgeMs: number, isValid: (payload: unknown) => payload is T): (T & {
        iat: number;
    }) | null;
};
