# Changelog

Formato livre (não é registry npm com changelog automático — instalação é
via tag git, `github:edukern/edukern-toolkit#vX.Y.Z`). Toda versão nova que
um consumidor for adotar deveria ter uma entrada aqui antes da tag.

## Não lançado

- docs: `docs/novo-projeto.md` (checklist + dono de cada assunto, aponta pro
  repositório de configurações do Claude em vez de copiar regra) e
  `templates/projeto-novo/CLAUDE.md`.
- feat: `release-notes` (`ReleaseNote`, `sortReleaseNotes`, `formatDatePtBR`,
  `countUnseen`) — padrão de "Novidades" pro usuário final, separado deste
  changelog (que é técnico, pra quem instala o pacote). Data formatada sem
  `Intl` (ICU mínimo).
- feat: `currency-br` (`formatBRL`). Não usa `Intl.NumberFormat` de
  propósito — pode formatar errado (ou lançar) num Node com build ICU
  mínimo (comum em Windows/containers), achado real documentado em
  `financeiro-ponto-e/src/lib/formato.ts`, que já evitava `Intl` pelo
  mesmo motivo. Formatação por string, sem dependência de locale.
- fix: `_visual/explorer.html` — badge de contraste WCAG trocado de
  DOM-probe (`getComputedStyle` num `<span>` escondido) pra cálculo OKLCH→
  luminância em matemática pura. O bug real: atribuir cor CSS inválida a
  `style.color` é ignorado em silêncio pelo navegador (não lança), então o
  probe ficava com o valor anterior depois de uma sequência de troca de
  paleta/arquétipo/fonte — daí badges de pares diferentes lerem a mesma
  cor "grudada" e caírem em 1.00:1 juntos. Verificado ao vivo no navegador
  (sequência paleta→arquétipo→fonte→paleta, valores corretos em cada
  passo).
- docs: `templates/` — `eslint.config.mjs` e `ci.yml` genéricos pra copiar
  num projeto novo. Achado real: 2 dos 10 projetos do survey de
  2026-09-20 não tinham ESLint configurado; só 2 tinham CI. Fonte do CI:
  `game-box` (mais limpo e completo).
- docs: `_visual/patterns.md` — padrão "hover revela detalhe" (tooltip via
  `content:attr(data-tip)`, sem JS de posicionamento), extraído do
  `listing-catalog.html` direção B.
- feat: `whatsapp-link` (`buildWhatsAppLink`/`normalizePhoneBR`) e `cpf`
  (`isValidCpf`/`normalizeCpf`), extraídos do `acamp-plan`. rh-pontoe
  conferido por leitura direta antes de promover — não tinha os bugs que a
  survey anterior sugeria (DDI e CPF já corretos lá, só não centralizados
  no caso do CPF).
- feat: `password-hash` (`hashPassword`/`verifyPassword`, bcryptjs 10
  rounds). `verifyPassword` compara contra hash fixo quando `hash` é
  nulo, em vez de early-return — evita vazar por timing se o usuário
  existe (achado do revisor-impacto: a fonte, `rh-pontoe/lib/senha.js`,
  fazia early-return; `financeiro-ponto-e` já mitigava isso no login,
  então promover "como estava" teria regredido segurança). Nenhum
  consumidor migrado — decisão consciente, ver `starter_kit_candidates.md`.
- fix: `session-cookie.ts` dividido em `session-cookie-core.ts` (sem
  import de framework, testável com `node --test` puro) + a casca Next.js
  de sempre, mesmo desenho de `supabase-client-core`. API pública
  (`setSignedCookie`/`clearSignedCookie`/`readSignedCookie`) inalterada.
  Fecha o buraco de teste do HANDOFF; NÃO destrava `acamp-plan` como o
  plano original assumia (CommonJS × pacote ESM-only, e modelo de sessão
  diferente — achado do revisor-impacto).
- fix: `timing-safe-compare.ts` retorna `false` em vez de lançar
  `TypeError` quando o segredo esperado é `undefined`/vazio — sem a
  guarda, uma env var não configurada virava erro 500 em vez de "não
  autorizado".
