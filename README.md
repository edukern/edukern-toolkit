# @edukern/toolkit

Pacote com peças reaproveitadas entre projetos (extraídas do audit de
2026-09-19 — ver `.claude/memory/`). Não publicado em registry: instale direto
do GitHub. Repo público (código genérico, sem segredo), mas não é um produto —
é uso pessoal entre projetos do dono.

## Instalar num projeto consumidor

```bash
npm install github:edukern/edukern-toolkit#v0.1.1
```

`dist/` já vai commitado na tag — não precisa rodar build no install (ver
`.claude/memory/` do mundialito pra saber por quê: `prepare` rodando `tsc` no
install quebra em build que não instala devDependencies, ex. Vercel).

## O que tem aqui

- `@edukern/toolkit/supabase-client` — cliente Supabase service-role,
  cacheado, server-only. **Importa `server-only` incondicionalmente** — se seu
  projeto também usa esse cliente fora do bundler do Next (script rodado via
  `tsx`/`node` puro), essa importação vai lançar. Não tem opção de desligar o
  guard neste pacote de propósito (ver `game-box/src/lib/supabase/admin.ts`
  pra um exemplo real desse caso e por que ele optou por não usar o guard) —
  se precisar dos dois casos, copie as ~15 linhas sem o guard em vez de
  importar daqui.
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

`signed-session`/`session-cookie` só valem a pena pra um projeto que já
assina sessão por HMAC à mão, como o mundialito. Projeto que usa Supabase Auth
de verdade (`@supabase/ssr` + `supabase.auth.getUser()`, como o `game-box`)
não tem o que fazer com esses dois módulos — nesse caso só `supabase-client` e
`timing-safe-compare` se aplicam, se aplicarem.

## Desenvolvimento

```bash
npm install
npm test   # build + node --test
```
