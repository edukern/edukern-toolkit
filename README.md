# @edukern/toolkit

Pacote com peças reaproveitadas entre projetos (extraídas do audit de
2026-09-19 — ver `.claude/memory/`). Não publicado em registry: instale direto
do GitHub. Repo público (código genérico, sem segredo), mas não é um produto —
é uso pessoal entre projetos do dono.

## Instalar num projeto consumidor

```bash
npm install github:edukern/edukern-toolkit#v0.2.0
```

`dist/` já vai commitado na tag — não precisa rodar build no install (ver
`.claude/memory/` do mundialito pra saber por quê: `prepare` rodando `tsc` no
install quebra em build que não instala devDependencies, ex. Vercel).

## O que tem aqui

- `@edukern/toolkit/supabase-client` — cliente Supabase service-role,
  cacheado, server-only. **Importa `server-only` incondicionalmente** — se seu
  projeto também usa esse cliente fora do bundler do Next (script rodado via
  `tsx`/`node` puro), essa importação vai lançar. Use
  `@edukern/toolkit/supabase-client-node` nesse caso (mesma função, sem o
  guard — você garante manualmente que nunca roda do lado do cliente).
- `@edukern/toolkit/supabase-client-node` — igual ao acima, sem `server-only`.
  Existe porque `proficiencia-ucs` compartilha o mesmo módulo de store entre
  Server Actions (Next) e scripts standalone (`tsx`) — só o segundo caso real
  de uso fora do Next justificou abrir essa variante (ver `game-box` pro
  primeiro caso, que na época ficou só copiando as ~15 linhas).
- `@edukern/toolkit/signed-session` — token de sessão assinado por HMAC
  (payload genérico, sem estado no servidor).
- `@edukern/toolkit/session-cookie` — grava/lê/limpa o token acima num cookie
  httpOnly (Next.js `next/headers`). Reexporta `resolveSecureCookieOption` (ver
  `secure-cookie-option` abaixo) e já usa pra decidir a flag `secure`.
- `@edukern/toolkit/secure-cookie-option` — decide a flag `secure` do cookie:
  `AUTH_COOKIE_SECURE=true/false` força, senão detecta HTTPS real via
  `x-forwarded-proto` (passando a request) ou cai pra `NODE_ENV`. Sem isso,
  login quebra atrás de um proxy que termina TLS antes do processo Node (LAN
  on-prem) — achado real em 2 repos (`ponto-e-stock`, `keenfisher-repo`) que
  resolveram o mesmo problema cada um do seu jeito.
- `@edukern/toolkit/timing-safe-compare` — comparação de string em tempo
  constante, pra códigos/segredos vindos do usuário.
- `@edukern/toolkit/sign-tenant-token` + `@edukern/toolkit/supabase-tenant-client`
  — JWT curto (60s, `jose`) com claim de tenant, pra um client Supabase anon-key
  assumir e a policy de RLS isolar por tenant. Fail-closed (lança sem
  `tenantId`). Extraído do `ponto-e-hr-solution` (multi-tenant real). NÃO usa
  `SET LOCAL` — funciona atrás de connection pooler (PgBouncer/Supabase
  transaction mode), que é onde `SET LOCAL` quebra silenciosamente.
- `@edukern/toolkit/revocable-token` — `generateOpaqueToken()` +
  `hashOpaqueToken(token, secretEnvVar)` (HMAC-SHA256 chaveado) pra refresh
  token revogável: persista só o hash, nunca o token. A rotação/revogação em
  si (achar/atualizar a sessão no seu banco) fica por sua conta — isso só
  cobre a parte igual em qualquer projeto. Extraído do `keenfisher-repo`
  (lá acoplado a Prisma; aqui, storage-agnostic). Não substitui
  `signed-session` — use quando precisar revogar sessão do lado do servidor
  (`signed-session` é stateless, não dá pra revogar antes de expirar).

Extraído do padrão usado em `mundialito` (`lib/auth/session.ts`,
`lib/auth/cookie.ts`, `lib/supabase/server.ts`, `lib/auth/verify-code.ts`) —
esses arquivos no mundialito **ainda não foram migrados** pra consumir este
pacote; a migração é um passo separado, feito projeto por projeto.

`signed-session`/`session-cookie` só valem a pena pra um projeto que já
assina sessão por HMAC à mão, como o mundialito. Projeto que usa Supabase Auth
de verdade (`@supabase/ssr` + `supabase.auth.getUser()`, como o `game-box`)
não tem o que fazer com esses dois módulos — nesse caso só `supabase-client` e
`timing-safe-compare` se aplicam, se aplicarem.

## Pegadinhas que não viraram código

Bug/trap de infra, ferramenta ou arquitetura que não dá pra empacotar em função —
só tem que lembrar na hora certa. Ver `PEGADINHAS.md`.

## Desenvolvimento

```bash
npm install
npm test   # build + node --test
```