- feat: `src/ui/` — Button/Card/Input/Badge do mundialito, como
  código-fonte pra copiar (excluído do build do pacote, não é export
  npm). Regra dos 3 ainda não atingida (só 1 fonte madura real — sancho
  confirmado incompatível, estiliza via `CSSProperties`, não Tailwind).
- docs: `design-tokens.css` deixa explícito que o contrato é o NOME do
  token, não o valor — "copiar e ajustar" não inclui renomear. Motivo:
  `revisor-impacto` conferiu o código real (não só o nome do arquivo) e
  achou que a afirmação "4 dos 5 projetos já seguem essa convenção" (nota
  do v0.4.0 abaixo) era otimista demais — ponto-e-stock usava
  `--color-primary` em vez de `--color-accent` em 23 arquivos. Corrigido
  isolado no próprio ponto-e-stock (branch `chore/token-accent-rename`),
  fora deste pacote. proficiencia-ucs ganhou `--color-danger` como alias
  de `--color-erro` (branch `chore/danger-token-alias`) — mesma causa.
  mundialito já estava alinhado, sem mudança. Nenhum consumidor importa
  `design-tokens.css` via pacote ainda — a convergência até aqui é por
  convenção copiada, não por dependência real. Button/Card seguem NÃO
  extraídos (regra dos 3 seguindo em vigor); ver
  `.claude/memory/project_frontend_scope.md`.

## v0.4.0

- feat: `design-tokens.css` — primeira peça de front-end do toolkit (as
  demais eram lógica de infra/auth). Esqueleto de design tokens Tailwind v4
  (`@theme`: cor, tipografia, sombra, raio + padrão de tema escuro), sem
  valores de marca — é molde pra copiar num projeto novo, não import de
  produção. Migrado de `~/.claude/templates/design-tokens.css` (uso pessoal
  solto) pra virar fonte única; 4 dos 5 projetos atuais já seguem essa
  convenção de nomes de token.

## v0.3.1

- fix: adiciona a condição `default` a todo `exports` do `package.json`, ao
  lado de `import`/`types`. Sem ela, `npx tsx` falha com
  `ERR_PACKAGE_PATH_NOT_EXPORTED` ao resolver subpaths (ex.
  `supabase-client-node`) mesmo quando o import ESM real funcionaria — o
  resolvedor do `tsx` faz um probe estilo CommonJS antes da resolução ESM.
  Achado testando o primeiro consumidor real (`proficiencia-ucs`).

## v0.3.0

- feat: `supabase-client-node` — mesma função de `supabase-client`
  (`getServiceClient`), sem o guard `server-only`, para scripts Node
  (`tsx`/workers) que rodam fora do bundler do Next.
- Agente `revisor-impacto` adicionado em `.claude/agents/` (revisão de
  implicações de 1ª/2ª/3ª ordem antes de mudanças em schema, módulos
  compartilhados, fluxo crítico, auth/permissões ou deploy).

## v0.2.0

- feat: `secure-cookie-option` — decide a flag `secure` do cookie
  (`AUTH_COOKIE_SECURE` ou detecção via `x-forwarded-proto`/`NODE_ENV`).
- feat: `sign-tenant-token` + `supabase-tenant-client` — JWT curto (60s) com
  claim de tenant, para RLS isolar por tenant atrás de connection pooler.
- feat: `revocable-token` — `generateOpaqueToken`/`hashOpaqueToken` para
  refresh token revogável (storage-agnostic).

## v0.1.1

- fix: elimina a dependência de build no install (`dist/` passa a ir
  commitado na tag — `prepare` rodando `tsc` no install quebrava em builds
  que não instalam devDependencies, ex. Vercel).
- fix: achados da primeira revisão de impacto.

## v0.1.0

- feat: primeira peça do toolkit — `supabase-client` (client service-role
  cacheado), `signed-session` (token HMAC-SHA256 stateless),
  `session-cookie` (cookie httpOnly wrapper), `timing-safe-compare`
  (comparação em tempo constante).
