/** Hash de senha com bcrypt (10 rounds, mesmo custo usado nos projetos de origem). */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Verifica `password` contra `hash`. Se `hash` for nulo/ausente (ex.: usuário
 * não encontrado), compara mesmo assim contra um hash fixo — pra gastar o
 * mesmo tempo do caminho real e não vazar por timing se o usuário existe.
 */
export declare function verifyPassword(password: string, hash: string | null | undefined): Promise<boolean>;
