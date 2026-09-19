# Handoff — 2026-09-19 (atualizado)

> `v0.3.1` no ar, repo público: `github.com/edukern/edukern-toolkit`. 8
> módulos, 22 testes passando, CI ativo (build + teste + checagem de
> `dist/` desatualizado em todo push). **Primeiro consumidor real:**
> `proficiencia-ucs` (`timing-safe-compare` + `supabase-client-node`,
> migração completa).

## ⏳ Pendente

1. **Migração do `mundialito`** — revisão de impacto já aprovou com ressalvas.
   Não fazer durante a janela do torneio.
2. **Shortlist externa investigada de verdade — concluída.** 7 de 10 repos
   originais clonados e lidos a fundo (next-forge, Next-js-Boilerplate,
   cal.com, dub, twenty, medusa, outline); metabase só superficial;
   `course-builder` não existe mais no GitHub. Nenhum achado força mudança
   no toolkit — só confirmou decisões já tomadas (tokens OKLCH, módulo por
   capacidade de infra, RLS). Substitutos pra referência de curso levantados:
   `classroomio` (schema curso/lição/exercício/submissão, o mais útil),
   `learnhouse`, `epicshop`. Proposta de schema pro `proficiencia-ucs`
   baseada no `classroomio` já está pronta na memória do audit — ver
   arquivo abaixo.
3. **Investigação de padrões visuais premium — concluída** (motivada pelo
   usuário achar os projetos "feios/básicos"). Achados: template
   `~/.claude/templates/design-tokens.css` já atualizado com sombra em
   camadas (`-border`/`-ambient`/`-highlight`, padrão Vercel/Linear) e
   sugestão de 3 pares de fonte fora do padrão "IA". Detalhe completo
   (border-beam, texto shimmer, grid de fundo) na memória do audit.
4. **4 lacunas reais achadas numa revisão meticulosa do toolkit em
   2026-09-19** (review manual, não passou pelo `revisor-impacto` — não
   tocava schema/auth/deploy de produção):
   - ~~Sem CI~~ — **resolvido** (`.github/workflows/ci.yml`: build + teste +
     falha se `dist/` commitado não bater com o build; `npm run build` agora
     limpa `dist/` antes — achado ao vivo um `.test.js` órfão de um arquivo
     de teste já renomeado, que sobrevivia a rebuilds sem isso).
   - ~~Buracos de teste~~ — **resolvido parcialmente.** `getServiceClient`
     (cache, erro de env faltando) e `createTenantClient` (client Supabase
     real, mockando só `server-only` — não desliga a proteção real, só
     permite testar a lógica de criação isolada) agora têm teste. O arquivo
     `session-cookie.test.ts` estava mal nomeado (só testava
     `secure-cookie-option`) — renomeado para `secure-cookie-option.test.ts`.
     **`setSignedCookie`/`clearSignedCookie`/`readSignedCookie` continuam
     sem teste — tentei e esbarrei numa limitação real, não me faltou
     tentar**: `session-cookie.ts` importa `next/headers`, que só resolve
     via bare specifier dentro do bundler do Next (webpack/turbopack); via
     `node --test` puro (mesmo com `mock.module`), a resolução ESM falha
     antes de qualquer mock entrar em ação (`ERR_MODULE_NOT_FOUND`, next
     15.5.x não tem `exports` map). Fechar isso de verdade exige um dos
     dois, nenhum é "adicionar teste": (a) teste de integração real dentro
     de uma app Next (rota de verdade, não unitário), ou (b) mudar
     `session-cookie.ts` pra aceitar um cookie store injetável (API
     diferente da atual). Decisão de design em aberto, não tarefa pendente.
   - ~~Sem `CHANGELOG.md`~~ — **resolvido** (`CHANGELOG.md` na raiz, uma
     entrada por tag desde v0.1.0).
   - **Cluster #1 (portão de acesso, o de maior valor do audit original)
     só existe como peças soltas** (`signed-session` + `session-cookie` +
     `secure-cookie-option` + `timing-safe-compare`), sem um
     `createAccessGate()` que as una. Ainda pendente: toca módulo
     compartilhado de auth, exige `revisor-impacto` antes de implementar
     (regra do `CLAUDE.md` deste repo) — próximo passo real.
5. **Clusters #3/#4 do scan original** (tokens de design — já resolvido de
   outro jeito, não é candidato; `dnd-kit`/`react-pdf` — precisa desenho, não
   é extração mecânica).

## 🧠 Decisões que afetam o próximo passo

- Modelo é pacote via git dependency, não monorepo — motivo em `CLAUDE.md`.
- `supabase-client` importa `server-only` incondicionalmente (proposital,
  detecta uso acidental no bundle do cliente). Para consumidor que compartilha
  o mesmo módulo entre código Next e script standalone (`tsx`/`node` puro —
  caso real: `proficiencia-ucs`), use `supabase-client-node` — mesma função,
  sem o guard.
- Todo `exports` do `package.json` precisa da condição `default` além de
  `import`/`types` — sem ela, `npx tsx` falha com
  `ERR_PACKAGE_PATH_NOT_EXPORTED` mesmo quando o import ESM real funcionaria
  (o resolvedor de paths do tsx passa por um probe estilo CommonJS antes do
  ESM). Manter esse padrão em módulos novos.
- `resolveSecureCookieOption` e `signTenantToken` moraram em arquivo próprio,
  sem o guard `server-only`, especificamente pra serem testáveis com `node
  --test` puro fora do Next.
- `supabase-tenant-client` (multi-tenant) continua só com a variante guardada
  — ainda não apareceu um 2º caso real que precise da versão sem guard, como
  apareceu para `supabase-client`.
- Pacote é ESM-only (`"type": "module"`, sem build CJS) — funciona bem no
  ecossistema Next.js/ESM-first do usuário; um consumidor CommonJS puro
  (`require()`) não vai conseguir usar o pacote. Não documentado no README
  ainda — considerar adicionar se aparecer um caso real.

## 📁 Arquivos relevantes

- `src/` — os 8 módulos atuais.
- `.github/workflows/ci.yml` — build + teste + checagem de drift do `dist/`.
- `README.md` — API completa + limites conhecidos de cada módulo.
- `D:\projetos\mundialito\.claude\memory\project_personal_library_audit.md` —
  histórico completo do audit (33+ repos avaliados, clusters, decisões,
  revisões de impacto, achados por repo, shortlist externa, padrões visuais,
  proposta de schema pro `proficiencia-ucs`).

---
▶ PROMPT DE RETOMADA

```
Leia HANDOFF.md em D:\projetos\edukern-toolkit. v0.3.1 no ar (8 módulos, 22
testes, CI ativo), proficiencia-ucs migrado, shortlist externa e padrões
visuais investigados de verdade (concluído). Próximo passo real: fechar as
lacunas da revisão meticulosa (item 4 do Pendente) — decidir se o cluster de
portão de acesso sobe pra um `createAccessGate()` composto, fechar os
buracos de teste na cola (getServiceClient, session-cookie, createTenantClient),
e criar CHANGELOG.md. Migração do mundialito fica esperando a janela do
torneio terminar. Detalhe completo na memória do audit (caminho acima).
```
