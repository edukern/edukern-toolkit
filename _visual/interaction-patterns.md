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

## Máscara de valor em R$ enquanto digita

Em vez de deixar a pessoa digitar "1.234,56" (e ter que validar separador
decimal, vírgula vs. ponto, múltiplos pontos), trata cada dígito digitado
como um centavo entrando pela direita — o valor só cresce da direita pra
esquerda, nunca fica num estado "meio digitado" inválido.

```js
function maskCurrencyInput(input) {
  input.addEventListener("input", () => {
    const digits = input.value.replace(/\D/g, "");
    const cents = Number(digits || "0");
    input.value = (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  });
}
```

O valor real pra salvar é `cents / 100`, não o texto formatado — extrair de
volta com `Number(input.value.replace(/\D/g, "")) / 100` no submit.

## Comprovante como imagem (compartilhar recibo por WhatsApp)

Transforma um bloco de HTML (recibo, comprovante) em PNG pra compartilhar
como imagem em vez de texto — sem lib de terceiro (`html2canvas` etc.),
usando só APIs nativas do browser: desenha o HTML dentro de um SVG
(`<foreignObject>`), carrega esse SVG como imagem, e desenha a imagem num
`<canvas>` pra exportar.

```js
async function elementToPngBlob(element) {
  const { width, height } = element.getBoundingClientRect();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">${element.outerHTML}</div>
    </foreignObject>
  </svg>`;

  const img = new Image();
  img.src = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
```

Teto conhecido: só funciona bem se o estilo do elemento estiver inline ou
num `<style>` dentro do próprio HTML capturado — CSS de uma folha de estilo
externa nem sempre é aplicado dentro do `<foreignObject>`. Se o recibo
depender de classes Tailwind/CSS externo complexo, o upgrade path é
`html2canvas` (lib de verdade, resolve isso, mas é dependência nova).
