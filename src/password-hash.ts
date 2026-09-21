import bcrypt from "bcryptjs";

const ROUNDS = 10;

// Hash fixo pra gastar o mesmo tempo de bcrypt quando não há hash real pra
// comparar. Um early-return aqui (comparação pulada) revela por timing se o
// usuário existe, mesmo com mensagem de erro idêntica — achado real: dos dois
// projetos que motivaram este módulo, um já mitiga isso no próprio login
// (hash fixo quando o usuário não existe), o outro faz early-return. Ver
// revisor-impacto 2026-09-21 em `.claude/memory/starter_kit_candidates.md`.
const DUMMY_HASH = bcrypt.hashSync("senha-para-gastar-tempo-quando-hash-nao-existe", ROUNDS);

/** Hash de senha com bcrypt (10 rounds, mesmo custo usado nos projetos de origem). */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

/**
 * Verifica `password` contra `hash`. Se `hash` for nulo/ausente (ex.: usuário
 * não encontrado), compara mesmo assim contra um hash fixo — pra gastar o
 * mesmo tempo do caminho real e não vazar por timing se o usuário existe.
 */
export async function verifyPassword(
  password: string,
  hash: string | null | undefined,
): Promise<boolean> {
  const matches = await bcrypt.compare(password, hash ?? DUMMY_HASH);
  return matches && Boolean(hash);
}
