# Handoff — 2026-09-19

> `v0.1.1` no ar, repo público: `github.com/edukern/edukern-toolkit`. Extração
> **pausada** — nenhum consumidor migrado ainda, nem o `mundialito` (origem do
> padrão). Retomar só quando um projeto (novo ou existente) precisar de
> verdade de uma das peças abaixo — não forçar retrofit por forçar.

## ⏳ Pendente

1. **Nenhum consumidor real ainda.** `v0.1.1` nunca foi instalado por nenhum
   projeto — o `npm install github:edukern/edukern-toolkit#v0.1.1` nunca foi
   testado na prática. Primeira vez que alguém instalar, validar que o
   `dist/` prebuilt resolve certo antes de confiar no pacote.
2. **Migração do `mundialito`** (origem do padrão `signed-session`/
   `session-cookie`/`supabase-client`) — revisão de impacto já rodou e
   aprovou com ressalvas (ver `D:\projetos\mundialito\.claude\memory\project_personal_library_audit.md`).
   Não fazer durante a janela do torneio (login de agências ativo em
   produção). Quando migrar: os 3 arquivos do mundialito viram fachada fina
   (re-exportam o pacote), nenhum dos ~30 arquivos que os importam muda.
3. **Cluster #1 (Supabase + portão de acesso) investigado a fundo — não achou
   candidato.** 8 dos 9 repos do cluster original foram checados de verdade
   (não só por dependência no `package.json`); só o `mundialito` usa o padrão
   completo. `proficiencia-ucs` nunca foi clonado localmente, é o único que
   falta. Ver a mesma memória acima pra tabela completa.
4. **Clusters #3 e #4 (tokens de design, `dnd-kit`/`@react-pdf/renderer`)
   nunca passaram pela mesma checagem de uso real** — só existem como
   contagem de dependência no `package.json` do scan original. Dado que essa
   contagem se mostrou pouco confiável no cluster #1, não confiar neles sem
   reconferir antes de extrair.

## 🧠 Decisões que afetam o próximo passo

- Modelo é pacote via git dependency (`github:...#vX.Y.Z`), não monorepo —
  motivo em `D:\projetos\edukern-toolkit\CLAUDE.md`.
- `supabase-client` importa `server-only` **incondicionalmente** — quebra se
  usado por um script fora do bundler do Next (achado real: `game-box` tem
  esse caso, por isso nunca vai consumir esse módulo específico do jeito que
  está). Não abrir uma segunda variante sem guard até aparecer um segundo
  caso real — hoje seria especulação.

## 📁 Arquivos relevantes

- `src/` — as 4 peças atuais.
- `README.md` — API + limite do `server-only`.
- `D:\projetos\mundialito\.claude\memory\project_personal_library_audit.md` —
  histórico completo do audit que originou este repo (33 repos avaliados,
  clusters, decisões, revisão de impacto do mundialito).

---
▶ PROMPT DE RETOMADA

```
Leia HANDOFF.md em D:\projetos\edukern-toolkit. Pacote v0.1.1 público, sem
consumidor ainda — extração pausada de propósito. Só mexer aqui de novo
quando (a) um projeto novo precisar de uma das 4 peças, ou (b) decidir migrar
o mundialito fora da janela do torneio (revisão de impacto já aprovou com
ressalvas). Antes de extrair mais clusters, reconferir uso real — o scan
original por package.json já errou uma vez no cluster #1.
```
