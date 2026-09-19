# Handoff — 2026-09-19 (atualizado)

> `v0.4.0` no ar, repo público: `github.com/edukern/edukern-toolkit`. 27
> testes passando, CI ativo. `design-tokens.css` (esqueleto de tokens,
> migrado de `~/.claude/templates/`) é o primeiro módulo de front-end do
> toolkit — ver `README.md`/`CHANGELOG.md`.

## ⏳ Pendente

1. **Menu fechado.** Direção C (sidebar colapsável escura,
   `_visual/sidebar-collapsible.html`) é o molde de referência real —
   decidido que o catálogo produz "molde pra copiar/adaptar" por projeto,
   não componente React empacotado (mesma lógica que já rejeitou extrair
   Button/Card pela regra dos 3: sem 3 consumidores reais convergindo,
   não vira pacote). A (sidebar densa/Ponto E) e B (topbar espaçosa/
   mundialito) continuam em `_visual/menu-catalog.html` como alternativas,
   não foram descartadas.
2. **Dashboard fechado — direção A (KPI denso).** `_visual/
   sidebar-collapsible.html` agora combina as duas decisões: shell da
   sidebar (menu) + conteúdo "Visão geral" no formato KPI denso (grade de
   6 indicadores + tabela de atividade), testado no browser. B (narrativo/
   mundialito) e C (operacional em tabela) continuam em
   `_visual/dashboard-catalog.html` como alternativas, não descartadas.
3. **Terceiro caso do catálogo, em andamento: login.**
   `_visual/login-catalog.html` — login não herda o shell autenticado
   (é a tela antes dele), por isso volta ao formato de comparar telas
   inteiras, como o catálogo do menu. 3 direções: A card denso centralizado
   (Ponto E), B split screen com painel de marca (mundialito), C
   minimalista passwordless (terceira direção, sem persona fixa — link de
   acesso por e-mail em vez de senha). Testado no browser (achei e
   corrigi um bug real: `hidden` não escondia as direções B/C porque
   `.dir-a/.dir-b/.dir-c` setavam `display:flex` direto na mesma classe
   usada pro toggle — corrigido com `[hidden]{display:none}` explícito;
   vale checar esse padrão se aparecer de novo em catálogos futuros).
   **Login fechado — A e B mantidas como duas opções igualmente válidas**
   (o usuário pediu explicitamente pra não eliminar nenhuma das duas,
   diferente do menu/dashboard onde uma única direção virou a base). C
   (minimalista passwordless) continua no arquivo, mas não foi escolhida.
   - Central de ajuda **não vai virar catálogo** — a skill `central-ajuda`
     já resolve isso de outro jeito (gera a página de verdade dentro do
     projeto real, com dados e menu integrados), não faz sentido duplicar
     como mockup de comparação.
   - **Lembrete confirmado com o usuário:** todo molde do catálogo
     (menu, dashboard, login) é ponto de partida estrutural pra
     adaptar por projeto, não implementação final pronta pra importar.
4. **Listagem, detalhe e formulário — os 3 fechados.**
   - **Listagem fechada:** A (tabela densa) é o padrão. B (grade de
     cards) mantida como secundária, só pra entidades onde a identidade
     visual do item importa (funcionário, equipe — não lançamento
     financeiro). C (kanban) não faz parte da decisão de listagem — vira
     uma view especializada futura ("ver por status"), não um estilo de
     lista genérico.
   - **Detalhe fechado — C (scroll único) é o padrão**, A (abas) mantida
     como alternativa pra registros com muita informação distinta
     (documentos, histórico extenso). B (painel lateral) tinha um bug
     real de posicionamento — o usuário viu no navegador de verdade
     (`_visual/detail-catalog.html` aberto localmente) e o painel
     aparecia flutuando, sem encostar nas bordas. Causa: o
     `position:relative` estava no `<div class="dirpane dim-list">`
     (altura = só o conteúdo, curta) em vez de `.main` (que já tinha
     `position:relative` e estica pra altura cheia via flexbox) —
     corrigido removendo o `position:relative` inline duplicado.
     Confirmado corrigido a 1400px de largura. Mesmo com o bug corrigido,
     o usuário disse que não gosta do padrão painel lateral por preferência
     pessoal — não é só o bug. B segue no arquivo, sem o bug, mas não foi
     escolhida.
   - **Formulário mantido como estava:** A (wizard) pra criar um registro
     novo, C (acordeão) pra editar um existente — usos diferentes, não
     concorrentes, igual ao raciocínio do login. B (página única) como
     fallback neutro.
   - Referência real trazida pelo usuário: o formulário que candidatos
     preenchem no `rh-pontoe` é um bom exemplo a olhar quando for
     desenhar o formulário de verdade (não conferido ainda nesta sessão
     — `rh-pontoe` não estava aberto).
5. **Migração do `mundialito`** — revisão de impacto já aprovou com
   ressalvas. Não fazer durante a janela do torneio. Ao retomar,
   prototipar a composição de `createAccessGate()` DENTRO do `lib/auth/*`
   do mundialito primeiro (revisor-impacto vetou extrair pro toolkit de um
   esboço isolado — ver `project_personal_library_audit.md`).
