# Handoff — 2026-09-19 (atualizado)

> `v0.4.0` no ar, repo público: `github.com/edukern/edukern-toolkit`. 27
> testes passando, CI ativo. `design-tokens.css` (esqueleto de tokens,
> migrado de `~/.claude/templates/`) é o primeiro módulo de front-end do
> toolkit — ver `README.md`/`CHANGELOG.md`.

## ⏳ Pendente

1. **Próximo passo real: catálogo de exemplos de tela por direção
   estrutural, começando pelo menu.** Ideia amadureceu nesta sessão (ver
   `.claude/memory/project_frontend_scope.md`) — não é mais "biblioteca de
   cor/fonte", é: gerar 2-3 versões de uma MESMA tela, estruturalmente
   diferentes entre si (não só cor/espaçamento — layout mesmo, ex. menu
   lateral vs. topo vs. estilo command-palette), o usuário aponta a
   direção que quer, e só DAÍ o sistema de verdade é desenhado a partir
   dali. Objetivo: parar de reconstruir do zero a cada projeto.
   - Escopo combinado: **começar só pelo menu de navegação** (regra dos 3 —
     provar o formato com 1 caso antes de generalizar pra outras telas).
   - Duas personas reais já ancoradas pelo usuário, usar como pelo menos 2
     das direções do menu: **família Ponto E** (financeiro-ponto-e,
     rh-pontoe, ponto-e-stock) = prático/funcional, densidade alta, pouco
     ornamento; **mundialito** = mais cuidado esteticamente, mais respiro.
   - Ideia intermediária de "2 perfis de densidade/peso" (Prático vs.
     Refinado, baseada nos sliders `Densidade`/`Escala tipo` do explorer)
     foi levantada e NÃO foi rejeitada, só ficou pra trás quando o usuário
     pediu algo mais concreto (exemplos de tela reais, não só tokens
     abstratos). Vale reconsiderar como MECANISMO por trás das direções do
     menu, não como proposta rival.
   - Cor e tipografia de fonte ficam de fora desse catálogo — o usuário foi
     explícito: variam projeto a projeto, não são o eixo de diferenciação
     aqui. O eixo é estrutura/layout + espaçamento/peso.
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
v0.4.0 no ar (design-tokens.css shippado). Próximo passo real: montar um
catálogo de exemplos de tela por direção ESTRUTURAL (não só cor/fonte,
layout mesmo), começando pelo menu de navegação — gerar 2-3 versões bem
diferentes (pelo menos uma no espírito "família Ponto E" = prático/denso,
uma no espírito "mundialito" = mais refinado/espaçoso), mostrar lado a
lado, deixar o usuário escolher a direção antes de desenhar o sistema de
verdade. Cor e fonte ficam FORA do catálogo (variam por projeto). Antes de
construir: confirmar com o usuário se o mecanismo por trás das direções
reaproveita os sliders de Densidade/Escala tipo do design-system-explorer.html
(ideia intermediária levantada, não descartada). Seguir formato de resposta
do CLAUDE.md global (TL;DR + Preciso de você, sem seção de risco de
rotina) e explicar o "porquê" de qualquer princípio nomeado aplicado.
```
