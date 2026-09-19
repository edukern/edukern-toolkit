# Handoff — 2026-09-19 (atualizado)

> `v0.2.0` no ar, repo público: `github.com/edukern/edukern-toolkit`. 7
> módulos, 22 testes passando. **Ainda nenhum consumidor real** — nem o
> `mundialito` (origem do padrão principal).

## ⏳ Pendente

1. **Nenhum consumidor real ainda.** `npm install
   github:edukern/edukern-toolkit#v0.2.0` nunca foi testado por um projeto de
   verdade. Primeira instalação: validar que o `dist/` prebuilt resolve certo.
2. **Migração de `proficiencia-ucs` começou e foi interrompida antes do
   `revisor-impacto` terminar** (usuário pivotou pra investigar mais repos).
   Retomar do zero: rodar `revisor-impacto` nesse projeto (o CLAUDE.md dele
   exige, mudança toca módulo compartilhado) antes de tocar em
   `src/lib/store/supabase.ts` / `src/app/api/acesso/route.ts`. Só
   `supabase-client` e `timing-safe-compare` se aplicam lá (sessão é cookie
   plano não-assinado, não HMAC).
3. **Migração do `mundialito`** — revisão de impacto já aprovou com ressalvas.
   Não fazer durante a janela do torneio.
4. **Shortlist externa (next-forge, Cal.com, Twenty CRM, Medusa.js, Metabase,
   etc.) nunca foi investigada de verdade** — só existe como nome de repo de
   uma busca na web. Se for continuar extraindo, é o próximo passo mais
   promissor (ver memória do audit).
5. **Clusters #3/#4 do scan original** (tokens de design — já resolvido de
   outro jeito, não é candidato; `dnd-kit`/`react-pdf` — precisa desenho, não
   é extração mecânica).

## 🧠 Decisões que afetam o próximo passo

- Modelo é pacote via git dependency, não monorepo — motivo em `CLAUDE.md`.
- `supabase-client` e `supabase-tenant-client` importam `server-only`
  incondicionalmente — quebram se usados por script fora do bundler do Next
  (achado real: `game-box`). Não abrir variante sem guard sem um 2º caso real.
- `resolveSecureCookieOption` e `signTenantToken` moraram em arquivo próprio,
  sem o guard `server-only`, especificamente pra serem testáveis com `node
  --test` puro fora do Next.

## 📁 Arquivos relevantes

- `src/` — os 7 módulos atuais.
- `README.md` — API completa + limites conhecidos de cada módulo.
- `D:\projetos\mundialito\.claude\memory\project_personal_library_audit.md` —
  histórico completo do audit (33+ repos avaliados, clusters, decisões,
  revisões de impacto, achados por repo).

---
▶ PROMPT DE RETOMADA

```
Leia HANDOFF.md em D:\projetos\edukern-toolkit. v0.2.0 no ar (7 módulos, 22
testes), ainda sem consumidor real. Duas frentes em aberto, sem ordem
obrigatória: (a) terminar a migração do proficiencia-ucs, que ficou pela
metade — precisa rodar revisor-impacto nesse projeto antes de tocar código;
(b) investigar de verdade a shortlist externa (next-forge, Cal.com, Twenty
CRM, Medusa.js, Metabase — nomes só, nunca clonados) por padrões novos.
Detalhe completo na memória do audit (caminho acima).
```
