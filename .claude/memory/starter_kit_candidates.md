---
name: starter-kit-candidates
description: Survey com evidência real (9 projetos) do que mais poderia entrar no toolkit como starter kit — 2026-09-20
metadata:
  type: project
---

Em 2026-09-20 o usuário redefiniu o propósito do toolkit: **starter kit** — lugar
de onde puxar/copiar ao nascer um projeto NOVO, não dependência que todo
projeto existente precisa manter sincronizada. Duas camadas, decididas na
mesma sessão:

- **Infra/segurança** (auth, sessão, cookie, hash de senha) → fica como
  dependência real versionada. Motivo: bug corrigido numa cópia só e não nas
  outras é risco real e já aconteceu (2 bugs de cookie inseguro em produção,
  ver [[audit_familia_ponto_e]]).
- **UI/visual** (Button/Card, catálogos de tela) → vira referência pra copiar
  UMA VEZ ao nascer o projeto, sem expectativa de sincronizar depois. Cada
  projeto tem identidade visual própria de propósito.

Motivo do reframe: uma tentativa de mesclar a renomeação de token
(`primary`→`accent`) direto no `main` do ponto-e-stock bateu em conflito real
contra 320 commits de trabalho ativo não relacionado — prova ao vivo de que
tentar sincronizar código UI numa base que já vive sua própria vida é caro e
desnecessário. Ver histórico completo em `.claude/memory/project_frontend_scope.md`.

## Survey — 9 projetos (mundialito, proficiencia-ucs, ponto-e-stock,
financeiro-ponto-e, rh-pontoe, game-box, sancho, skillset, STG)

Rodado em duas passadas (6 projetos + depois +3 que o usuário pediu pra
incluir). Achados com grep real, não brainstorm abstrato — mesmo rigor usado
pra validar/corrigir o achado de Button/Card. **Dois números foram
reconferidos manualmente depois: o de hash de senha bateu exato; o de
formatação de moeda (ponto-e-stock) a contagem própria achou 8
arquivos/12 ocorrências de `Intl.NumberFormat('pt-BR'`, não 11 — o agente
provavelmente também contou `.toLocaleString('pt-BR', {style:'currency'})`,
variante equivalente não testada na reconferência. A duplicação em si é
real; só o número exato não foi 100% reproduzido.**

