import { createHmac, randomBytes } from "node:crypto";
/** Token opaco aleatório (não é JWT, não carrega payload) — para refresh tokens revogáveis. */
export function generateOpaqueToken(bytes = 48) {
    return randomBytes(bytes).toString("base64url");
}
/**
 * Hash HMAC-SHA256 do token, pra persistir no banco em vez do token em texto puro — um dump do
 * banco não permite forjar sessão. Chaveado (não é hash simples): mesmo com o dump, não dá pra
 * pré-computar/rainbow-table sem o segredo, que fica só no ambiente do servidor.
 *
 * Storage e rotação (achar/criar/revogar a sessão no seu banco) ficam por sua conta — isso aqui
 * só cobre a parte que é igual em qualquer projeto: gerar o token e o que persistir dele.
 */
export function hashOpaqueToken(token, secretEnvVar) {
    const secret = process.env[secretEnvVar];
    if (!secret || secret.length < 16)
        throw new Error(`${secretEnvVar} ausente ou curto demais`);
    return createHmac("sha256", secret).update(token).digest("hex");
}
