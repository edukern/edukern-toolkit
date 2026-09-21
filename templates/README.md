# Templates — copie, não importe

Baseline de config pra copiar no início de um projeto novo (Next.js). Mesmo
modelo do `design-tokens.css` e `src/ui/`: sem mecanismo de import/dependência,
é ponto de partida.

## `eslint.config.mjs`

Baseline genérico (`eslint-config-next`). Achado real: `financeiro-ponto-e` e
`rh-pontoe` (2 dos 10 projetos do survey de 2026-09-20) não tinham ESLint
configurado nenhum. Copie e ajuste os `globalIgnores` pro seu projeto (o
exemplo tem entradas específicas do `game-box` — `legacy-mockup/`,
`.claude/worktrees/` — que só fazem sentido lá).

## `ci.yml`

Vai em `.github/workflows/ci.yml`. Fonte: `game-box` (único dos 10 projetos
do survey com CI limpo e completo — `rh-pontoe` também tem, mas mais
específico do próprio projeto). Ordem importa: lint → `next typegen` → type-
check → testes → build. O `next typegen` roda ANTES do type-check porque
`PageProps`/`LayoutProps` só existem depois de gerar os tipos de rota — sem
isso, o type-check falha com "Cannot find name 'LayoutProps'" num checkout
limpo que nunca rodou build.

Ajuste antes de usar: o passo `Build` no exemplo passa `NEXT_PUBLIC_SUPABASE_URL`/
`NEXT_PUBLIC_SUPABASE_ANON_KEY` como secrets do GitHub — troque pelas env vars
que seu projeto precisa em build time (ou remova o bloco `env:` se não
precisar de nenhuma). Se o projeto não usa Supabase, tire a linha do
comentário sobre RLS também.

## `projeto-novo/CLAUDE.md`

`CLAUDE.md` mínimo de projeto: só referencia a cultura global e mantém as regras
específicas. Checklist completo em `docs/novo-projeto.md`.
