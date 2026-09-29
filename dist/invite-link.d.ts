/**
 * Convite por link ("link mágico"): o segredo viaja na URL e o banco guarda só o hash dele.
 *
 * Quem abre o link prova que recebeu o convite, e por isso não precisa de senha prévia nenhuma —
 * some a senha inicial compartilhada, que é a mesma para todo mundo e deixa qualquer um chegar
 * antes da pessoa certa.
 *
 * O storage é seu (uma tabela por projeto). O que este módulo cobre é o que se repete em todo
 * projeto: montar a URL, gerar o token junto com o que persistir dele, e classificar o estado.
 *
 * A trava que impede o mesmo link virar duas contas mora no banco, e é sempre esta forma —
 * reivindicar ANTES de criar qualquer coisa, num update condicional que devolve linha:
 *
 *   update invite_links set used_at = now()
 *    where token_hash = $1 and used_at is null and revoked_at is null and expires_at > now()
 *    returning *;
 *
 * Sem linha de volta, o convite não valia. Faça isso e a criação da conta na MESMA transação
 * (uma função plpgsql, por exemplo): se a criação falhar, o update volta atrás sozinho e o
 * convite continua válido, sem precisar de nenhum remendo para "devolver" o token.
 */
export type InviteStatus = "valid" | "used" | "revoked" | "expired";
export type InviteRow = {
    expires_at: string | Date;
    used_at?: string | Date | null;
    revoked_at?: string | Date | null;
};
export type NewInvite = {
    /** Só existe dentro do link. Nunca persista: persista o `tokenHash`. */
    token: string;
    tokenHash: string;
    url: string;
};
/** Monta a URL do convite. `basePath` é a rota que recebe o token, a partir da raiz (ex.: "/convite"). */
export declare function inviteUrl(baseUrl: string, basePath: string, token: string): string;
/**
 * Gera um convite: o token que vai no link e o hash que vai para o banco, devolvidos juntos de
 * propósito — quem chama não tem como guardar o token cru por engano achando que é o hash.
 *
 * `hashToken` é do projeto (`hashOpaqueToken` daqui serve, ou o HMAC com rótulo que o projeto já
 * usa), porque o segredo e a separação de usos são decisão de cada projeto, não deste módulo.
 */
export declare function createInvite(baseUrl: string, basePath: string, hashToken: (token: string) => string, bytes?: number): NewInvite;
/**
 * Estado do convite a partir do que está gravado. Serve para a tela do convidado e para a lista do
 * admin lerem a mesma regra — a conferência que vale continua sendo a do update condicional acima.
 */
export declare function inviteStatus(row: InviteRow, now?: Date): InviteStatus;
