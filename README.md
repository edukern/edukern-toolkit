# @edukern/toolkit

Pacote privado com peças reaproveitadas entre projetos (extraídas do audit de
2026-09-19 — ver `.claude/memory/`). Não publicado em registry: instale direto
do GitHub.

## Instalar num projeto consumidor

```bash
npm install github:edukern/edukern-toolkit#v0.1.0
```

O `prepare` script compila `src/` pra `dist/` automaticamente no install — não
precisa rodar build à mão.

## O que tem aqui

- `@edukern/toolkit/supabase-client` — cliente Supabase service-role,
  cacheado, server-only.
- `@edukern/toolkit/signed-session` — token de sessão assinado por HMAC
  (payload genérico, sem estado no servidor).
- `@edukern/toolkit/session-cookie` — grava/lê/limpa o token acima num cookie
  httpOnly (Next.js `next/headers`).
- `@edukern/toolkit/timing-safe-compare` — comparação de string em tempo
  constante, pra códigos/segredos vindos do usuário.

Extraído do padrão usado em `mundialito` (`lib/auth/session.ts`,
`lib/auth/cookie.ts`, `lib/supabase/server.ts`, `lib/auth/verify-code.ts`) —
esses arquivos no mundialito **ainda não foram migrados** pra consumir este
pacote; a migração é um passo separado, feito projeto por projeto.

## Desenvolvimento

```bash
npm install
npm test   # build + node --test
```
