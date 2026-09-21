# Handoff — 2026-09-21 (atualizado)

> Toolkit é **starter kit**: infra/segurança fica dependência real
> versionada; UI/visual vira referência pra copiar uma vez, sem sync depois.
> Fila de 6 itens da sessão anterior: 5 feitos, 1 bloqueado esperando você
> (item 1 abaixo). 54 testes passando.

## ⏳ Pendente — esperando decisão sua

1. **Migração do `mundialito` (`createAccessGate()`).** Aprovada com
   ressalvas por revisor-impacto numa sessão anterior, com a condição "não
   fazer durante a janela do torneio" — **não achei a data dessa janela nem
   o arquivo de memória que o HANDOFF antigo citava como fonte do veto**
   (`project_personal_library_audit.md`, referenciado mas não encontrado em
   `mundialito/.claude/memory/`). Também achei 18 commits locais no
   mundialito ainda não publicados (`plano-7-8-autonomia.md`) — sinal de
   trabalho em andamento por lá. Preciso que você confirme: (a) o torneio
   já passou? (b) sabe onde ficou o parecer original do
   `createAccessGate()`? Só então prototipar DENTRO do `lib/auth/*` do
   mundialito primeiro (não extrair de esboço isolado).

## ✅ Feito

- **`whatsapp-link`, `cpf`, `password-hash`** — extraídos do `acamp-plan`/
  `rh-pontoe`, com achados reais corrigidos ao promover (ver Changelog).
- **`session-cookie-core.ts`** — split core testável + casca Next.js.
- **`timing-safe-compare.ts`** — guarda de tipo (não lança mais com
  segredo `undefined`).
- **`src/ui/`** — Button/Card/Input/Badge do mundialito, código-fonte pra
  copiar.
- **`currency-br`** (`formatBRL`) — sem `Intl`, por motivo real (locale
  ICU mínimo no Windows). Fonte: `financeiro-ponto-e/src/lib/formato.ts`.
- **`templates/`** — `eslint.config.mjs` + `ci.yml` genéricos, fonte
  `game-box`.
- **`_visual/patterns.md`** — padrão "hover revela detalhe" documentado.
- **Bug do badge WCAG corrigido** — `_visual/explorer.html` trocou
  DOM-probe (`getComputedStyle`, frágil — cor CSS inválida falha em
  silêncio e deixa valor grudado) por cálculo OKLCH→luminância em
  matemática pura. Verificado ao vivo: sequência paleta→arquétipo→
  fonte→paleta dá valores corretos em cada passo, sem nenhum "1.00:1"
  preso.
- **Sessão explicativa de vocabulário de ajuste visual** — entregue em
  chat (espaçamento, elevação, raio, contraste, densidade, grid, motion),
  usando os catálogos existentes como exemplo de cada critério.

## 🚫 Fora do toolkit — decisão consciente, não esquecimento

- **Migrar `financeiro-ponto-e` pro `password-hash` do toolkit: não.**
  Adicionar o pacote como dependência numa LAN on-prem custa mais (git +
  credencial do GitHub na máquina de deploy) que o ganho de centralizar 5
  chamadas de bcrypt. Centralização real é local: `financeiro-ponto-e/src/
  lib/senha.ts` (já existe) — sessão própria, arquivo por arquivo, com
  `pg_dump` da tabela `usuario` antes.
- **`session-cookie-core` não destrava o `acamp-plan`.** acamp-plan é
  CommonJS, o toolkit é ESM-only — `require()` não resolve ESM. Fora
  disso, o modelo de sessão do acamp-plan é outro (id opaco em Redis, não
  token assinado). Adotar o toolkit lá depende de acamp-plan virar ESM —
  decisão separada, não avaliada.
- **`getClientIp`/`constantTimePasswordMatch` do acamp-plan não entraram.**
  O segundo é o mesmo algoritmo que `timing-safe-compare.ts` já tinha — só
  ganhou a guarda de tipo. `getClientIp` sem consumidor real ainda.
- **Kit de UI: só Button/Card/Input/Badge**, não os 9 componentes do
  mundialito — resto fica pra quando fizer falta de verdade. Empacotar
  como componente React compilado reverteria a decisão de camadas desta
  sessão.

## 🧠 Decisões que afetam o próximo passo

- **Modelo do toolkit: starter kit, não dependência sincronizada.** Infra/
  segurança = dependência real versionada. UI/visual = copiar uma vez, sem
  sync.
- Regra dos 3 segue valendo como filtro: só promover pro toolkit quando
  2-3 projetos reais convergem na MESMA necessidade.
- Todo catálogo (`_visual/*-catalog.html`) é molde de referência pra
  copiar/adaptar, não componente empacotado.
- `design-tokens.css`: o contrato é o NOME da variável, não o valor.
- `supabase-client-core.ts`/`session-cookie-core.ts`: padrão pra dividir
  módulo entre lógica pura (testável) e casca Next.js (`server-only`).
  Usar de novo se aparecer mais um módulo preso a `next/headers`.
- Todo `exports` do `package.json` precisa da condição `default` além de
  `import`/`types`. Pacote é ESM-only.
- **Painel de navegador do Claude Code não é suficiente pra julgamento
  visual fino** — mas dá pra testar LÓGICA (ex.: `ratio()` do
  `explorer.html`) via `javascript_tool` direto no console da página, sem
  depender de screenshot.

## 📁 Arquivos relevantes

- `.claude/memory/starter_kit_candidates.md` — survey completo dos 10
  projetos.
- `.claude/memory/project_frontend_scope.md` — histórico de catálogo de
  tela e reexaminação de Button/Card.
- `src/ui/README.md`, `templates/README.md` — como usar cada um.
- `mundialito/.claude/memory/plano-7-8-autonomia.md` — 18 commits locais
  não publicados, relevante pro item 1 pendente.
