---
name: project-frontend-scope
description: Decisão de expandir o toolkit pra front-end/UX (2026-09-19); tokens shippados, próximo passo é catálogo de exemplos de tela por direção estrutural, começando pelo menu
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

Ao explorar o item 2 (Button/Card), achado real: as implementações de
mundialito/proficiencia-ucs/ponto-e-stock divergem de propósito (variantes,
raio, `forwardRef`, loading state) — não é o mesmo código repetido, é o
mesmo problema resolvido diferente 3 vezes. Extração de componente único
foi **rejeitada por enquanto** (bateria contra a mesma regra dos 3 que já
travou o `createAccessGate()`).

**Item 2 evoluiu/foi substituído por uma ideia maior, ainda em aberto:**
em vez de "biblioteca de componentes" ou "biblioteca de estilos de
cor/fonte", o usuário quer um **catálogo de exemplos de TELA inteira, em
direções estruturalmente diferentes** (não só cor/tokens — layout de
verdade, ex. 3 menus de navegação bem diferentes entre si), pra escolher
uma direção ANTES de desenhar o sistema de verdade — evitar reconstruir do
zero a cada projeto. Primeiro teste combinado: **menu de navegação**.
Duas personas reais como âncora: família Ponto E (financeiro-ponto-e,
rh-pontoe, ponto-e-stock) = prático/funcional; mundialito = mais refinado
esteticamente. Cor e fonte ficam FORA desse catálogo (variam por projeto,
por decisão explícita do usuário) — o eixo é estrutura + espaçamento/peso.
A ideia intermediária de "2 perfis de densidade" (Prático/Refinado, via os
sliders Densidade/Escala tipo do explorer) não foi descartada, só ficou
pra trás — cotada como mecanismo por trás das direções do menu.
Detalhe/prompt de retomada completo: `HANDOFF.md` na raiz do projeto.

**Why:** o usuário sentiu que o projeto tinha desviado do que ele queria
(modularidade tipo "móveis modulados", focado em interface) e quase
descartou o trabalho já feito antes de perceber que eram coisas diferentes
(infra real vs. front-end que ainda não tinha começado). A ideia de
catálogo de telas surgiu depois de perceber que cor/fonte/densidade
abstratas não bastavam — ele queria comparar algo concreto e reconhecível
(uma tela de verdade) antes de decidir uma direção.

**How to apply:** ao retomar, começar pelo menu (regra dos 3 — provar o
formato com 1 caso antes de generalizar pra outras telas), usando as duas
personas reais (Ponto E / mundialito) como pelo menos 2 das direções
mostradas.

**2026-09-19, primeira versão construída:** `_visual/menu-catalog.html` —
3 direções estruturais lado a lado (A: sidebar densa/Ponto E, B: topbar
espaçosa/mundialito, C: rail colapsável + command bar, terceira direção sem
persona fixa). Mecanismo confirmado com o usuário: reaproveita os sliders
Densidade/Escala tipo (`--sp`/`--ts`) do `_visual/explorer.html`, aplicados
globalmente às 3 direções ao mesmo tempo (não por direção) para comparação
direta na mesma configuração. Cor e tipografia ficam fixas/neutras (fora de
propósito, por decisão já registrada).

Durante a construção o usuário trouxe um ajuste de escopo: não queria só o
menu isolado, queria ver o menu já dentro de "páginas exemplo do sistema" —
e esclareceu que "componentes" ali significava elementos/estrutura de
página, não componentes de UI reutilizáveis em código (isso mantém o item 2
do catálogo — Button/Card — rejeitado por enquanto, sem contradição). Cada
uma das 3 direções ganhou 2 páginas alternáveis por abas (Visão geral +
Cadastro/formulário) usando o MESMO shell de menu, pra avaliar a direção
across tipos de tela reais, não só numa tela solta.

Arquivo é standalone (sem dependência do explorer.html), só reaproveita o
mesmo padrão de tokens CSS + `--sp`/`--ts`. Interativo funciona no browser
pane mesmo fora da pasta raiz do projeto (worktree) — confirmado ao vivo,
diferente do aviso antigo sobre o explorer.html (que pode já estar
desatualizado, vale reconferir se aparecer de novo).

**2026-09-19, direção escolhida:** usuário gostou da C (rail/sidebar
colapsável). Correção de enquadramento importante que aconteceu aqui: eu
apresentei a escolha como "qual das 3 vence" e o usuário reagiu — a
intenção dele nunca foi eliminar A/B, só decidir qual vira sistema de
verdade primeiro. "Escolher uma direção" (linguagem do HANDOFF antigo)
significa ordem de construção, não descarte das outras. Ajustar esse
enquadramento em qualquer decisão futura do tipo "escolha entre opções
geradas" — perguntar/expor como priorização, não eliminação, a menos que o
usuário diga explicitamente que quer descartar as não-escolhidas.

Ajustes que o usuário pediu sobre a direção C: escuro (já era) e SEM
reduzir a densidade/espaçamento que já estava ali — ele testou a ideia de
"menos espaçoso" e recuou, preferiu manter o espaçamento original do
catálogo. Sem certeza se precisa de command bar — tirado por ora (YAGNI),
documentar se pedir de volta. Resultado: `_visual/sidebar-collapsible.html`,
com toggle de verdade (ícone-only ↔ ícone+label), não só um rail estático
como a direção C original do catálogo.