6. **Buracos de teste na cola:** `setSignedCookie`/`clearSignedCookie`/
   `readSignedCookie` (`session-cookie.ts`) continuam sem teste —
   `next/headers` não resolve fora do bundler do Next, nem com
   `mock.module`. Fechar de verdade exige (a) teste de integração dentro
   de uma app Next real, ou (b) mudar `session-cookie.ts` pra aceitar um
   cookie store injetável. Decisão de design em aberto, não é só "faltou
   tentar".
7. **Arquivo duplicado pendente de remoção manual pelo usuário** (bloqueio
   de segurança impediu apagar automaticamente):
   ```bash
   rm "C:/Users/eduke/.claude/templates/design-tokens.css"
   ```
8. **Bug pequeno encontrado no `design-system-explorer.html`:** o badge de
   contraste WCAG às vezes trava mostrando `1.00:1`/valores errados em
   todos os pares depois de trocar paleta+arquétipo+fonte em sequência,
   mesmo com o texto visivelmente legível na tela — parece cálculo não
   recalculando ou lendo os sliders OKLCH errados. Não debugado a fundo.
   Vale corrigir antes de confiar nele pra decisão de cor de verdade.

## 🧠 Decisões que afetam o próximo passo

- Regra dos 3 aplicada a Button/Card: código real de mundialito/
  proficiencia-ucs/ponto-e-stock diverge de propósito (variantes, raio,
  `forwardRef`, estado de loading) — **não** virou componente único no
  toolkit. Só o `cn`/merge de classe também não bateu o padrão (só
  mundialito tem). Antes de extrair um Button/Card real, esperar
  repetição de verdade — não forçar convergência agora.
- Todos os 5 projetos (mundialito, proficiencia-ucs, keenfisher-repo,
  ponto-e-stock, game-box) rodam a mesma stack: Next.js + React 19 +
  Tailwind v4. `keenfisher-repo` tem sistema de tokens próprio, de
  propósito fora do escopo do catálogo compartilhado.
  4 dos 5 (exceto keenfisher) já usam os mesmos nomes de token
  (`--color-accent`, `--color-canvas`, `--color-ink`...).
- Tailwind v4 não escaneia `node_modules` por padrão — pra um componente
  React do toolkit funcionar estilizado num projeto consumidor, o
  projeto precisa de uma linha `@source "../node_modules/@edukern/toolkit";`
  no CSS global (confirmado na doc oficial). Não é bloqueio, só um passo a
  documentar quando existir componente de verdade pra distribuir.
- Modelo é pacote via git dependency, não monorepo — motivo em `CLAUDE.md`.
- `supabase-client` importa `server-only` incondicionalmente (proposital);
  consumidor que compartilha o módulo entre Next e script standalone usa
  `supabase-client-node`.
- Todo `exports` do `package.json` precisa da condição `default` além de
  `import`/`types` (compat `tsx`). Manter em módulos novos, incluindo os
  de CSS/front-end.
- Pacote é ESM-only.

## 📁 Arquivos relevantes

- `.claude/memory/project_frontend_scope.md` — histórico da decisão de
  expandir pro front-end e do amadurecimento da ideia (tokens → biblioteca
  de estilo → densidade/peso → catálogo de exemplos de tela). Atualizar ao
  retomar.
- `src/design-tokens.css` — esqueleto de tokens já shippado (v0.4.0).
- `_visual/menu-catalog.html` — o catálogo em si (3 direções + sliders).
  Standalone, sem dependência do explorer.html. Abrir no browser pane
  (funciona interativo mesmo rodando de dentro do worktree/pasta do
  projeto).
- `_visual/explorer.html` — cópia do Design System Explorer, já dentro do
  projeto (interativo no browser pane só funciona daqui, não de fora da
  pasta). Tem o bug do item 5 acima.
- `D:\projetos\mundialito\.claude\memory\project_personal_library_audit.md`
  — histórico completo do audit original (33+ repos, clusters, decisões,
  revisões de impacto). Só relevante pros itens 2/3 do Pendente.

---
▶ PROMPT DE RETOMADA

```
Leia HANDOFF.md em D:\projetos\edukern-toolkit e .claude/memory/project_frontend_scope.md.
Catálogo de menus pronto em _visual/menu-catalog.html (3 direções: sidebar
densa/Ponto E, topbar espaçosa/mundialito, rail colapsável+command bar;
sliders Densidade/Escala tipo ajustam as 3 juntas). Pergunte ao usuário qual
direção ele escolheu (ou se quer mix) e a partir dali desenhe o sistema de
tokens/estrutura real do menu. Cor e fonte continuam fora de escopo. Regra
dos 3: não generalizar o formato de catálogo pra outras telas até esse caso
fechar. Seguir formato de resposta do CLAUDE.md global (TL;DR + Preciso de
você, sem seção de risco de rotina) e explicar o "porquê" de qualquer
princípio nomeado aplicado.
```
