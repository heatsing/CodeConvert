# Programmatic SEO Architecture Audit

## Scope

This audit covers the Next.js App Router implementation, dynamic tool routes, content sources, metadata, structured data, internal links, and duplicate-content controls. Existing URLs, metadata builders, visual components, Tailwind classes, and tool interactions remain unchanged.

## Previous Architecture

### Routing

- `app/[slug]/page.tsx` resolves core tools, directory tools, language converters, and developer tools.
- `app/tools/[slug]/page.tsx` and `app/online-tools/[slug]/page.tsx` preserve old paths with permanent redirects.
- `generateStaticParams()` creates approximately 1,490 static paths.

### Data Sources

- Tool behavior and navigation entries live in `lib/tools.ts`, `lib/home-tools.ts`, `lib/language-converters.ts`, and `lib/online-tools.ts`.
- Page headings and meta descriptions are assembled by `lib/tool-page-copy.ts` and `lib/seo.ts`.
- Long-form content previously came from shared functions in `components/tool-seo-content.tsx`.

### Main Problems

1. The URL was an entity, but its content was not. A page had no independent content record.
2. Introduction, use cases, examples, review guidance, FAQ, and related links were inferred from the title and category.
3. Similar tools often shared examples and generic workflow language.
4. FAQ schema could describe generated fallback answers rather than page-specific editorial content.
5. A new page required editing multiple TypeScript catalogs, but there was no content-quality gate.
6. Indexed and noindex pages used the same content-generation mechanism even though they have different SEO responsibilities.

## New Architecture

### Independent Content Records

Each indexable tool has a JSON file in `data/tools/<slug>.json`. The file contains:

- title and description reference fields
- introduction
- audience, input, outcome, review criteria, and best-fit guidance
- four steps
- four use cases
- two examples with input and output
- four tips
- at least five FAQs
- related tool slugs
- keyword research notes

### Runtime Flow

1. `app/[slug]/page.tsx` resolves the existing tool and URL.
2. `lib/tool-content.ts` reads `data/tools/<slug>.json` during server rendering.
3. The page passes serializable content into the existing client workspace.
4. The existing `ToolSeoContent` component renders the data with its original markup and class names.
5. FAQ JSON-LD uses the same FAQ data shown on the page.
6. WebApplication and breadcrumb schema keep their existing builders and URLs.

### Indexing Boundary

- All 64 A-class slugs currently listed in `lib/seo-quality.ts` have independent JSON content.
- B-class pages remain usable and `noindex, follow`, matching the existing recovery strategy.
- B-class pages use a compatibility fallback and do not enter the sitemap.
- A page should not be promoted into the indexable set until its JSON file passes `npm run seo:check`.

## Quality Controls

`scripts/check-tool-content.mjs` verifies:

- required fields and minimum useful lengths
- exact introduction duplication
- duplicate FAQ sets and same-page FAQ questions
- duplicate example sets
- at least three related links
- no self-referencing related link
- at least 70% independent content blocks per page
- pairwise lexical similarity reporting
- complete JSON coverage for every indexable slug

## UI and SEO Stability

- No layout, Tailwind class, color, spacing, font, button, input, animation, or tool interaction was changed.
- Existing URL generation and redirects are unchanged.
- Existing title and meta-description builders are unchanged.
- The FAQ schema now reflects independent page data.
- Existing WebApplication and breadcrumb schema remain in place.
- Related links now come from the page's editorial data before falling back to the existing category links.
