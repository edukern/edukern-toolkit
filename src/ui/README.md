# Kit de UI — copie, não importe

Diferente do resto do `src/`, isto **não é compilado nem exportado pelo
pacote** (`src/ui` está no `exclude` do `tsconfig.json`). É código-fonte pra
copiar pro seu projeto e adaptar — mesmo modelo do `design-tokens.css`.

## Por quê copiar em vez de empacotar

A regra dos 3 (só promover pra dependência real quando 2-3 projetos
convergem na mesma necessidade) ainda não foi atingida aqui: hoje só existe
**uma** fonte real madura (`mundialito`). `sancho` tem um kit parecido, mas
estiliza via `CSSProperties`/variáveis CSS, não classes Tailwind — mecanismo
incompatível, não dá pra unificar sem reescrever um dos dois. Empacotar 1
fonte só reverteria a decisão já tomada nesta sessão ("UI/visual = copiar
uma vez, sem sync") e traria custo real de infra sem necessidade: o toolkit
hoje não tem `jsx`/DOM/`react` no build, e os testes do mundialito são
vitest+jsdom, não `node:test` (o runner atual do toolkit).

## Antes de copiar

1. Copie `../design-tokens.css` pro `globals.css` do seu projeto primeiro —
   estes componentes usam só tokens semânticos (`bg-accent`, `bg-surface`,
   `border-line`, `bg-danger`...), nunca cor solta. Sem os tokens, renderiza
   sem estilo.
2. Copie `cn.ts` junto (3 linhas, sem `clsx`/`tailwind-merge` — se seu
   projeto já tem uma dessas libs, pode trocar).
3. Os `.test.tsx` são referência de comportamento esperado (vitest +
   `@testing-library/react`) — não rodam no CI do toolkit, mas valem copiar
   se seu projeto já tem esse setup.

## O que tem aqui

Só o conjunto que qualquer projeto novo provavelmente precisa no primeiro
dia — `Button`, `Card`, `Input`, `Badge`. Fonte: `mundialito/components/ui/`
(kit mais maduro encontrado no survey de 2026-09-20, ver
`.claude/memory/starter_kit_candidates.md`). O resto do kit do mundialito
(`Select`, `Table`, `Textarea`, `Stat`, `Icon`, `ConfirmButton`) ainda não
foi copiado — fica pra quando fizer falta, não por antecipação.

`Icon.tsx`/`icons-esporte.tsx` do mundialito ficaram de fora de propósito:
trazem `lucide-react` como dependência nova e ícone de futebol é específico
daquele projeto, não genérico.
