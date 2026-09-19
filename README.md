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

- `@edukern/toolkit/whatsapp-link` — `buildWhatsAppLink(phone, message)` monta
  um link `wa.me` que abre o WhatsApp do destinatário com mensagem
  pré-preenchida, sem API paga do WhatsApp Business. Extraído do padrão usado
  no `rh-pontoe` pra avisar candidato de processo seletivo.

- `@edukern/toolkit/pix-copy-paste` — `buildPixCopyPaste({ pixKey, merchantName,
  merchantCity, amount?, txid? })` monta o payload "Pix copia e cola" (EMV/BR
  Code do Bacen) sem nenhuma API de pagamento — o cliente cola no app do banco
  e paga na hora. `merchantName`/`merchantCity` são truncados em 25/15
  caracteres (limite do próprio formato EMV, não escolha arbitrária).
- `@edukern/toolkit/calendar-invite` — `buildGoogleCalendarLink(event)` (link
  `calendar.google.com/render` pré-preenchido, sem OAuth) e `buildIcsFile(event)`
  (arquivo `.ics` RFC 5545 pra Outlook/Apple Calendar). Mesmo espírito do
  `whatsapp-link`: URL/arquivo determinístico, sem servidor.
- `@edukern/toolkit/br-formatters` — `isValidCpf`/`formatCpf`,
  `isValidCnpj`/`formatCnpj` (dígito verificador módulo 11, aceitam entrada
  com ou sem pontuação) e `formatBrPhone` (fixo/celular). Formatação de moeda
  não entrou — `Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'})`
  nativo já resolve, sem precisar de wrapper.
- `@edukern/toolkit/design-tokens.css` — esqueleto de design tokens (Tailwind
  v4 `@theme`): nomes semânticos de cor/tipografia/sombra/raio, padrão de tema
  escuro, sem valores de marca (tem placeholders tipo `SUA_FONTE_TITULO` de
  propósito). **Não é pra importar direto em produção** — é molde: copiar o
  conteúdo pro `globals.css` de um projeto novo e preencher fonte/cor da
  marca ali. O que garante consistência entre projetos são os *nomes* dos
  tokens (`--color-accent`, `--color-ink`, `--shadow-card`...), não os
  valores — cada projeto tem sua própria identidade visual. 4 dos 5 projetos
  atuais (mundialito, proficiencia-ucs, ponto-e-stock, game-box) já seguem
  essa convenção; o keenfisher tem sistema de tokens próprio, fora de escopo.

## Pegadinhas que não viraram código

Bug/trap de infra, ferramenta ou arquitetura que não dá pra empacotar em função —
só tem que lembrar na hora certa. Ver `PEGADINHAS.md`.

## Desenvolvimento

```bash
npm install
npm test   # build + node --test
```
