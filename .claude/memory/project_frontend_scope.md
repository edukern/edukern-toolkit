---
name: project-frontend-scope
description: Decisão sobre expandir o toolkit pra front-end/UX, feita em 2026-09-19; design-tokens.css foi o primeiro módulo
metadata:
  type: project
---

Em 2026-09-19 o usuário parou pra questionar se o toolkit tinha ido pro
lado errado (só infra/auth, "elefante branco de documentação"). Depois de
conversa, decisão: o toolkit deveria também cobrir front-end/UX, não só
infra — mas isso é grande demais pra um pedaço só, então foi quebrado em
sub-projetos, cada um sua própria conversa de design:

1. **Tokens visuais** (cores, fontes, espaçamento) — feito nesta sessão,
   ver `design-tokens.css` no README e CHANGELOG v0.4.0.
2. **Componentes de UI** (Button, Card, Input, banner, grid) — não
   iniciado. Vai precisar resolver como distribuir React+Tailwind entre
   pacote e consumidor (Tailwind v4 escaneia classe via content — checar se
   funciona através de `node_modules` antes de prometer isso pronto).
3. **Padrões de interação** (erro, loading, notificação) — não iniciado,
   depende do item 2.
4. **Telas inteiras** (central de ajuda, login, dashboard) — não iniciado;
   suspeita é que vira "molde pra copiar/adaptar" em vez de import direto,
   por serem mais específicas de cada projeto.

Confirmado por grep real (não suposição): 4 dos 5 projetos atuais
(mundialito, proficiencia-ucs, ponto-e-stock, game-box) já usam os mesmos
nomes de token (`--color-accent`, `--color-canvas`, `--color-ink`). O
keenfisher tem sistema de tokens próprio e ficou de fora — não é
esquecimento, é intencional (marca com identidade própria).

A decisão sobre os módulos `signed-session`/`session-cookie` (formalizar ou
não a sessão HMAC caseira do mundialito) ficou resolvida na mesma sessão:
mantém como está — ver [PEGADINHAS.md](../../PEGADINHAS.md) e README.

**Why:** o usuário sentiu que o projeto tinha desviado do que ele queria
(modularidade tipo "móveis modulados", focado em interface) e quase
descartou o trabalho já feito antes de perceber que eram coisas diferentes
(infra real vs. front-end que ainda não tinha começado).

**How to apply:** ao retomar o item 2 (componentes de UI), começar
validando a distribuição React+Tailwind entre pacote e consumidor antes de
desenhar a API dos componentes — é o ponto técnico mais arriscado da lista.
