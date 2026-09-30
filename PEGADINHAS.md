# Pegadinhas

Coisas que não viraram módulo do toolkit porque não são função — são armadilha de
ferramenta, infra ou decisão de arquitetura. Não tem o que instalar, só tem que
lembrar na hora certa. Consultar antes de decidir algo nessa área num projeto novo.

## Build quebra ao instalar via `prepare` + `tsc`

Um script `prepare` que roda `tsc` (comum pra "compilar sozinho no install") quebra
em qualquer ambiente que não instala `devDependencies` — caso do build de produção
da Vercel. `typescript` normalmente é devDependency, então o `tsc` do `prepare` nem
existe nesse ambiente, e o install falha.

**Evitar:** commitar o `dist/` já compilado direto na tag/release e nunca depender
de `prepare` rodando build. É por isso que este pacote versiona `dist/` no git.

## Connection pooler quebra `SET LOCAL` (e qualquer coisa "por sessão") em silêncio

Atrás de PgBouncer ou do Supabase em transaction mode, cada query pode pegar uma
conexão física diferente do pool — `SET LOCAL`, variável de sessão, ou qualquer
coisa que dependa de "a mesma conexão do início ao fim da requisição" simplesmente
não persiste. Sem erro nenhum, só silenciosamente não funciona.

Achado tentando isolar tenant por RLS no `ponto-e-hr-solution`.

**Evitar:** pra isolamento de tenant, usar claim assinado no JWT (é o que
`sign-tenant-token`/`supabase-tenant-client` fazem) em vez de setar variável de
sessão no Postgres. O princípio vale além de tenant: qualquer coisa "por conexão"
é suspeita atrás de um pooler.

## Token de sessão/refresh guardado cru no banco

Se uma tabela guarda o valor exato do token que o usuário carrega (cookie, header
etc.) pra comparar depois, um vazamento do banco dá login direto pra quem pegar a
tabela — não precisa quebrar nada, só ler.

Achado no `rh-pontoe` (`lib/auth.js`, tabela `admin_sessions`).

**Evitar:** guardar só o hash (HMAC-SHA256 chaveado, por exemplo) e comparar o hash
do token recebido — é o que `revocable-token` faz pra token opaco. O princípio vale
mesmo fora desse módulo específico: invite token, link de reset de senha, API key
persistida etc.

## Redirect cross-origin descarta o `Authorization` (401 silencioso em sync entre sistemas)

`fetch` joga fora o header `Authorization` quando segue um redirect para outra origem, e
`dominio.com` → `www.dominio.com` conta como outra origem. Chamada servidor-a-servidor que bate
no domínio "errado" recebe 308, reenvia sem o header e volta 401, sem nada que aponte o redirect.

Achado no sync do Placar (`ponto-e-hr-solution`, 16/set/2026).

**Evitar:** gravar a URL de integração já no domínio final (com ou sem `www`, o que for o canônico).
Junto, toda rota de sync/webhook precisa de chave de deduplicação (upsert por chave natural), para
reenvio não duplicar: o Placar rodou 2 vezes e seguiu com 50 linhas.

## Busca com ranking e tolerância a erro: usar o Postgres, não construir índice

Busca por relevância e "fracoes" achando "frações" parece pedir índice invertido/TF-IDF próprio
(os tutoriais de `build-your-own-x` ensinam isso). Com Supabase já vem pronto: coluna `tsvector`
com config `portuguese` (+ índice GIN, ordenação por `ts_rank`) e extensão `pg_trgm` para erro de
digitação. Só pensar em motor externo se o volume passar de centenas de milhares de linhas.
