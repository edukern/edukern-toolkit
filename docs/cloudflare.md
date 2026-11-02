# Cloudflare: domínio, origem e lançamento

Dono: este toolkit (infra). Vale para projeto com domínio na Cloudflare, seja hospedado nela
(Pages/Workers) ou num servidor próprio (VPS, LAN) com a Cloudflare na frente.

Origem: reels guardados no `edukern/save-reels` (#41, #48, #50), revisados em 2026-11-02. São
dicas de terceiros conferidas contra o que a Cloudflare faz hoje, não norma.

## 1. Servidor próprio atrás da Cloudflare: proteger a origem

Só se aplica quando há um servidor seu (VPS, máquina na LAN) atrás do proxy laranja. Pages e
Workers não têm IP de origem para vazar.

O WAF, o anti-DDoS e o filtro de robôs só valem se todo o tráfego passar pela Cloudflare. Se
alguém descobre o IP real do servidor, acessa direto e pula tudo isso (#50). O IP costuma vazar por:

- **histórico de DNS**: o domínio já apontou direto para o servidor antes de ligar o proxy
  (serviços como SecurityTrails guardam isso para sempre);
- **subdomínio cinza**: um registro com o proxy desligado (`ftp`, `mail`, `dev`, `api`) no mesmo
  IP;
- **e-mail**: o servidor envia e-mail ele mesmo e o IP vai no cabeçalho `Received`;
- **o próprio app**: chamadas de saída para URL que o usuário controla (webhook, prévia de link)
  revelam o IP para quem recebe.

**O que fazer, do mais forte ao mais simples:**

1. **Cloudflare Tunnel** (`cloudflared`): o servidor não abre porta nenhuma para a internet; ele
   que liga para a Cloudflare. Sem porta aberta, não há IP para atacar. É o caminho padrão para
   servidor na LAN.
2. Se não der para usar o Tunnel: **firewall aceitando 80/443 só dos IPs da Cloudflare**
   (lista em `cloudflare.com/ips`) e, por cima, **Authenticated Origin Pulls** (certificado
   mútuo: a origem só responde para a Cloudflare).
3. Todo registro do servidor **com o proxy laranja**; o que precisa ficar cinza (ex.: e-mail)
   aponta para outro host.
4. E-mail sai por um provedor (Resend, SES, Postmark), nunca pelo próprio servidor.
5. **Se o IP já vazou** (histórico de DNS), fechar o firewall não basta para ataque de volume:
   troque o IP da origem depois de fechar.

**Como conferir:** `curl -sk https://<IP-da-origem> -H "Host: seudominio.com"` de fora da
Cloudflare precisa falhar (tempo esgotado ou recusa). Busque o domínio num serviço de histórico
de DNS para ver que IPs já apareceram.

## 2. Depois de comprar o domínio (#48)

1. **App num subdomínio** (`app.seudominio.com`, CNAME para onde o app está hospedado), separado
   da página de marketing na raiz. Quem mexe na página não toca no código do app.
2. **E-mail em subdomínios**: um para o transacional (cadastro, cobrança) e outro para o
   marketing, cada um com **SPF, DKIM e DMARC**. Se o de marketing cair no spam, não leva junto o
   e-mail de recuperação de senha.
3. **`sitemap.xml`** com as páginas públicas, enviado no Google Search Console para indexação.

## 3. Hospedar na Cloudflare (#41)

- **Workers** é o recomendado hoje para projeto novo (inclui arquivos estáticos de graça); o
  Pages continua funcionando.
- **R2** para arquivos (imagens, vídeo, upload, backup): compatível com S3 e **sem taxa de
  saída**. Upload continua com as regras do item 16 de `security-checklist.md`.
- **Prévia por branch**: cada branch ganha uma URL própria. Use como staging (branch `dev` =
  homologação, `main` = produção) em vez de testar direto em produção (#39 do `save-reels`).

## 4. Auditoria automática do código

A Cloudflare publicou uma skill de auditoria para Claude Code/Codex, `cloudflare/security-audit-skill`
(MIT; #22 do `save-reels`). Ela mapeia o app, manda agentes procurarem falhas (login, banco, API,
prompt injection) e cada achado passa por outro agente que tenta derrubá-lo; sai um relatório só
com o que sobrou, com o conserto.

- Complementa `security-checklist.md`, não substitui: ela lê o código sem executá-lo e não
  procura falha em dependência (para isso, `npm audit`).
- **Instale só do repositório da própria Cloudflare** (`github.com/cloudflare/security-audit-skill`).
  Já circulam cópias com nome parecido em outras contas (item 20 da checklist).
