# Handoff — 2026-09-21 (atualizado)

> Toolkit é **starter kit**: infra/segurança fica dependência real
> versionada; UI/visual vira referência pra copiar uma vez, sem sync depois.
> Nesta sessão: 5 itens de prioridade avaliados (`revisor-impacto` 2x),
> implementados os 3 de baixo risco, 2 corrigidos de rumo com achado real.
> 49 testes passando. Ver `.claude/memory/starter_kit_candidates.md` pro
> survey completo dos 10 projetos que originou a lista.

## ✅ Feito nesta sessão

- **`whatsapp-link` e `cpf`** — extraídos do `acamp-plan`. Conferido por
  leitura direta que o `rh-pontoe` NÃO tinha os bugs que a survey anterior
  sugeria (DDI e CPF já corretos lá).
- **`password-hash`** — extraído do `rh-pontoe`, com um ajuste real: a fonte
  fazia early-return quando não havia hash (vaza por timing se o usuário
  existe); `financeiro-ponto-e` já mitigava isso no próprio login. Promovido
  com a mitigação, não copiado como estava.
- **`session-cookie-core.ts`** — split core (sem import de framework,
  testável) + casca Next.js, mesmo desenho de `supabase-client-core`. Fecha
  o buraco de teste antigo. API pública inalterada.
- **`timing-safe-compare.ts`** — não lança mais `TypeError` quando o segredo
  esperado é `undefined` (env var não configurada virava erro 500).
- **`src/ui/`** — Button/Card/Input/Badge do mundialito, como código-fonte
  pra copiar (fora do build do pacote — ver `src/ui/README.md`).

## ⏳ Pendente — próxima sessão

1. **Formatação de moeda (`Intl.NumberFormat`/`toLocaleString` pt-BR).**
   Duplicada sem função central em ponto-e-stock, financeiro-ponto-e,
   rh-pontoe (contagem exata não fechada — ver nota em
   `starter_kit_candidates.md`). Data já resolvida em
   `proficiencia-ucs/src/lib/format.ts` — promover como está, não é gap.
2. **Baseline de CI/ESLint pra copiar em projeto novo.** Ausente em
   financeiro-ponto-e, rh-pontoe, acamp-plan (3 dos 10). `game-box/.github/
   workflows/ci.yml` é o molde mais limpo (checkout → setup-node → npm ci →
   lint → typegen → tsc → test → build).
3. **Generalizar o padrão de interação "hover revela detalhe."** Demonstrado
   em `_visual/listing-catalog.html` (direção B — tooltip via CSS
   `content:attr(data-tip)`, sem JS de posicionamento). Documentar como
   técnica reaproveitável no catálogo, não como componente.
4. **Sessão explicativa: critérios de ajuste visual além de densidade/escala
   tipográfica** (espaçamento, elevação, raio, contraste, densidade de
   informação, grid/breakpoints, motion). Não é código — usar os catálogos
   já construídos como exemplo de cada critério.
5. **Migração do `mundialito`.** Revisão de impacto já aprovou com
   ressalvas. Não fazer durante a janela do torneio. Ao retomar, prototipar
   `createAccessGate()` DENTRO do `lib/auth/*` do mundialito primeiro
   (revisor-impacto vetou extrair de um esboço isolado).
6. **Bug pequeno em `_visual/design-system-explorer.html`:** badge de
   contraste WCAG trava mostrando valor errado depois de trocar
   paleta+arquétipo+fonte em sequência. Não debugado a fundo.

## 🚫 Fora do toolkit — decisão consciente, não esquecimento

- **Migrar `financeiro-ponto-e` pro `password-hash` do toolkit: não.**
  Adicionar o pacote como dependência numa LAN on-prem custa mais (git +
  credencial do GitHub na máquina de deploy) que o ganho de centralizar 5
  chamadas de bcrypt. Centralização real é local: `financeiro-ponto-e/src/
  lib/senha.ts` (já existe, hospeda `validarSenhaNova`) — sessão própria,
  arquivo por arquivo, com `pg_dump` da tabela `usuario` antes.
- **`session-cookie-core` não destrava o `acamp-plan`.** Motivo era
  assumido errado: acamp-plan é CommonJS, o toolkit é ESM-only —
  `require()` não resolve ESM, cookie store injetável não muda isso. Fora
  disso, o modelo de sessão do acamp-plan é outro (id opaco em Redis, não
  token assinado). Adotar o toolkit lá depende de acamp-plan virar ESM —
  decisão separada, não avaliada ainda.
- **`getClientIp`/`constantTimePasswordMatch` do acamp-plan não entraram.**
  O segundo é o mesmo algoritmo que `timing-safe-compare.ts` já tem
  (sha256 dos dois lados + `timingSafeEqual`) — só ganhou a guarda de tipo,
  aplicada no módulo existente em vez de duplicar. `getClientIp` (Vercel-
  aware) não tem consumidor real ainda — não promovido por enquanto.
- **Kit de UI: só Button/Card/Input/Badge, não os 9 componentes do
  mundialito.** Select/Table/Textarea/Stat/Icon/ConfirmButton ficam pra
  quando fizerem falta de verdade — `icons-esporte.tsx` nem deveria entrar
  (específico de futebol). Empacotar como componente React compilado
  (não só copiar) reverteria a decisão de camadas desta sessão — se
  quiser isso um dia, é sessão própria de infra (jsx, react peer,
  vitest+jsdom, `@source` nos consumidores).

## 🧠 Decisões que afetam o próximo passo

- **Modelo do toolkit: starter kit, não dependência sincronizada.** Infra/
  segurança = dependência real versionada (bug corrigido precisa propagar).
  UI/visual = copiar uma vez, sem sync.
- Branch `chore/token-accent-rename` (ponto-e-stock) — ficou aberta sem
  merge, de propósito. Não precisa resolver.
- Regra dos 3 segue valendo como filtro: só promover pro toolkit quando 2-3
  projetos reais convergem na MESMA necessidade.
- Todo catálogo (`_visual/*-catalog.html`) é molde de referência pra
  copiar/adaptar, não componente empacotado. Cor e tipografia ficam sempre
  fora de propósito.
- `design-tokens.css`: o contrato é o NOME da variável, não o valor.
- `supabase-client-core.ts`/`session-cookie-core.ts`: padrão pra dividir
  módulo entre lógica pura (testável, sem import de framework) e casca
  Next.js (`server-only` + API específica). Usar de novo se aparecer mais
  um módulo preso a `next/headers`/`server-only`.
- Todo `exports` do `package.json` precisa da condição `default` além de
  `import`/`types`. Pacote é ESM-only.
- **Painel de navegador do Claude Code não é suficiente pra julgamento visual
  fino** — testar no navegador real antes de fechar decisão de design.

## 📁 Arquivos relevantes

- `.claude/memory/starter_kit_candidates.md` — survey completo dos 10
  projetos, com evidência e prioridade original (antes do veredito do
  revisor-impacto desta sessão, que ajustou os itens 3 e 4).
- `.claude/memory/project_frontend_scope.md` — histórico de catálogo de
  tela e da reexaminação de Button/Card.
- `src/ui/README.md` — como usar o kit de UI copiável.
