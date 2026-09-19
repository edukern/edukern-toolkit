# Handoff — 2026-09-19 (atualizado)

> `v0.3.1` no ar, repo público: `github.com/edukern/edukern-toolkit`. 8
> módulos, 22 testes passando. **Primeiro consumidor real:** `proficiencia-ucs`
> (`timing-safe-compare` + `supabase-client-node`, migração completa).

## ⏳ Pendente

1. **Migração do `mundialito`** — revisão de impacto já aprovou com ressalvas.
   Não fazer durante a janela do torneio.
2. **Shortlist externa (next-forge, Cal.com, Twenty CRM, Medusa.js, Metabase,
   etc.)** — investigação real em andamento em outra sessão nesta mesma
   pasta. Não iniciar uma segunda em paralelo (ver memória do audit pra
   contexto).
3. **Clusters #3/#4 do scan original** (tokens de design — já resolvido de
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

## 📁 Arquivos relevantes

- `src/` — os 8 módulos atuais.
- `README.md` — API completa + limites conhecidos de cada módulo.
- `D:\projetos\mundialito\.claude\memory\project_personal_library_audit.md` —
  histórico completo do audit (33+ repos avaliados, clusters, decisões,
  revisões de impacto, achados por repo).

---
▶ PROMPT DE RETOMADA

```
Leia HANDOFF.md em D:\projetos\edukern-toolkit. v0.3.1 no ar (8 módulos, 22
testes), primeiro consumidor real (proficiencia-ucs) migrado. Duas frentes em
aberto: (a) migração do mundialito (revisão de impacto já aprovada, só não
fazer durante o torneio); (b) shortlist externa de repos gold-standard —
confirmar se a investigação em outra sessão já terminou antes de continuar.
Detalhe completo na memória do audit (caminho acima).
```
