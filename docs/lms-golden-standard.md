# Padrão de arquitetura — cursos e módulos (LMS)

Padrão reaproveitável de arquitetura de cursos/módulos pra produtos de aulas/treinamento —
baseado em desenho já validado em produção, não desenhado do zero. Consultar quando um
produto concreto precisar decidir sua própria modelagem de dados — nenhum item aqui é
prescrição fechada, é um catálogo de opções.

## 1. Modelo de dados — padrão recorrente no setor

```
Curso (catálogo)
 └─ Módulo/Lição (conteúdo)
     ├─ Quiz → Pergunta → Resposta
     └─ Progresso (por matrícula)

Matrícula (aluno × curso — centraliza TODO estado do aluno nesse curso:
  status, sequência de dias ativos, turma, preferências)
 ├─ Progresso por módulo
 ├─ Tentativas de quiz
 └─ Certificado (1:1)

Turma → referência de data pra liberação programada de conteúdo
```

Princípio central, o mais recorrente entre implementações maduras: **todo estado específico
do aluno num curso mora na Matrícula**, não espalhado em tabelas soltas — um fato, um dono,
o resto só referencia de volta. Mesma lógica de "fonte única da verdade" que vale pra
qualquer domínio, não só educação.

## 2. Convenção de camadas (padrão genérico, não exclusivo de nenhum stack)

```
Schema de dados + migração
  → camada de regra de negócio (classe de erro própria do domínio)
    → validação de entrada
      → rotas de API — admin e aluno SEMPRE em namespaces separados
        → contrato/DTO de client
```

Separar admin de aluno desde a rota facilita revisão de impacto por camada: o que pode
quebrar dado existente (schema) fica isolado do que é só UI (client).

## 3. Regras de negócio que valem virar padrão

- **Liberação programada (drip)**: liberar conteúdo N dias após uma data de referência —
  a referência prioriza data de turma sobre data de matrícula individual, resolvida por uma
  função única reaproveitada em todo ponto que checa liberação, nunca duplicada por tela.
- **Exigência em dois níveis**: um módulo pode exigir quiz aprovado pra contar como
  concluído; o curso inteiro pode exigir uma taxa mínima de aprovação pra emitir
  certificado. São dois requisitos independentes, não um só — vale desenhar assim desde o
  início.
- **Efeito colateral não-crítico nunca derruba o fluxo principal**: gamificação (badge, XP,
  pontuação) deve falhar silenciosamente sem impedir o registro do progresso real do aluno.
- **Emissão de certificado dentro de uma transação atômica**, idempotente — evita duas
  emissões em corrida quando dois eventos de conclusão chegam quase juntos.
- **Certificado com link público sem exigir login** — pensado pra compartilhar (ex.:
  LinkedIn), separado do resto que exige sessão.
- **Duplicar conteúdo pra editar sempre cria uma cópia em rascunho**, nunca edita o
  conteúdo publicado direto — edição segura sem arriscar o que está ao vivo.
- **Classificar pergunta por nível cognitivo** (lembrar/entender/aplicar/analisar/avaliar/
  criar, ou taxonomia equivalente) em vez de só certo/errado — acrescenta rigor pedagógico
  real ao invés de só pontuar.

## 4. Catálogo de tipos de conteúdo (menu de referência, não checklist obrigatório)

Ideia central, recorrente em produtos de microlearning maduros: uma lição não é um bloco de
conteúdo único — é uma **sequência de blocos pequenos e tipados**, cada um de um formato
conhecido. Isso favorece navegação rápida, sensação de progresso constante, e reuso de
blocos entre lições. Categorias amplas (nem todo produto precisa de todas):

| Categoria | Serve pra | Exemplos de tipo |
|---|---|---|
| Ensinar | Apresentar conteúdo | texto curto/título, lista, texto corrido, imagem/galeria, arquivo anexo, vídeo embutido |
| Testar | Checar entendimento | múltipla escolha, verdadeiro/falso, associar pares, preencher lacuna/montar frase, resposta numérica |
| Envolver | Manter ritmo/engajamento | discussão aberta, avaliação/feedback da lição, jogo simples |
| Avançado | Casos extras | embed externo, importar bloco de outra lição, interoperar com outro sistema de conteúdo |

### 4.1 Envelope comum a blocos de teste

Um padrão útil pro schema: todo bloco de "testar" tende a ter o mesmo envelope, variando só
o miolo por tipo —

