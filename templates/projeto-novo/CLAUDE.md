# NOME-DO-PROJETO

<!-- 1-2 linhas: o que é, pra quem, stack. -->

## Cultura de trabalho

Vem do repositório global de configurações do Claude (`CLAUDE.md` global):
documentação e HANDOFF, memória local, eficiência de tokens, push após commit.
Não repita essas regras aqui; só registre o que for específico deste projeto.

## Memória local

Leia `.claude/memory/MEMORY.md` no início da sessão como índice.

## Trabalho inline primeiro

Resolva direto, na conversa principal, tudo o que for rápido de fazer.
Subagente só quando compensa de verdade: revisão de impacto, busca ampla em
muitos arquivos, ou tarefa independente que roda em paralelo. Peça resposta
de tamanho limitado.

## Revisão de impacto obrigatória (antever quebras)

Antes de implementar qualquer mudança que toque schema/dados persistidos, serviços/módulos compartilhados, fluxo crítico de negócio, auth/permissões, ou deploy, rode primeiro o agente `revisor-impacto` (em `.claude/agents/`) e apresente o resultado para aprovação ANTES de mexer.

Mudança trivial e isolada não precisa: diga que é trivial e siga.

## Regras específicas do projeto

<!-- Aprovações exigidas (produção, custo, jurídico), portões de acesso, pegadinhas. -->
