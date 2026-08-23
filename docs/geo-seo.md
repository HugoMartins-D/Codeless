# GEO / AEO — otimização para busca por IA

Este documento resume o que foi aplicado ao site para que ferramentas de IA generativa
(ChatGPT Search, Perplexity, Claude, Gemini AI Overviews) consigam descobrir, entender e
citar a CODE LESS. Baseado em
[Auriti-Labs/geo-optimizer-skill](https://github.com/Auriti-Labs/geo-optimizer-skill) (MIT —
ver `ATTRIBUTIONS.md`), instalado como skill de projeto em
[`.claude/skills/geo-optimizer/`](../.claude/skills/geo-optimizer/SKILL.md) para uso em
trabalhos futuros de GEO/SEO neste repositório.

## O que mudou

- **`index.html`**
  - Removido `noindex, nofollow` → `index, follow` (o site agora pode ser indexado/citado).
  - Adicionado `<link rel="canonical">`, meta tags Open Graph e Twitter Card.
  - Adicionado JSON-LD: `WebSite`, `Organization` (com os 3 serviços) e `FAQPage` (as 5
    perguntas da seção FAQ).
- **`public/robots.txt`** (novo) — libera explicitamente os bots de citação de IA
  (`OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, etc.), mantém `Googlebot`
  e `*` liberados, bloqueia `/admin` e aponta para o sitemap.
- **`public/llms.txt`** (novo) — resumo do site em Markdown para crawlers de IA, com as
  seções de serviços, processo de trabalho e FAQ.
- **`public/sitemap.xml`** (novo) — a URL única da landing page (SPA de página única).
- **`public/.well-known/ai.txt`**, **`public/ai/summary.json`**, **`public/ai/faq.json`**
  (novos) — endpoints de "AI discovery" com um resumo estruturado e o FAQ em JSON-LD.

## ⚠️ Pendências antes do merge/deploy

1. **Domínio**: todos os arquivos acima usam `https://codeless.com.br/`. Confirme que este é
   o domínio real de produção — se for outro, substitua em `index.html`,
   `public/robots.txt`, `public/llms.txt`, `public/sitemap.xml` e `public/.well-known/ai.txt`
   antes de publicar.
2. **`noindex` removido**: o site passa a ser indexável por buscadores e IAs a partir deste
   deploy. Confirme que o lançamento público é intencional.
3. **`sameAs` da Organization**: não há perfis sociais confirmados (Instagram no menu aponta
   para `#`). Adicione os links reais quando existirem — aumenta a confiança de "entidade"
   para IAs (`brand_entity` no rubric de pontuação).
4. Depois do deploy, valide:
   - `curl https://codeless.com.br/robots.txt`
   - `curl https://codeless.com.br/llms.txt`
   - JSON-LD em https://validator.schema.org
   - Enviar `sitemap.xml` ao Google Search Console / Bing Webmaster Tools.
