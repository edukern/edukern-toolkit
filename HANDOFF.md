# Handoff — 2026-09-21 (atualizado)

> `v0.4.0` no ar. Toolkit redefinido nesta sessão como **starter kit**: infra/
> segurança fica dependência real versionada; UI/visual vira referência pra
> copiar uma vez ao nascer um projeto, sem sync depois. Survey de evidência
> real em 10 projetos (mundialito, proficiencia-ucs, ponto-e-stock,
> financeiro-ponto-e, rh-pontoe, game-box, sancho, skillset, STG, acamp-plan)
> — ver `.claude/memory/starter_kit_candidates.md` pro detalhe completo. Este
> handoff só lista o que falta fazer, em ordem de prioridade.

## ⏳ Pendente — próxima sessão

1. **Módulo de link de WhatsApp pré-preenchido — prioridade subiu.** Achado
   novo: `acamp-plan/public/camp/whatsapp-utils.js` já resolve isso, com um
   bug real já corrigido (comentário no arquivo cita `revisor-impacto P2-2`):
   prefixar `55` por CONTAGEM DE DÍGITO, não por conteúdo — a lógica ingênua
   ("já começa com 55? não prefixa") quebra pra qualquer telefone de DDD 55
   (Santa Maria/RS) com 10-11 dígitos. **Promover esse arquivo como fonte**
   (não escrever do zero) e conferir se o `rh-pontoe` tem o mesmo bug.
   Consumidores reais: rh-pontoe, acamp-plan — passa a regra dos 3 (2 projetos
   reais + risco de bug silencioso se cada um reimplementar por conta própria,
   igual já aconteceu com os cookies).
2. **Módulo de validação de CPF — candidato novo, forte.** `acamp-plan/lib/
   candidato-validation.js` tem `isValidCpf` com o algoritmo de dígito
   verificador completo + guarda contra `111.111.111-11` (passa a conta,
   nunca é CPF real). `rh-pontoe` tem regex de CPF espalhada em 10+ arquivos
   sem esse dígito verificador — usar o do acamp-plan como referência pra
   promover e fechar o gap no rh-pontoe.
3. **`session-cookie.ts` precisa aceitar cookie store injetável — deixou de
   ser só buraco de teste, virou bloqueio de adoção real.** `acamp-plan` é
   Express puro (não Next.js) e já tem seu próprio `lib/auth.js`
   (`serializeSessionCookie`/`parseCookies`/`getClientIp`) porque o módulo do
   toolkit hoje depende de `next/headers` e não funciona fora do Next. Vale
   avaliar junto: `getClientIp` (extrai IP só confiando em
   `x-vercel-forwarded-for` quando `process.env.VERCEL` está setado — spoofável
   fora disso) e `constantTimePasswordMatch` (hash SHA-256 dos dois lados antes
   de `timingSafeEqual`, evita vazar tamanho/prefixo por timing) são
   candidatos novos que não existem no toolkit hoje.
4. **Módulo de hash de senha (bcrypt).** `rh-pontoe/lib/senha.js` já
   centraliza (`hashSenha`/`verificarSenha`) — promover como está.
   `financeiro-ponto-e` é o consumidor-alvo (bcrypt solto em 5 arquivos, sem
   centralizar). **Não migrar pra Supabase Auth** — financeiro-ponto-e roda
   HTTP puro numa LAN sem proxy (`session.ts`), depender de auth em nuvem
   briga com esse desenho; já avaliado e descartado.
5. **Kit de UI (Button/Card/Input/Select/Table/Badge/Textarea).** 3
   implementações independentes confirmadas: mundialito (mais maduro,
   testado), sancho (`src/components/ui.tsx`), e o Button/Card original já
   minerado. skillset não tem kit nenhum (badges ad-hoc por domínio).
   **Antes de fechar mundialito como fonte única**: conferir se o mecanismo de
   estilo do sancho (CSSProperties/variáveis CSS, não classes Tailwind) é
   compatível — se não for, portar não é copy-paste direto.
6. **Formatação de moeda (`Intl.NumberFormat`/`toLocaleString` pt-BR).**
   Duplicada sem função central em ponto-e-stock, financeiro-ponto-e,
   rh-pontoe (contagem exata não fechada — ver nota em
   `starter_kit_candidates.md`). Data já resolvida em
   `proficiencia-ucs/src/lib/format.ts` — promover como está, não é gap.
7. **Baseline de CI/ESLint pra copiar em projeto novo.** Ausente em
   financeiro-ponto-e, rh-pontoe, acamp-plan (3 dos 10). `game-box/.github/
   workflows/ci.yml` é o molde mais limpo (checkout → setup-node → npm ci →
   lint → typegen → tsc → test → build).
