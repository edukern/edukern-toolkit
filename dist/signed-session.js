import { createHmac, timingSafeEqual } from "node:crypto";
function b64url(buf) {
    return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s) {
    return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
/**
 * Token de sessão assinado por HMAC-SHA256, formato `<payload-base64url>.<assinatura>`.
 * Sem estado no servidor (não é um JWT só porque não carrega header nem alg
 * negociável — o algoritmo é fixo, não dá pra downgrade attack).
 *
 * `secretEnvVar` aponta pra variável de ambiente com o segredo (≥16 chars).
 * `T` é o formato do seu payload de sessão (role, ids, etc.) — valide o shape
 * na função `isValid` que você passa pra `verify`.
 */
export function createSignedSession(secretEnvVar) {
    function secret() {
        const s = process.env[secretEnvVar];
        if (!s || s.length < 16)
            throw new Error(`${secretEnvVar} ausente ou curto demais`);
        return s;
    }
    function hmac(body) {
        return b64url(createHmac("sha256", secret()).update(body).digest());
    }
    return {
        /** `iatOriginal` preserva o início de uma sessão ao reassinar (troca de papel/contexto sem reiniciar o relógio de expiração). */
        sign(payload, iatOriginal) {
            const full = { ...payload, iat: iatOriginal ?? Date.now() };
            const body = b64url(Buffer.from(JSON.stringify(full), "utf8"));
            return `${body}.${hmac(body)}`;
        },
        verify(token, maxAgeMs, isValid) {
            if (!token || token.split(".").length !== 2)
                return null;
            const [body, sig] = token.split(".");
            if (!body || !sig)
                return null;
            const expected = hmac(body);
            const a = Buffer.from(sig);
            const b = Buffer.from(expected);
            if (a.length !== b.length || !timingSafeEqual(a, b))
                return null;
            try {
                const parsed = JSON.parse(b64urlDecode(body).toString("utf8"));
                if (!parsed || typeof parsed.iat !== "number" || !Number.isFinite(parsed.iat))
                    return null;
                const iat = parsed.iat;
                if (!isValid(parsed))
                    return null;
                if (Date.now() - iat > maxAgeMs)
                    return null;
                return parsed;
            }
            catch {
                return null;
            }
        },
    };
}
