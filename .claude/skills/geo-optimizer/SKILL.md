---
name: geo-optimizer
description: Use when auditing or improving how AI search engines (ChatGPT Search, Perplexity, Claude, Gemini AI Overviews) discover and cite this site — robots.txt AI-bot access, llms.txt, JSON-LD schema, AI discovery endpoints (.well-known/ai.txt, /ai/summary.json, /ai/faq.json), and Princeton-GEO content methods. Adapted for Codeless from github.com/Auriti-Labs/geo-optimizer-skill (MIT).
---

# GEO Optimizer

> Make CODE LESS visible and citable by AI search engines. Adapted from
> [Auriti-Labs/geo-optimizer-skill](https://github.com/Auriti-Labs/geo-optimizer-skill) (MIT
> license — see `ATTRIBUTIONS.md`) for this Vite + React SPA. The upstream project ships a
> `geo` Python CLI; this repo has no such tool installed, so treat every step below as a
> manual/agent-driven checklist against the files in `public/` and `index.html` instead of
> running `geo` commands.

## Where things live in this repo

| Purpose | File |
|---|---|
| AI-bot access | [`public/robots.txt`](../../../public/robots.txt) |
| AI-crawler site guide | [`public/llms.txt`](../../../public/llms.txt) |
| Sitemap | [`public/sitemap.xml`](../../../public/sitemap.xml) |
| AI discovery endpoint | [`public/.well-known/ai.txt`](../../../public/.well-known/ai.txt) |
| Structured summary | [`public/ai/summary.json`](../../../public/ai/summary.json) |
| Structured FAQ | [`public/ai/faq.json`](../../../public/ai/faq.json) |
| Meta tags + JSON-LD (WebSite, Organization, FAQPage) | [`index.html`](../../../index.html) |

This is a single-page app: all sections live on `/` as anchors (`#home`, `#servicos`,
`#diferenciais`, `#quem-somos`, `#ceo`, `#projetos`, `#faq`, `#contato`). There is no
server-side rendering, so all SEO/GEO signals (meta tags, JSON-LD) must be static and live
directly in `index.html` — not injected via a client-side `<head>` library, since crawlers
that don't execute JS (and most GEO citation bots) only see the initial HTML.

The `/admin/*` route is the internal back office — it must stay out of `robots.txt`,
`sitemap.xml`, and `llms.txt`.

## Workflow for future GEO work on this site

### 1. Re-audit before large changes
Manually score against the 8 categories in `reference/scoring-rubric.md` (robots, llms,
schema, meta, content, signals, ai_discovery, brand_entity) whenever content changes
significantly. There's no `geo audit` binary here — read the rubric and check each file above
against it.

### 2. Keep AI crawler access open (`public/robots.txt`)
Critical citation bots that must never be blocked: `OAI-SearchBot` (ChatGPT Search),
`PerplexityBot` (Perplexity), `ClaudeBot` (Claude), `Google-Extended` (Gemini AI Overviews).
Full list and allow/block strategies: `reference/ai-bots-list.md`.

### 3. Keep `public/llms.txt` in sync
When a new page/section/service ships, add or update its entry. Structure: H1 (site name) →
blockquote (description) → H2 sections → bullet links with a one-line description. Keep it
under 200 lines. Full spec: `reference/llms-txt.md` and https://llmstxt.org.

### 4. Extend JSON-LD in `index.html`
Add or update schema when the offering changes (new service → update the `Organization`
`makesOffer` list; new FAQ → update both the `FAQPage` script in `index.html` and
`public/ai/faq.json`). Ready-to-adapt templates for every schema type (WebSite,
WebApplication, FAQPage, Article, HowTo, Organization, BreadcrumbList, Product):
`reference/schema-templates.md`. Validate at https://validator.schema.org.

### 5. Content methods (Princeton KDD 2024 GEO research)
When writing new copy for the site, prioritize by measured citability impact:

| Priority | Method | Impact | Action |
|----------|--------|--------|--------|
| 🔴 1 | Cite Sources | +30–115% | Add authoritative external links |
| 🔴 2 | Add Statistics | +40% | Include concrete numbers, percentages, dates |
| 🟠 3 | Quotation Addition | +30–40% | Expert quotes: `"Text" — Name, Role, Org, Year` |
| 🟠 4 | Authoritative Tone | +6–12% | Confident, expert framing |
| 🟡 5 | Fluency Optimization | +15–30% | Clear, direct language |
| 🟡 6 | Easy-to-Understand | +8–15% | Define terms, use analogies |
| 🟢 7 | Technical Terms | +5–10% | Correct industry terminology |
| 🟢 8 | Unique Words | +5–8% | Vary vocabulary deliberately |
| ❌ 9 | Keyword Stuffing | ~0% ⚠️ | Do NOT apply — neutral to negative |

### 6. Scoring reference
`reference/scoring-rubric.md` — the 8-category, 100-point rubric this checklist targets.

## Reference files (load on demand)

- [`reference/ai-bots-list.md`](reference/ai-bots-list.md) — full AI bot user-agent list and robots.txt strategies.
- [`reference/llms-txt.md`](reference/llms-txt.md) — llms.txt spec and structure.
- [`reference/schema-templates.md`](reference/schema-templates.md) — JSON-LD templates for every schema type.
- [`reference/scoring-rubric.md`](reference/scoring-rubric.md) — the 8-category GEO scoring rubric.