8. **Generalizar o padrão de interação "hover revela detalhe."** Demonstrado
   em `_visual/listing-catalog.html` (direção B — tooltip via CSS
   `content:attr(data-tip)`, sem JS de posicionamento). Documentar como
   técnica reaproveitável no catálogo, não como componente.
9. **Sessão explicativa: critérios de ajuste visual além de densidade/escala
   tipográfica** (espaçamento, elevação, raio, contraste, densidade de
   informação, grid/breakpoints, motion). Não é código — usar os catálogos
   já construídos como exemplo de cada critério.
10. **Migração do `mundialito`.** Revisão de impacto já aprovou com
    ressalvas. Não fazer durante a janela do torneio. Ao retomar, prototipar
    `createAccessGate()` DENTRO do `lib/auth/*` do mundialito primeiro
    (revisor-impacto vetou extrair de um esboço isolado).
11. **Buraco de teste:** `setSignedCookie`/`clearSignedCookie`/
    `readSignedCookie` (`session-cookie.ts`) sem teste — ligado ao item 3
    (resolve junto se o cookie store virar injetável).
12. **Bug pequeno em `_visual/design-system-explorer.html`:** badge de
    contraste WCAG trava mostrando valor errado depois de trocar
    paleta+arquétipo+fonte em sequência. Não debugado a fundo.

## 🧠 Decisões que afetam o próximo passo

- **Modelo do toolkit: starter kit, não dependência sincronizada.** Infra/
  segurança = dependência real versionada (bug corrigido precisa propagar).
  UI/visual = copiar uma vez, sem sync — cada projeto tem identidade própria
  de propósito. Motivo concreto: tentar mesclar a renomeação de token
  (`primary`→`accent`) direto no `main` do ponto-e-stock bateu em conflito
  real contra 320 commits de trabalho ativo não relacionado — provou o custo
  de tentar sincronizar UI numa base que já vive a própria vida.
- Branch `chore/token-accent-rename` (ponto-e-stock) e
  `chore/danger-token-alias` (proficiencia-ucs, já mesclada) — a do
  ponto-e-stock ficou aberta sem merge, de propósito, dado o reframe acima.
  Não precisa resolver — pode ficar ou ser fechada sem uso.
- Regra dos 3 segue valendo como filtro: só promover pro toolkit quando 2-3
  projetos reais convergem na MESMA necessidade (não basta existir a palavra
  "moeda"/"card" em mais de um lugar — precisa ser o mesmo problema).
- Todo catálogo (`_visual/*-catalog.html`) é molde de referência pra
  copiar/adaptar, não componente empacotado. Cor e tipografia ficam sempre
  fora de propósito (variam por projeto).
- `design-tokens.css`: o contrato é o NOME da variável, não o valor — copiar
  e ajustar valores nunca incluiu renomear (achado real: ponto-e-stock tinha
  `--color-primary` em vez de `--color-accent` em 23 arquivos, corrigido).
- Tailwind v4 não escaneia `node_modules` por padrão — componente React do
  toolkit precisa de `@source` no CSS do consumidor.
- `supabase-client` importa `server-only` incondicionalmente; consumidor que
  compartilha entre Next e script standalone usa `supabase-client-node`.
- Todo `exports` do `package.json` precisa da condição `default` além de
  `import`/`types`. Pacote é ESM-only.
- **Painel de navegador do Claude Code não é suficiente pra julgamento visual
  fino** — testar no navegador real antes de fechar decisão de design.

## 📁 Arquivos relevantes

- `.claude/memory/starter_kit_candidates.md` — survey completo dos 10
  projetos, com evidência e prioridade. Ler antes de continuar qualquer item
  1-7 acima.
- `.claude/memory/project_frontend_scope.md` — histórico das decisões de
  catálogo de tela e da reexaminação de Button/Card.
- `D:\projetos\acamp-plan\public\camp\whatsapp-utils.js` — fonte do item 1.
- `D:\projetos\acamp-plan\lib\candidato-validation.js` — fonte do item 2.
- `D:\projetos\acamp-plan\lib\auth.js` — fonte de `getClientIp`/
  `constantTimePasswordMatch` do item 3.
- `D:\projetos\rh-pontoe\lib\senha.js` — fonte do item 4.
- `D:\projetos\mundialito\components\ui\` — fonte principal do item 5;
  `D:\projetos\sancho\src\components\ui.tsx` — conferir compatibilidade de
  estilo antes de fechar.
- `D:\projetos\game-box\.github\workflows\ci.yml` — molde do item 7.
