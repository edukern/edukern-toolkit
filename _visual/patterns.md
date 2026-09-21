# Padrões de interação

Técnicas pontuais reaproveitáveis — menores que uma tela inteira (que vira
catálogo em `*-catalog.html`), maiores que um token solto. Copie o trecho de
CSS/HTML, não importe nada.

## Hover revela detalhe

**Onde nasceu:** `listing-catalog.html`, direção B (grade de cards densos,
inspirada no `financeiro-ponto-e`) — o mini-gráfico "venda por dia" de cada
card. Passar o mouse numa barra mostra o valor daquele dia específico.

**Por quê:** evita cravar todo detalhe na tela de uma vez (poluição visual —
11 números por card, todos sempre visíveis, competindo por atenção), mas
mantém a profundidade de análise disponível sob demanda, pra quem precisa
dela. É o princípio de divulgação progressiva (progressive disclosure):
mostrar o resumo por padrão, o detalhe só quando o usuário pede.

**Como funciona** (CSS puro, sem JS de posicionamento):

```css
.bar {
  position: relative;
  cursor: default;
  transition: background .1s ease;
}
.bar:hover { background: var(--accent); }
.bar:hover::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--ink);
  color: var(--surface);
  font-size: 10.5px;
  padding: 5px 8px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 6px 16px rgba(0,0,0,.18);
  z-index: 5;
  pointer-events: none;
}
```

```html
<div class="bar" style="height:62%" data-tip="12/09 · R$ 1.216,00"></div>
```

O texto do tooltip vem do atributo `data-tip` via `content:attr(data-tip)` —
não precisa de JS pra montar/posicionar o balão (o próprio elemento serve de
âncora do `position:absolute`). `pointer-events:none` no `::after` evita que
o tooltip "roube" o hover de si mesmo ao aparecer sob o cursor.

**Onde reaplicar:** qualquer barra/ponto de gráfico, ícone de status, ou
célula densa onde caiba um número mas não uma frase — sempre que o resumo
visual (altura da barra, cor) já dá a ideia geral, e o valor exato só
importa pra quem for conferir de perto.

**Limite:** só funciona em telas com mouse (hover). Pra touch, ou usa
`:active` como fallback, ou já mostra o valor direto (telas mobile densas
tendem a ter menos itens por tela, então cravar o número costuma caber).
