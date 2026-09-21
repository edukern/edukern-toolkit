# Começando um projeto novo

Este documento só **aponta**. Cada coisa tem um dono; copiar regra pra cá
criaria duas versões que divergem com o tempo.

## Quem é dono de quê

| Assunto | Dono | Onde |
|---|---|---|
| Como o Claude trabalha (documentação, HANDOFF, memória, eficiência de tokens, inline por padrão e subagente só quando compensa, push após commit) | Repositório de configurações do Claude | `edukern/claude-global-config` (privado), `CLAUDE.md` |
| Revisão de impacto (agente `revisor-impacto` + regra no `CLAUDE.md` do projeto) | Mesmo repositório | instalada sozinha em repo git pelo hook `install-revisor-impacto.sh` |
| Código reaproveitável (auth, sessão, CPF, WhatsApp, BRL, novidades) | Este toolkit | `README.md` |
| Molde de projeto (tokens, ESLint, CI, UI, `CLAUDE.md` de projeto) | Este toolkit | `src/design-tokens.css`, `templates/`, `src/ui/` |
| Telas de ajuda e novidades | Skills globais `central-ajuda` e `novidades` | `~/.claude/skills/` |

## Checklist

1. **Máquina configurada?** Sem o repositório de configurações instalado
   (`/setup-claude-config`), nada da cultura vale. Instale antes.
2. `git init` + repo privado (`gh repo create --private`), primeiro commit.
3. Copie `templates/projeto-novo/CLAUDE.md` pra raiz e preencha o topo.
4. Crie `.claude/memory/MEMORY.md` vazio (índice de memória do projeto).
5. Tokens: copie `src/design-tokens.css` pro `globals.css` e preencha marca/fonte.
6. Copie `templates/eslint.config.mjs` e `templates/ci.yml` (`.github/workflows/`).
7. Antes de escrever infra (auth, sessão, hash, cookie), confira o `README.md`
   deste toolkit: pode já estar resolvido.
8. Se o app tem usuário final: skills `central-ajuda` e `novidades`.

## Alimentar o toolkit

Só promova código que 2-3 projetos reais precisam da MESMA forma (regra dos 3).
Ao promover: revisão de impacto se toca auth/dados, teste, entrada no
`README.md` e no `CHANGELOG.md` com o achado real que originou. Infra e
segurança viram dependência versionada; UI e visual viram molde pra copiar.
