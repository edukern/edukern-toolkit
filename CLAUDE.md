# edukern-toolkit

Pacote privado (`@edukern/toolkit`) com peças reaproveitadas entre projetos do
edukern, extraído a partir de um audit cross-repo (ver origem em
`D:\projetos\mundialito\.claude\memory\project_personal_library_audit.md` — a
sessão que iniciou isso não era sobre o mundialito, só rodou lá por acaso).

Modelo escolhido: pacote npm privado instalado via git dependency
(`github:edukern/edukern-toolkit#vX.Y.Z`), não monorepo — os projetos
consumidores são deploys independentes entre si.

## Memória local

Este projeto usa memória local. No início da sessão, leia
`.claude/memory/MEMORY.md` (caminho absoluto:
`D:\projetos\edukern-toolkit\.claude\memory\MEMORY.md`) como índice.

## Migração dos consumidores

Cada projeto que passar a consumir este pacote é uma migração separada, feita
um de cada vez — nunca em lote. O primeiro candidato é o `mundialito`, mas a
migração do próprio mundialito ainda não começou (o CLAUDE.md dele exige
`revisor-impacto` antes de tocar nos portões de acesso).