```
Pergunta/enunciado
  → controle específico do tipo (as opções, o campo, etc.)
  → resposta: explicação, valor correto, mensagem de acerto/erro
  → peso (usado no score agregado, se o produto tiver pontuação)
```

Ou seja: um schema de bloco de conteúdo se beneficia de um **envelope comum** (pergunta,
resposta/explicação, peso) + um campo de dados específico por tipo (discriminated union) —
não precisa reinventar a estrutura pra cada tipo novo.

### 4.2 Nota de schema: texto simples costuma bastar

Campo de texto em bloco de conteúdo não precisa necessariamente de um documento estruturado
complexo (tipo editor rich-text em JSON) — string em Markdown/HTML simples, renderizada no
player, já cobre a maior parte dos casos de formatação sem a complexidade de manter um
schema de documento proprietário.

## 5. Opções de schema pra guardar a sequência de blocos (três caminhos, nenhum fechado)

**Opção A — Blocos como linhas relacionais**
Tabela própria (`type`, `order`, `data` json), ligada ao módulo/lição.
- Prós: reordenar/editar um bloco isolado é escrita pequena; dá pra medir engajamento por
  bloco individual; reaproveitar um bloco em outra lição fica mais fácil.
- Contras: o formato de dentro de cada `data` ainda só é garantido pela validação de
  aplicação, não pelo banco — o ganho é mais organizacional que de garantia de dado.

**Opção B — Sequência de blocos num array JSON**
Um campo `content` json guarda a lista de blocos direto, sem tabela nova.
- Prós: zero migração; mais rápido de prototipar; motor de quiz existente (se já houver um
  maduro) continua intocado.
- Contras: não dá pra consultar nem reordenar um bloco sem reescrever o array inteiro;
  reaproveitar um bloco em outra lição exige copiar o JSON, não referenciar.

**Opção C — Híbrido: só o "Ensinar" vira sequência, o motor de quiz existente fica como está**
Se já existe um motor de quiz maduro e testado, vale deixá-lo intocado e só fatiar a parte
de ensino em blocos — menor diff possível no que já roda em produção, separa claramente
"conteúdo" (muda sempre) de "avaliação" (regra de negócio sensível).
- Contras: duas fontes de conteúdo por lição em vez de uma só — aceitável, mas vale
  documentar a divisão pra não confundir quem for editar depois.

Escolha depende do produto concreto quando for construir — essa tabela é ponto de partida,
não decisão pronta.

## 6. Conceitos de produto adicionais que valem considerar

Padrões observados em produtos maduros do setor, fora do "core" de curso/módulo/quiz:

- **Recorrência de treinamento em nível de curso** (não por item de conteúdo individual):
  reatribuir o curso inteiro periodicamente — prazo + frequência configuráveis — é um
  mecanismo de retenção mais simples de implementar que repetição granular por
  pergunta/flashcard, e cobre boa parte do caso de uso de recertificação.
- **Credencial como objeto próprio, separado de certificado de conclusão**: certificado é
  "prova de que completou"; credencial é "documento com validade que precisa ser mantido em
  dia" (ex.: uma licença) — vale modelar como entidades diferentes desde o início se o
  produto precisar de expiração de verdade.
- **Atribuição direcionada** (por grupo/papel/local) com reemissão automática de treinamento
  obrigatório recorrente.
- **Registro único pra treinamento digital e presencial** — sessão em grupo e avaliação
  prática ficam no mesmo histórico do curso online, em vez de sistemas separados.
- **Visão agregada de lacuna por equipe** (quem está atrasado, em quê) como relatório
  central de gestão, não só progresso individual.
- **Critério de conclusão pode ser só "viu todo o conteúdo"**, com pontuação de quiz
  rodando em paralelo (pra gamificação/relatório) sem necessariamente bloquear a conclusão
  — alternativa mais permissiva ao "exigência em dois níveis" da seção 3, útil dependendo
  do quanto o produto precisa ser rigoroso vs. friccionar pouco o aluno.

## 7. Notas de priorização

- Autoria de conteúdo por IA: sem interesse no momento, fora da lista de candidatos.
- Qualquer feature que dependa de API paga de IA (narração automática, tradução
  automática): vale documentar como possibilidade, mas segurar a construção por enquanto.
- Todo o resto do catálogo acima é de interesse real — sem fechar numa abordagem só; decidir
  caso a caso quando um produto concreto precisar.
