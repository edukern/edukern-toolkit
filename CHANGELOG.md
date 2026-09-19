# Changelog

Formato livre (não é registry npm com changelog automático — instalação é
via tag git, `github:edukern/edukern-toolkit#vX.Y.Z`). Toda versão nova que
um consumidor for adotar deveria ter uma entrada aqui antes da tag.

## v0.4.0

- feat: `whatsapp-link` — `buildWhatsAppLink(phone, message)` monta link
  `wa.me` com mensagem pré-preenchida, sem API paga do WhatsApp Business.
  Padrão real do `rh-pontoe` (aviso de candidato de processo seletivo).
- feat: `pix-copy-paste` — `buildPixCopyPaste()` monta o "Pix copia e cola"
  (BR Code EMV) sem API de pagamento.
- feat: `calendar-invite` — `buildGoogleCalendarLink()` + `buildIcsFile()`,
  convite de calendário pré-preenchido sem OAuth.
- feat: `br-formatters` — validação/formatação de CPF, CNPJ e telefone BR.
- feat: `cep-lookup` — `fetchAddressByCep()` (ViaCEP, sem chave).
- docs: `_visual/interaction-patterns.md` — padrões "hover revela detalhe",
  "compartilhar nativo (Web Share API) com fallback", "máscara de valor em
  R$ enquanto digita" e "comprovante como imagem (canvas, sem lib)".
- feat: `design-tokens.css` — primeira peça de front-end do toolkit (as
  demais eram lógica de infra/auth). Esqueleto de design tokens Tailwind v4
  (`@theme`: cor, tipografia, sombra, raio + padrão de tema escuro), sem
  valores de marca — é molde pra copiar num projeto novo, não import de
  produção. Migrado de `~/.claude/templates/design-tokens.css` (uso pessoal
  solto) pra virar fonte única; 4 dos 5 projetos atuais já seguem essa
  convenção de nomes de token.

## v0.3.1

- fix: adiciona a condição `default` a todo `exports` do `package.json`, ao
  lado de `import`/`types`. Sem ela, `npx tsx` falha com
  `ERR_PACKAGE_PATH_NOT_EXPORTED` ao resolver subpaths (ex.
  `supabase-client-node`) mesmo quando o import ESM real funcionaria — o
  resolvedor do `tsx` faz um probe estilo CommonJS antes da resolução ESM.
  Achado testando o primeiro consumidor real (`proficiencia-ucs`).

## v0.3.0

- feat: `supabase-client-node` — mesma função de `supabase-client`
  (`getServiceClient`), sem o guard `server-only`, para scripts Node
  (`tsx`/workers) que rodam fora do bundler do Next.
- Agente `revisor-impacto` adicionado em `.claude/agents/` (revisão de
  implicações de 1ª/2ª/3ª ordem antes de mudanças em schema, módulos
  compartilhados, fluxo crítico, auth/permissões ou deploy).

## v0.2.0

- feat: `secure-cookie-option` — decide a flag `secure` do cookie
  (`AUTH_COOKIE_SECURE` ou detecção via `x-forwarded-proto`/`NODE_ENV`).
- feat: `sign-tenant-token` + `supabase-tenant-client` — JWT curto (60s) com
  claim de tenant, para RLS isolar por tenant atrás de connection pooler.
- feat: `revocable-token` — `generateOpaqueToken`/`hashOpaqueToken` para
  refresh token revogável (storage-agnostic).

## v0.1.1

- fix: elimina a dependência de build no install (`dist/` passa a ir
  commitado na tag — `prepare` rodando `tsc` no install quebrava em builds
  que não instalam devDependencies, ex. Vercel).
- fix: achados da primeira revisão de impacto.

## v0.1.0

- feat: primeira peça do toolkit — `supabase-client` (client service-role
  cacheado), `signed-session` (token HMAC-SHA256 stateless),
  `session-cookie` (cookie httpOnly wrapper), `timing-safe-compare`
  (comparação em tempo constante).
