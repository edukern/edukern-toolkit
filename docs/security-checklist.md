# Checklist de segurança de lançamento (20 pontos)

Dono: este toolkit (segurança e infra são dele, ver `novo-projeto.md`). A regra de **quando**
consultar esta lista vive no `CLAUDE.md` global; aqui ficam o conteúdo e o mapa do que o toolkit
já cobre.

Origem: lista de 20 pontos de um vídeo do Instagram, trazida em 2026-09-21 e reorganizada com peso
por tipo de projeto e forma de conferir cada item. Não é norma: complementa o OWASP e as skills
`security-review` e `typescript-security-review`.

## Como usar (com critério)

1. **Quando ler:** pedido de auditoria, revisão de segurança ou "pode ir pro ar?"; ou a feature
   toca login, banco, upload, endpoint público, pagamento ou dependência nova (inclui promover ou
   alterar peça de auth, sessão, cookie ou hash aqui no toolkit). Tarefa de texto, estilo ou dado
   estático não precisa.
2. **Classificar o projeto antes:**
   - **A** — site estático, sem login nem banco: itens 1, 2, 18, 19, 20.
   - **B** — app com login e dado pessoal: todos, exceto 5 e 12 quando a condição da tabela vale.
   - **C** — dado sensível (saúde, financeiro, documento) ou pagamento: todos, com 5 e 12 a sério.
3. **Em construção:** usar como guia silencioso e trazer só o que virou lacuna real, com o custo
   pra fechar.
4. **Em auditoria pedida:** devolver tabela `Item | Situação (coberto / lacuna / dispensável /
   não verificado) | Evidência (arquivo:linha, teste ou comando) | Custo pra fechar`. Sem
   evidência, o item é "não verificado", nunca "coberto".
5. Dizer em uma linha o que foi descartado e por quê.
6. Ao acionar o agente `revisor-impacto` em mudança de auth, dados ou deploy, incluir no prompt
   dele a leitura deste arquivo.

## Os 20 pontos

Peso: **Crítico** = vazamento ou invasão direta; **Alto** = falha comum e cara; **Médio** =
defesa em camada.