### Prioridade 1 — Kit de UI (Button/Card/Input/Select/Table/Badge/Textarea)
**3 implementações independentes confirmadas**: mundialito (`components/ui/`,
mais maduro, com teste em cada peça: Input/Select/Table/Badge/Textarea/Stat/
Icon/ConfirmButton), o Button/Card original já minerado, e **sancho**
(`src/components/ui.tsx` — Button/Card/Field/Input/Badge/ErrorBox, comentário
no próprio arquivo já declarando a regra "nunca espalhar `<button>`/`<input>`
cru"). skillset não tem kit nenhum — usa badges ad-hoc por domínio
(`energy-badge`, `ropes-badge`), exemplo vivo do problema.

**Atenção antes de escolher mundialito como fonte única**: o kit do sancho
estiliza via `CSSProperties`/variáveis CSS (`var(--terracota)`), não classes
Tailwind — se mundialito for Tailwind (confirmar), portar sancho não é
copy-paste direto. A fonte de COMPONENTES continua fazendo sentido ser
mundialito; o mapeamento de estilo pode precisar ajuste.

### Prioridade 2 — Hash de senha (bcrypt)
Confirmado por leitura direta (não só grep): `rh-pontoe/lib/senha.js` já
centraliza (`hashSenha`/`verificarSenha`, comentário registra que o fallback
SHA-256 da migração foi removido). `financeiro-ponto-e` chama
`bcrypt.hash`/`bcrypt.compare` direto em 5 arquivos
(`api/auth/login/route.ts`, `api/auth/trocar-senha/route.ts`,
`api/usuarios/[id]/redefinir-senha/route.ts`, `api/usuarios/route.ts`,
`scripts/criar-admin.mjs`), sem centralizar nem dentro do próprio projeto.

**Escopo real, não geral**: só se aplica a projetos que NÃO usam Supabase
Auth. sancho e skillset usam Supabase Auth (sem bcrypt, sem cookie manual) —
risco não existe ali.

**Explorado e descartado: migrar financeiro-ponto-e/rh-pontoe pra Supabase
Auth em vez de centralizar o hash.** financeiro-ponto-e já usa Supabase pros
dados, mas roda "HTTP puro numa LAN sem proxy na frente" (comentário em
`src/lib/session.ts`, citando revisor-impacto 2026-09-19) — depender de um
serviço de auth em nuvem briga com o motivo do app rodar assim. rh-pontoe nem
usa Supabase hoje — migrar seria adotar dependência de backend inteira nova.
**Decisão: manter o plano de módulo de hash de senha no toolkit, não migrar
auth.**

### Prioridade 3 — Formatação de moeda (`Intl.NumberFormat`/`toLocaleString` pt-BR)
Reimplementada inline, sem função central, em ponto-e-stock (~8-11 arquivos,
número exato não 100% fechado, ver nota acima), financeiro-ponto-e (~11) e
rh-pontoe (~7). Formatação de DATA já está bem resolvida em
`proficiencia-ucs/src/lib/format.ts` — não é gap, é referência pronta pra
promover como está.

### Prioridade 4 — Baseline de CI/ESLint
ESLint ausente em 2/9 (financeiro-ponto-e, rh-pontoe). CI (`.github/workflows`)
só em 2/9 (game-box, rh-pontoe) — o do game-box é limpo e completo (checkout →
setup-node → npm ci → lint → typegen → tsc → test → build), serve de molde.
STG é o único dos 9 com teste de verdade (vitest) — reforça que vale copiar
esse molde de CI em projeto novo desde o dia 1.

### Modal/Dialog — catálogo, não componente único
3 implementações reais (ponto-e-stock, rh-pontoe, game-box), propósitos
genuinamente diferentes (editor de produto, decisão de vaga, carrinho/ebook).
Mesmo padrão das telas: documentar 2-3 direções, não forçar 1 vencedor.

### `cn()`/merge de classe
Só em mundialito (2 linhas, sem clsx/tailwind-merge). Ainda não duplicado,
mas custo zero padronizar agora antes que alguém reinvente diferente.

### Descartado com evidência real (zero ocorrência nos 9 projetos)
Toast, Pagination, Tooltip, Avatar, Skeleton, DatePicker, Breadcrumb, hooks
`useLocalStorage`/`useMediaQuery`/`useClickOutside`, gerador de relatório
único (os 3 casos achados — ebook PDF no game-box, parse de currículo no
rh-pontoe, HTML avulso no ponto-e-stock — são problemas diferentes, não
repetição).

## Os 3 projetos novos (sancho, skillset, STG) — o que são
- **sancho** — React+Vite+TS+Tailwind v4+Supabase. SaaS pra professores
  (6º ano–ensino médio) planejarem aulas com alinhamento à BNCC.
- **skillset** — mesma stack, produto irmão do sancho (mesmo CLAUDE.md
  declara isso). Plataforma pra consultores de T&D montarem programações e
  exportar PDF.
- **STG** — Next.js 16 + Tailwind v4. Microsite institucional (calendário +
  grade curricular) de um seminário teológico, dados estáticos, sem banco/auth.

## Por onde começar (ordem recomendada)
1. Kit de UI — mundialito como fonte de componente, checar compatibilidade de
   estilo com sancho antes de fechar.
2. Módulo de hash de senha (bcrypt) — mesma categoria de risco que já causou
   bug real; NÃO via migração de auth.
3. Formatação de moeda — extração mais barata.
4. Baseline de CI/ESLint — copiar o molde do game-box em todo projeto novo.
