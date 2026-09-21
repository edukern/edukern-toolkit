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
  `secure-cookie-option` abaixo) e já usa pra decidir a flag `secure`. Por
  baixo, delega pra `session-cookie-core.ts` (sem import de framework, testado
  com `node --test` direto — mesmo desenho de `supabase-client-core`). A
  `core` não é exportada pelo pacote ainda: nenhum consumidor real fora do
  Next precisa dela hoje (`acamp-plan`, o candidato óbvio, é CommonJS — o
  pacote é ESM-only, então nem `require` funcionaria; e o modelo de sessão
  dele é outro, id opaco em Redis, não token assinado). Existe pra fechar o
  buraco de teste, não porque alguém está esperando pra consumir.
- `@edukern/toolkit/secure-cookie-option` — decide a flag `secure` do cookie:
  `AUTH_COOKIE_SECURE=true/false` força, senão detecta HTTPS real via
  `x-forwarded-proto` (passando a request) ou cai pra `NODE_ENV`. Sem isso,
  login quebra atrás de um proxy que termina TLS antes do processo Node (LAN
  on-prem) — achado real em 2 repos (`ponto-e-stock`, `keenfisher-repo`) que
  resolveram o mesmo problema cada um do seu jeito.
- `@edukern/toolkit/timing-safe-compare` — comparação de string em tempo
  constante, pra códigos/segredos vindos do usuário.
- `@edukern/toolkit/whatsapp-link` — `buildWhatsAppLink(telefone, mensagem)`
  monta um link `wa.me` pré-preenchido (sem pagar API do WhatsApp Business).
  `normalizePhoneBR` decide o DDI por contagem de dígito, não por conteúdo —
  checar se o número "já começa com 55" erra pra qualquer telefone de DDD 55
  (Santa Maria/RS). Extraído do `acamp-plan`, que já tinha corrigido esse bug;
  o `rh-pontoe` (`lib/telefone.js`) resolve o mesmo problema de outro jeito,
  também correto — confirmado com leitura direta antes de promover, não só
  por semelhança de nome.
- `@edukern/toolkit/cpf` — `isValidCpf`/`normalizeCpf`, algoritmo padrão de
  dígito verificador com guarda contra sequência repetida
  (`111.111.111-11` passa na conta, nunca é CPF real). Extraído do
  `acamp-plan`; o `rh-pontoe` já tem o mesmo algoritmo (duplicado em 2
  arquivos: `CandidaturaForm.jsx` e `FormBancoTalentos.jsx`) — candidato a
  futura limpeza lá, sem urgência.
- `@edukern/toolkit/password-hash` — `hashPassword`/`verifyPassword`
  (`bcryptjs`, 10 rounds — não o `bcrypt` nativo, que exige compilação
  C++/node-gyp; ruim pra deploy em LAN on-prem). `verifyPassword` compara
  contra um hash fixo quando `hash` é nulo/ausente, em vez de retornar
  na hora — um early-return aqui vaza por timing se o usuário existe, mesmo
  com mensagem de erro idêntica (`financeiro-ponto-e` já mitiga isso no
  próprio login; `rh-pontoe/lib/senha.js`, a fonte deste módulo, fazia
  early-return — corrigido ao promover, não copiado como estava).
  **Nenhum projeto migrado ainda** — decisão consciente do revisor-impacto
  em 2026-09-21: `financeiro-ponto-e` não depende do toolkit hoje, e somar
  essa dependência (git+credencial do GitHub na máquina de deploy LAN) custa
  mais que o ganho de centralizar 5 chamadas de bcrypt. Centralização real
  fica local, em `financeiro-ponto-e/src/lib/senha.ts` (já existe).
- `@edukern/toolkit/currency-br` — `formatBRL(valor)`. Não usa
  `Intl.NumberFormat` de propósito: pode formatar errado (ou lançar) num
  Node com build ICU mínimo (comum em Windows/containers). Achado real:
  `financeiro-ponto-e/src/lib/formato.ts` já evitava `Intl` pelo mesmo
  motivo — este módulo segue a mesma estratégia (string, não `Intl`).
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

- `@edukern/toolkit/design-tokens.css` — esqueleto de design tokens (Tailwind
  v4 `@theme`): nomes semânticos de cor/tipografia/sombra/raio, padrão de tema
  escuro, sem valores de marca (tem placeholders tipo `SUA_FONTE_TITULO` de
  propósito). **Não é pra importar direto em produção** — é molde: copiar o
  conteúdo pro `globals.css` de um projeto novo e preencher fonte/cor da
  marca ali. O que garante consistência entre projetos são os *nomes* dos
  tokens (`--color-accent`, `--color-ink`, `--shadow-card`...), não os
  valores — cada projeto tem sua própria identidade visual. A convenção de
  nome (`--color-accent`, `--color-ink`...) é seguida por convergência
  manual entre os projetos, não por import do pacote — nenhum projeto
  importa este arquivo hoje (confirmado por grep em 2026-09-20, ver
  `.claude/memory/starter_kit_candidates.md`). ponto-e-stock chegou a
  divergir (`--color-primary` em vez de `--color-accent`) e foi corrigido;
  vale reconferir antes de assumir consistência.

- `@edukern/toolkit/release-notes` — base da tela "Novidades" do usuário final:
  tipo `ReleaseNote` (data + Novo/Aprimorado/Corrigido), `sortReleaseNotes`,
  `formatDatePtBR` (sem `Intl`, mesmo motivo do `currency-br`) e `countUnseen`
  (bolinha "novo" no menu). A tela em si segue a skill global `novidades`.

## Templates (`templates/`)

`eslint.config.mjs` e `ci.yml` genéricos pra copiar num projeto novo. Ver
`templates/README.md`.

## Kit de UI (`src/ui/`)

`Button`/`Card`/`Input`/`Badge` — não é exportado pelo pacote (excluído do
`tsconfig.json`), é código-fonte pra copiar. Ver `src/ui/README.md` pro
porquê (regra dos 3 ainda não atingida — só 1 fonte real madura,
`mundialito`) e como usar.

## Pegadinhas que não viraram código

Bug/trap de infra, ferramenta ou arquitetura que não dá pra empacotar em função —
só tem que lembrar na hora certa. Ver `PEGADINHAS.md`.

## Desenvolvimento

```bash
npm install
npm test   # build + node --test
```
