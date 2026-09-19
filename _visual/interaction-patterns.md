# Padrões de interação

Padrões pequenos e reaproveitáveis de comportamento de tela — não são telas
inteiras (isso fica em `*-catalog.html`), são um detalhe de interação que se
repete entre elas.

## Hover revela detalhe

Passar o mouse numa barra/ponto de um mini-gráfico mostra o detalhe daquele
ponto (dia, valor exato) sem cravar isso na tela o tempo todo. Evita poluir a
tela com todo detalhe já visível, mas mantém a profundidade de análise
disponível sob demanda.

Demonstrado em `listing-catalog.html` (direção B, mini-gráfico "venda por
dia" do card): cada barra carrega o texto do tooltip no próprio atributo
`data-tip`, e o `::after` do estado `:hover` lê esse atributo via
`content:attr(...)`. Sem JS de posicionamento, sem lib de tooltip.

```css
.bar { position: relative; }
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
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  z-index: 5;
  pointer-events: none;
}
```

```html
<div class="bar" style="height:70%" data-tip="12/09 · R$ 2.660,00"></div>
```

Só funciona com mouse (sem `:hover` em touch) — pra mobile, o detalhe
precisaria de tap + estado ativo em vez de `:hover`. Não implementado ainda
porque nenhum catálogo até agora tinha alvo touch.

## Compartilhar nativo (Web Share API) com fallback

Em vez de uma fileira de ícones de rede social fixa, o botão "compartilhar"
abre a folha de compartilhamento nativa do sistema (WhatsApp, Instagram,
e-mail, o que o usuário tiver instalado) — a lista de apps não precisa ser
mantida por você, o sistema operacional já sabe. Onde não existe suporte
(principalmente desktop fora do Chrome/Edge/Safari), cai pra copiar o link e
mostrar um feedback tipo "Link copiado".

```js
async function shareOrCopy({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (err) {
      if (err.name === "AbortError") return; // usuário cancelou a folha — não caia pro fallback
    }
  }
  await navigator.clipboard.writeText(url);
  // mostrar feedback "Link copiado" aqui
}
```

O `catch` do `AbortError` é o detalhe que quebra fácil: sem ele, cancelar a
folha de compartilhamento (comportamento normal, não erro) faz o código cair
no fallback e copiar o link sem o usuário pedir.