| # | Ponto (peso) | O que garantir | Como conferir | Peça no toolkit |
|---|---|---|---|---|
| 1 | Esconder chaves de API (Crítico) | Nenhuma chave no código nem no que vai ao navegador; só variável de ambiente do servidor, nunca com prefixo `NEXT_PUBLIC_`. | Grep por `SERVICE_ROLE`, `SECRET` e prefixos de chave em `.next/static` e no código-fonte: sem resultado. | `supabase-client` (server-only) |
| 2 | Limpar segredos do git (Alto) | `.env*` no `.gitignore` e nenhum segredo no histórico. Segredo já commitado conta como vazado: rotacionar a chave (apagar o arquivo não basta). | `git log -p -S"<trecho da chave>"` ou scanner (gitleaks); `git ls-files` sem `.env`. | nenhuma |
| 3 | Chave pública do banco (Crítico) | O navegador só pode ter a chave pública (anon), com RLS por trás; a service-role fica no servidor. O mais seguro é o navegador nem falar com o banco. | Onde a service-role é importada: só em código de servidor, nunca em componente cliente. | `supabase-client` |
| 4 | RLS ativo (Crítico) | Row Level Security ligado em toda tabela do schema público. Sem policy, a chave pública não lê nem escreve nada. | `rowsecurity` em `pg_tables` = `true` em tudo. Teste: chamada com a chave pública retorna vazio ou erro. | `supabase-tenant-client` (só multi-tenant) |
| 5 | Criptografia (Médio; Alto em C) | Em trânsito (HTTPS) e em repouso (o provedor faz). Cifrar campo específico só para dado muito sensível. Senhas e respostas de segurança só em hash. | Provedor com criptografia em repouso; nenhuma senha ou resposta em texto puro no banco. | nenhuma |
| 6 | Autenticação no servidor (Crítico) | Login e papel conferidos em toda ação e rota no servidor. Esconder o botão na tela não protege. | Cada Server Action e rota chama o guard; teste chamando sem sessão: nega. | `signed-session`, `session-cookie` (o guard é do projeto) |
| 7 | Restringir acessos (Crítico) | Cada pessoa só vê e altera o que é dela, por papel e por dono do registro. | Teste: usuário A abre ou edita registro do B trocando o id na URL ou no corpo do POST: nega. | nenhuma |
| 8 | Mass assignment (Alto) | A ação grava só campos de uma lista permitida; nunca repassa o corpo da requisição inteiro ao banco. | Ler cada ação de escrita (campos explícitos). Teste enviando campo extra (`papel=admin`): ignorado. | nenhuma |
| 9 | Cookies (Alto) | `httpOnly`, `secure`, `sameSite`, prefixo `__Host-`, validade curta; sair por POST. | Inspecionar o `Set-Cookie` da resposta do login. | `session-cookie`, `secure-cookie-option` |
| 10 | Hash de senha (Crítico) | bcrypt ou argon2, nunca texto puro nem hash rápido (md5, sha). Comparação em tempo constante e resposta igual para usuário inexistente. | Ler login e cadastro de senha; teste medindo o tempo de resposta. | `password-hash`, `timing-safe-compare` |
| 11 | Rate limit (Crítico) | Limite de tentativas em login, recuperação de senha, formulários e endpoints caros, por conta e por IP. Se o contador falha, o login falha fechado. | Teste: 6 erros seguidos resultam em bloqueio. | nenhuma (cada projeto reescreveu o seu; candidato a peça pela regra dos 3) |
| 12 | Proteção contra robô (Médio; Alto em C) | CAPTCHA (ex.: Cloudflare Turnstile) em formulário público aberto. Dispensável quando as contas só nascem por administrador e há rate limit. | Existe formulário público sem login? Se sim, tem CAPTCHA. | nenhuma |
| 13 | Queries parametrizadas (Crítico) | Nunca concatenar entrada do usuário em SQL. Clientes como o `supabase-js` já parametrizam; o risco está em SQL cru, RPC e filtros montados com string. | Grep por template string em SQL, `.or(` e `.rpc(`. | nenhuma |
| 14 | Validação de entrada (Crítico) | Validar no servidor tipo, tamanho e formato (ex.: Zod). A validação do navegador é só conforto. | Todo ponto de entrada tem schema; teste com entrada vazia, gigante e de tipo errado. | `cpf` (só CPF) |
| 15 | Não vazar conteúdo (Alto) | Erro genérico ao usuário (detalhe só no log do servidor), sem stack trace; e-mail e senha nunca em URL ou log; respostas iguais para "existe" e "não existe". | Forçar um erro e ler a resposta; grep de dado pessoal nos logs. | `timing-safe-compare` |
| 16 | Restringir uploads (Alto, se houver upload) | Conferir o conteúdo real (não só a extensão), tamanho máximo, nome gerado pelo servidor, fora de pasta pública. Se der, trocar upload por link. | Teste: `.exe` renomeado para `.png` e arquivo enorme: recusa. | nenhuma |
| 17 | Respostas enxutas (Crítico) | Devolver só os campos que a tela usa; nunca `select *`. Hash, token e campo interno não chegam ao navegador. | Inspecionar resposta de rede e props de Server Component; teste de que `password_hash` não aparece. | nenhuma |
| 18 | Cabeçalhos de segurança (Médio) | CSP, `frame-ancestors`/X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy e HSTS. | `curl -I` na URL ou securityheaders.com. | nenhuma (candidata a peça) |
| 19 | HTTPS forçado (Alto) | Todo tráfego em HTTPS, com HSTS. A Vercel já redireciona e emite certificado; em servidor próprio ou LAN, configurar no proxy. | `curl -I http://...` responde 301/308 para https. | `secure-cookie-option` (atrás de proxy) |
| 20 | Pacote falso (Alto) | A IA pode sugerir pacote inexistente ou de nome parecido com um famoso (typosquatting, slopsquatting), e alguém malicioso registra esse nome. Conferir nome exato, dono, downloads e data antes de instalar; lockfile versionado. | `npm ls` do que entrou na tarefa; `npm audit --omit=dev` (ideal no CI). | nenhuma |

## Fora desta lista (citar na auditoria quando o projeto tiver dado pessoal)

LGPD (base legal, retenção, exclusão a pedido), backup com restauração testada, log de auditoria
de ações administrativas, rotação de segredos, monitoramento e alerta, pagamento (PCI).

## Notas

- O título do item 15 estava cortado no vídeo; foi interpretado como vazamento de dados em erros,
  logs e respostas. Ajustar se a intenção do autor era outra.
- O peso é o padrão; ajustar ao projeto e dizer o ajuste na auditoria.
- **Manutenção:** a coluna "Peça no toolkit" fica junto do `README.md`. Quando o toolkit ganhar ou
  perder uma peça, atualizar esta coluna na mesma mudança que atualiza o README e o CHANGELOG.
