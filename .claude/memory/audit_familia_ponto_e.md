---
name: audit-familia-ponto-e
description: Achados do audit cross-repo (2026-09-19) nos repos ponto-e-* ainda não olhados — 2 candidatos de migração prontos e 2 bugs de segurança reais em produção
metadata:
  type: project
---

Audit rodado em 2026-09-19 (2 agentes em paralelo) nos 7 repos da família "Ponto E"
que ainda não tinham sido olhados pelo audit original que criou o toolkit
(`ponto-e-hr-solution` e `ponto-e-stock` já eram fonte de módulos existentes).

## Migrações prontas (código já existe no toolkit, só falta trocar)

- **`financeiro-ponto-e`** (`D:\projetos\financeiro-ponto-e`) — `src/lib/session.ts`
  reimplementa `signed-session` + `timing-safe-compare` quase idêntico; o próprio
  comentário no código diz "copiado do ponto-e-stock".
- **`rh-pontoe`** (`D:\projetos\rh-pontoe`) — `lib/supabase.js` reimplementa o padrão
  do `supabase-client-node` (proxy lazy) e assina JWT de tenant quase idêntico ao
  `sign-tenant-token`/`supabase-tenant-client` (extraídos originalmente do
  `ponto-e-hr-solution`).

## Bugs de segurança reais achados nos 2 repos acima (não só arquitetura)

- **Cookie sem flag `secure` correta atrás de proxy** — em ambos, cada um resolveu
  errado do seu jeito (`financeiro-ponto-e/src/app/api/auth/login/route.ts:99` exige
  flag manual; `rh-pontoe/app/api/portal/auth/route.js:73` só olha `NODE_ENV`, não
  detecta HTTPS real). É o mesmo bug que `secure-cookie-option` já resolve (achado
  antes em `ponto-e-stock`/`keenfisher-repo`). Efeito: se o proxy na frente desses 2
  sistemas não fecha TLS do jeito esperado, o cookie de sessão pode trafegar sem
  criptografia.
- **`rh-pontoe/lib/auth.js`** guarda o token de sessão CRU na tabela `admin_sessions`
  (não o hash) — se o banco vazar, a sessão é usável direto, sem precisar quebrar
  nada. Não é 1:1 com `revocable-token` (abordagem diferente: tabela, não HMAC
  stateless), mas resolve o mesmo problema e devia guardar hash.

## Candidato anotado, ainda não maduro pra virar módulo

Rate limiting de login, reimplementado 2x de formas bem diferentes:
`financeiro-ponto-e` usa `Map` em memória (10 falhas/15min);
`rh-pontoe/lib/rateLimit.js` usa RPC no Postgres por IP+ação (fail-open). Mesmo
problema, soluções divergentes — falta um 3º caso pra confirmar um padrão maduro
o bastante pra extrair.

## Sem nada aproveitável
`bolao-ponto-e` (WordPress/PHP, stack diferente), `mkt-pontoe` (usa Supabase Auth
de verdade, não tem o que aproveitar dos módulos de sessão custom),
`ponto-e-tarefas` (Supabase só com anon key, sem camada de auth própria),
`lp-promocoes-ponto-e` e `tv-conteudo-ponto-e` (sites estáticos, sem package.json).

**Decisão pendente:** ordem de migração. `[[migracao-consumidores]]` já tinha o
mundialito como primeiro candidato (ainda não começada); agora `financeiro-ponto-e`
e `rh-pontoe` também são candidatos prontos e, diferente do mundialito, corrigem um
bug de segurança real já rodando em produção. Perguntei ao usuário em 2026-09-19
qual ordem seguir — resposta ainda não registrada nesta memória.

**Why:** motivado pela pergunta do usuário "tem algo que valeria a pena incluir?"
sobre o que ficou de fora do toolkit original.

**How to apply:** antes de implementar qualquer uma dessas migrações, rodar
`revisor-impacto` primeiro (regra do CLAUDE.md deste projeto — toca auth/dados
persistidos) e apresentar pra aprovação antes de mexer.

## Risco de dependência externa em repo de empregador (2026-09-19)

Confirmado via `gh repo view`: `github.com/edukern/edukern-toolkit` está **PUBLIC**
hoje, sob a conta pessoal do usuário. Instalação via git dependency
(`npm install github:edukern/edukern-toolkit#vX.Y.Z`) não é uma cópia estática —
é um `git clone` que roda de novo em TODO install limpo (deploy novo, CI sem cache,
`npm ci`, máquina nova). Se o repo virar privado sem token configurado no pipeline
de build de quem consome, o install quebra. Mesmo continuando público, o risco de
fundo persiste enquanto o repo mora numa conta pessoal: se a conta for suspensa,
deletada ou o repo for removido/renomeado, builds de quem depende dele quebram —
independente de público/privado.

O usuário levantou isso porque `financeiro-ponto-e` e `rh-pontoe` são sistemas da
Ponto E (empregador/cliente, não projeto pessoal dele) e ele não quer deixar uma
dependência de produção presa à própria conta pessoal caso saia de lá depois.

**Recomendação dada:** para esses 2 repos especificamente, migrar via **vendoring**
(copiar os arquivos/dist compilado direto pro repo consumidor) em vez de
git-dependency ao vivo — zero acoplamento externo depois da migração. Custo: fix
futuro nesses módulos precisa ser copiado manualmente, não vem de `npm update`.
Projetos pessoais do usuário (mundialito, proficiencia-ucs, game-box) continuam
usando git-dependency normal, sem esse problema.
