# Handoff — 2026-09-19 (atualizado)

> `v0.4.0` no ar, repo público: `github.com/edukern/edukern-toolkit`. 27
> testes passando, CI ativo. `design-tokens.css` (esqueleto de tokens,
> migrado de `~/.claude/templates/`) é o primeiro módulo de front-end do
> toolkit — ver `README.md`/`CHANGELOG.md`.

## ⏳ Pendente

1. **Direção C (rail/sidebar colapsável) escolhida como base real** —
   ver `_visual/sidebar-collapsible.html`. Escuro, colapsa de verdade
   (ícone-only ↔ ícone+label via botão), sem command bar (usuário não
   tinha certeza se precisava — tirado por YAGNI, adicionar se fizer
   falta). Densidade/escala mantidas no padrão do catálogo (`--sp:1`/
   `--ts:1.15`) — usuário pediu explicitamente pra NÃO reduzir o
   espaçamento que já estava na direção C original.
   - A (sidebar densa/Ponto E) e B (topbar espaçosa/mundialito)
     **não foram descartadas** — continuam em `_visual/menu-catalog.html`
     como alternativas pra projetos que combinem mais com elas. Escolher
     C não significa "vencedora única", só define o que vira sistema de
     verdade primeiro.
   - **Próximo passo:** promover `sidebar-collapsible.html` de mockup
     standalone pra estrutura reaproveitável de verdade (provavelmente
     junto de `design-tokens.css`, já que cor/tipografia ficam fora por
     decisão — o que falta é a ESTRUTURA: rail/sidebar + shell de
     página). Ainda não decidido se isso vira CSS puro (como os tokens)
     ou exige componente React — depende de como o item 2 do
     `project_frontend_scope.md` (Button/Card, hoje rejeitado pela regra
     dos 3) evoluir.
   - **Regra dos 3 ainda vale:** não generalizar esse formato de catálogo
     pra outras telas (dashboard, login, etc.) até esse 1 caso (menu)
     fechar de verdade — a escolha da direção fechou, falta promover pra
     estrutura real.
2. **Migração do `mundialito`** — revisão de impacto já aprovou com
   ressalvas. Não fazer durante a janela do torneio. Ao retomar,
   prototipar a composição de `createAccessGate()` DENTRO do `lib/auth/*`
   do mundialito primeiro (revisor-impacto vetou extrair pro toolkit de um
   esboço isolado — ver `project_personal_library_audit.md`).
3. **Buracos de teste na cola:** `setSignedCookie`/`clearSignedCookie`/
   `readSignedCookie` (`session-cookie.ts`) continuam sem teste —
   `next/headers` não resolve fora do bundler do Next, nem com
   `mock.module`. Fechar de verdade exige (a) teste de integração dentro
   de uma app Next real, ou (b) mudar `session-cookie.ts` pra aceitar um
   cookie store injetável. Decisão de design em aberto, não é só "faltou
   tentar".
4. **Arquivo duplicado pendente de remoção manual pelo usuário** (bloqueio
   de segurança impediu apagar automaticamente):
   ```bash
   rm "C:/Users/eduke/.claude/templates/design-tokens.css"
   ```
5. **Bug pequeno encontrado no `design-system-explorer.html`:** o badge de
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
