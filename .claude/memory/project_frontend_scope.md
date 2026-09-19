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

**Menu fechado — decisão de forma:** o catálogo produz molde de
referência (HTML/CSS pra copiar/adaptar por projeto), não componente
React empacotado no toolkit. Mesma razão que já bloqueou Button/Card pela
regra dos 3 (sem 3 consumidores reais convergindo, não compensa
empacotar) — evita over-engineering: construir infraestrutura de
distribuição pra um padrão usado uma vez só.

**2026-09-19, segundo caso do catálogo: dashboard.** Usuário pediu pra
avançar pras outras partes; eu (Claude) recomendei fechar o menu primeiro
por causa da regra dos 3, ele delegou de volta ("faça os passos que você
recomendou"). Decisão de forma nova: o shell (sidebar já escolhida) fica
FIXO no catálogo de dashboard — só o conteúdo da área principal varia
entre as 3 direções (A KPI denso/Ponto E, B narrativo/mundialito, C
operacional em tabela, terceira direção sem persona fixa). Isso é
diferente do catálogo do menu (que comparava 3 shells inteiros) porque
agora já existe um shell decidido pra encaixar o conteúdo dentro — logo,
mais realista testar o conteúdo já dentro do shell real do que isolado.
Arquivo: `_visual/dashboard-catalog.html`, testado no browser (3 direções
alternam certo, toggle do shell funciona). Aguardando o usuário escolher/
comentar.

**Dashboard fechado — direção A (KPI denso).** Escolha direta, sem
ajuste pedido desta vez. `_visual/sidebar-collapsible.html` deixou de ser
só o molde do menu e passou a combinar as duas decisões reais (shell +
conteúdo "Visão geral" no formato KPI denso: 6 cards + tabela de
atividade) — decisão de manter tudo em 1 arquivo evolutivo em vez de
espalhar em vários arquivos "decisão final" por tela, já que cada tela
nova reaproveita o shell anterior. B (narrativo) e C (operacional em
tabela) continuam em `dashboard-catalog.html` como alternativas.

**2026-09-19, terceiro caso: login.** Usuário confirmou explicitamente o
enquadramento certo do catálogo inteiro: todo molde (menu, dashboard,
login) é ponto de partida estrutural pra adaptar por projeto — cor,
fonte, conteúdo real e ajustes finos ficam por conta de cada
implementação, o catálogo só evita decidir layout do zero toda vez. Vale
repetir essa frase se o enquadramento ficar confuso de novo no futuro.

Login não reaproveita o shell autenticado (sidebar) — é a tela ANTES do
login, então o catálogo voltou ao formato "3 telas inteiras lado a lado"
(como o do menu), não o formato "conteúdo dentro do shell fixo" (como o
do dashboard). `_visual/login-catalog.html`: A card denso centralizado
(Ponto E), B split screen com painel de marca (mundialito), C minimalista
passwordless — link de acesso por e-mail em vez de senha (terceira
direção, sem persona fixa).

Bug real encontrado e corrigido durante o teste: `hidden` não escondia
as direções porque `.dir-a`/`.dir-b`/`.dir-c` setavam `display:flex`
direto na mesma classe usada pro toggle — CSS de autor com display
explícito sempre vence o `[hidden]{display:none}` do user-agent,
independente de especificidade/ordem. Corrigido com uma regra
`[hidden]{display:none}` explícita por cima. Vale desconfiar desse padrão
(classe com `display` fixo + toggle por atributo `hidden`) em qualquer
catálogo novo — `dashboard-catalog.html` não teve esse bug porque a
classe de toggle (`.dir`) não define `display` diretamente.

Aguardando o usuário escolher uma direção.

**Login fechado — A e B mantidas, não uma única "vencedora".** Diferente
do menu e do dashboard (onde 1 direção virou a base combinada), pro login
o usuário quis manter card denso centralizado (A) E split screen (B)
como duas opções igualmente válidas — provavelmente porque a escolha
entre elas depende mais do produto (interno/utilitário vs. algo com
identidade de marca pra vender) do que de uma preferência estrutural
fixa como a do menu. C (minimalista passwordless) segue no arquivo, só
não foi escolhida. Padrão a levar pra próximos catálogos: "fechar" um
caso não significa sempre reduzir a 1 direção — às vezes o resultado
certo é reduzir o leque (3→2), não convergir pra 1.

Central de ajuda descartada como próximo catálogo: a skill `central-ajuda`
já resolve isso de forma diferente (gera a página de verdade dentro do
projeto real, dados + menu integrados), não faz sentido duplicar como
mockup de comparação.

**2026-09-19, brainstorm de telas restantes + 3 novos catálogos.**
Usuário pediu ideação livre sobre quais outras telas fariam sentido
entrar no catálogo. Levantamento feito a partir do que se repete entre os
5 projetos reais (não invenção livre): listagem de dados, detalhe de
registro, formulário complexo, configurações, estado vazio (esse último
descartado — é padrão pontual, cabe dentro da listagem, não é tela
própria). Usuário escolheu avançar com os 3 primeiros.

Todos os 3 reaproveitam o shell da sidebar (igual dashboard, não como
menu/login que comparam telas inteiras) — decisão consistente: toda tela
"de dentro do app autenticado" nasce dentro do shell já fechado.

- `_visual/listing-catalog.html`: A tabela densa (Ponto E), B grade de
  cards (mundialito, melhor quando a identidade visual de cada item
  importa), C agrupado por status/kanban (terceira direção, pra fluxo de
  trabalho, não só cadastro estático).
- `_visual/detail-catalog.html`: A página cheia com abas, B painel
  lateral/drawer sobre a lista esmaecida (mantém o contexto de onde
  veio), C scroll único com seções empilhadas (bom pra registro com muito
  conteúdo).
- `_visual/form-catalog.html`: cobre o caso "cadastro de verdade" que os
  catálogos anteriores não cobriam (só tinham forms de 3 campos). A
  wizard por etapas com progresso, B página única longa com seções
  espaçadas (mundialito), C acordeão com seções recolhíveis (bom pra
  editar registro já existente — abre só o que precisa mexer).

Todos os 3 testados no browser, as direções alternam certo. Aguardando o
usuário escolher em cada um.
