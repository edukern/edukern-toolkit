# Switcher entre sistemas (entrar já logado em outro sistema, com botão de voltar)

Peça: `@edukern/toolkit/system-switch-pass` (assinar e conferir o passe). O resto é desenho, porque
cada projeto tem sessão e banco próprios. Implementações reais para copiar:

- financeiro-ponto-e → rh-pontoe (RH público na Vercel): `src/app/ir/rh/route.ts` e
  `app/api/auth/painel/route.js` + `lib/painelSso.js` + `components/Sidebar.jsx`, de 15/10/2026.
- financeiro-ponto-e → ponto-e-stock (rede interna): `src/app/ir/estoque/route.ts` e
  `src/app/api/auth/painel/route.ts`. Versão mais simples, sem uso único: só serve dentro da rede interna.

## Como funciona

1. **Origem** (quem já está logado): um link no menu leva a uma rota do servidor (`/ir/<destino>`), que
   confere a sessão, acha o id da pessoa **no destino** por um mapa explícito (variável de ambiente
   `X_SSO_USUARIOS="<id aqui>:<id lá>,..."` ou coluna própria; **nunca casar por nome ou e-mail**),
   assina o passe (`assinarPasse`, validade de 60s) e redireciona para `<destino>/api/auth/painel?t=...`.
   Sem segredo ou sem mapeamento, a rota manda para o login normal do destino, sem mostrar erro.
2. **Destino**, nesta ordem:
   1. rate limit por IP (só freio, pode falhar aberto);
   2. `verificarPasse(t, segredoDoEnv("X_SSO_SECRET"), "<destino>")` **antes de qualquer outra coisa**:
      com passe inválido, vai para o login sem gravar cookie nenhum;
   3. se a mesma pessoa já está logada, só marca o cookie de volta e entra;
   4. **queimar o jti, falhando fechado**: um insert atômico numa tabela com chave única
      (`jti`, ou `(key, action, window_start)` com `window_start = exp`); se der erro ou o jti já
      existir, vai para o login;
   5. se outra pessoa está logada neste navegador, apagar a sessão dela;
   6. abrir a sessão **pelo mesmo helper do login por senha** (sem duplicar validade e cookie) e
      conferir se a gravação deu certo;
   7. registrar uma auditoria (`login_via_<origem>`);
   8. gravar o cookie de volta (`<sistema>_painel` = só a origem, sem httpOnly, para o menu ler) e
      redirecionar com `Cache-Control: no-store` e `Referrer-Policy: no-referrer` (o passe está na URL).
3. **Botão "Voltar"** no menu do destino: lê o cookie, **valida de novo** (`/^https?:\/\/[^/@\s]+$/`,
   porque um cookie que não é httpOnly não é confiável sozinho) e mostra um `<a href>`. O logout apaga
   esse cookie, mesmo quando não há sessão.

## Regras de segurança (e por quê)

- **Um segredo por destino** (≥32 caracteres, só no env do servidor dos dois lados) e `aud` fixo.
  Se o mesmo segredo servisse a dois destinos, um passe do estoque abriria o RH.
- **Uso único** (jti queimado) quando o destino é público. Assim, um link vazado em histórico, log
  ou print não serve uma segunda vez. Na rede interna dá para dispensar, desde que isso fique registrado
  num comentário `ponytail:`.
- **Validade curta (60s) e teto de 120s** no conferidor. Isso também exige o relógio dos dois servidores
  certo, senão todo passe cai no login.
- **Nunca aceitar passe sem segredo configurado.** `segredoDoEnv` devolve null e `verificarPasse`
  recusa.
- Limpeza da tabela de jti só depois que o passe vence (com folga de minutos): apagar antes
  destrava o reuso.
- Tirar alguém do atalho = tirar do mapa. O destino confia no id assinado.

## Testes mínimos

`verificarPasse`: ida e volta, assinatura errada, payload trocado, vencido, longe no futuro, outro
`aud`, volta `javascript:`/`data:`/com usuário. Rota: reuso (jti repetido), erro ao queimar, sem segredo,
já logado com passe forjado (nenhum cookie gravado), outra pessoa logada (sessão trocada).

## Pôr no ar

Gerar o segredo (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`), pôr o
mesmo valor nos dois servidores, publicar primeiro o destino e depois a origem. Para testar, clicar,
cair logado, repetir o mesmo link e conferir que cai no login.
