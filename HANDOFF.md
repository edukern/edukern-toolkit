# Handoff — 2026-09-19 (atualizado)

> `v0.4.0` no ar, repo público: `github.com/edukern/edukern-toolkit`. 27
> testes passando, CI ativo. Catálogo de telas por direção estrutural
> completo: menu, dashboard, login, listagem, detalhe, formulário — os 6
> fechados. Ver `.claude/memory/project_frontend_scope.md` pro histórico
> completo das decisões (esse handoff só lista o que falta fazer).

## ⏳ Pendente — próxima sessão

1. **Módulo de link de WhatsApp pré-preenchido** (`src/whatsapp-link.ts`
   ou nome equivalente). Função pura: monta um link
   `https://wa.me/<telefone>?text=<mensagem codificada>` que abre o
   WhatsApp do destinatário com a mensagem pronta — sem pagar API do
   WhatsApp Business. Padrão real usado no `rh-pontoe` pra avisar
   candidato de processo seletivo. Sem dependência, não esbarra na regra
   dos 3 (não há lógica divergente entre projetos pra convergir). Seguir
   o estilo dos módulos `src/*.ts` já existentes (`signed-session.ts`,
   `secure-cookie-option.ts`) — função pura + teste `*.test.ts` simples.
2. **Generalizar o padrão de interação "hover revela detalhe."**
   Demonstrado em `_visual/listing-catalog.html` (direção B — passar o
   mouse numa barra do mini-gráfico mostra o detalhe do dia via CSS
   `content:attr(data-tip)`, sem poluir a tela). Vale documentar como
   padrão reaproveitável pra qualquer gráfico/mini-visualização futura
   do toolkit.
3. **Sessão explicativa: outros critérios de ajuste visual além de
   densidade/escala tipográfica.** O usuário quer entender o vocabulário
   usado em dev web/mobile pra conseguir pedir mudanças de tela sem saber
   o termo exato — não é implementação, é explicar com exemplos práticos
   critérios como: escala de espaçamento, elevação/sombra, raio de borda,
   contraste, densidade de informação, grid/breakpoints, hierarquia
   tipográfica, peso de ícone, velocidade de transição/motion, etc. Ideal
   tecer a explicação com os sliders que já existem (`_visual/
   explorer.html`, `_visual/menu-catalog.html` e os catálogos novos) como
   exemplo concreto de cada critério, não uma lista abstrata solta.
4. **Migração do `mundialito`** — revisão de impacto já aprovou com
   ressalvas. Não fazer durante a janela do torneio. Ao retomar,
   prototipar a composição de `createAccessGate()` DENTRO do `lib/auth/*`
   do mundialito primeiro (revisor-impacto vetou extrair pro toolkit de
   um esboço isolado — ver `project_personal_library_audit.md`).
5. **Buracos de teste na cola:** `setSignedCookie`/`clearSignedCookie`/
   `readSignedCookie` (`session-cookie.ts`) continuam sem teste —
   `next/headers` não resolve fora do bundler do Next, nem com
   `mock.module`. Fechar de verdade exige (a) teste de integração dentro
   de uma app Next real, ou (b) mudar `session-cookie.ts` pra aceitar um
   cookie store injetável. Decisão de design em aberto.
6. **Bug pequeno no `_visual/design-system-explorer.html`:** o badge de
   contraste WCAG às vezes trava mostrando `1.00:1`/valores errados em
   todos os pares depois de trocar paleta+arquétipo+fonte em sequência.
   Não debugado a fundo. Vale corrigir antes de confiar nele pra decisão
   de cor de verdade.

## 🧠 Decisões que afetam o próximo passo

- Todo catálogo (`_visual/*-catalog.html`) é **molde de referência pra
  copiar/adaptar por projeto**, não componente React empacotado — mesma
  lógica que já rejeitou extrair Button/Card pela regra dos 3 (sem 3
  consumidores reais convergindo, não compensa empacotar). Cor e
  tipografia ficam sempre fora de propósito nos catálogos (variam por
  projeto).
- Direções escolhidas até agora (nenhuma elimina as outras do arquivo,
  só define prioridade): menu = sidebar colapsável escura; dashboard =
  KPI denso; login = card denso E split screen (as duas, contexto
  decide); listagem = tabela E card denso (usos diferentes, não
  hierarquia); detalhe = scroll único (painel lateral descartado por
  preferência, não só bug); formulário = wizard pra criar E acordeão pra
  editar (as duas).
- Regra dos 3 aplicada a Button/Card: código real de mundialito/
  proficiencia-ucs/ponto-e-stock diverge de propósito (variantes, raio,
  `forwardRef`, estado de loading) — **não** virou componente único no
  toolkit. Esperar repetição de verdade antes de extrair.
- Tailwind v4 não escaneia `node_modules` por padrão — um componente
  React do toolkit precisa de `@source "../node_modules/@edukern/toolkit";`
  no CSS global do consumidor (confirmado na doc oficial). Só relevante
  quando existir componente de verdade pra distribuir.
- Modelo é pacote via git dependency, não monorepo — motivo em `CLAUDE.md`.
- `supabase-client` importa `server-only` incondicionalmente (proposital);
  consumidor que compartilha o módulo entre Next e script standalone usa
  `supabase-client-node`.
- Todo `exports` do `package.json` precisa da condição `default` além de
  `import`/`types` (compat `tsx`). Manter em módulos novos.
- Pacote é ESM-only.
- **Painel de navegador do Claude Code não é suficiente pra julgamento
  visual fino** — já rendeu um falso-negativo (bug de CSS só apareceu
  quando o usuário abriu o arquivo no navegador real dele). Oferecer o
  caminho do arquivo pro usuário conferir localmente antes de fechar
  decisão de design.

## 📁 Arquivos relevantes

- `.claude/memory/project_frontend_scope.md` — histórico completo de
  todas as decisões de catálogo desta sessão (o quê, por quê, exemplos
  reais trazidos pelo usuário). Ler antes de continuar qualquer item do
  front-end.
- `_visual/*-catalog.html` (menu, dashboard, login, listing, detail,
  form) + `_visual/sidebar-collapsible.html` (menu+dashboard combinados,
  o molde mais "pronto" dos seis).
- `src/*.ts` — módulos existentes, referência de estilo pro módulo novo
  do WhatsApp (item 1 do Pendente).
- `D:\projetos\mundialito\.claude\memory\project_personal_library_audit.md`
  — só relevante pro item 4 do Pendente (migração mundialito).

---
▶ PROMPT DE RETOMADA

```
Leia HANDOFF.md em D:\projetos\edukern-toolkit e .claude/memory/project_frontend_scope.md.
3 pendências combinadas pra essa sessão: (1) criar src/whatsapp-link.ts —
função pura que monta link wa.me pré-preenchido, sem API paga, estilo dos
módulos src/*.ts existentes, com teste; (2) documentar o padrão de
interação "hover revela detalhe" (demonstrado em
_visual/listing-catalog.html direção B) como padrão reaproveitável do
toolkit; (3) sessão EXPLICATIVA (não é código) sobre outros critérios de
ajuste visual além dos sliders de densidade/escala tipográfica que já
existem — espaçamento, elevação, raio, contraste, densidade de
informação, grid/breakpoints, motion etc. — usando os catálogos já
construídos como exemplo concreto de cada critério, pra o usuário
conseguir pedir mudança de tela sem saber o termo técnico exato. Seguir
formato de resposta do CLAUDE.md global (TL;DR + Preciso de você, sem
seção de risco de rotina) e explicar o "porquê" de qualquer princípio
nomeado aplicado.
```
