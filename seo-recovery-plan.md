# SEO Recovery Plan - codeconvert.net

Audit date: 2026-07-20  
Goal: Restore Google Search Console impressions and ranking eligibility without adding low-quality pages.

## Recovery Thesis

codeconvert.net is crawlable, but the indexable URL set is too broad for the current level of unique page value. The recovery path is to reduce low-quality index signals, upgrade high-intent tool pages, and rebuild internal linking around clear tool clusters.

Do not add new pages during the recovery window unless they support a proven cluster and can be built with unique functionality, examples, and use cases.

## Phase Priorities

### Phase 1: Technical Cleanup

Objective: Help Google understand which pages are worth evaluating.

Actions:

1. Add index segmentation:
   - A-class pages: `index, follow`
   - B-class thin pages: `noindex, follow`
2. Remove noindexed URLs from sitemap.
3. Keep old route redirects:
   - `/tools/[slug]` -> `/[slug]`
   - `/online-tools/[slug]` -> `/[slug]`
4. Keep canonical URLs on root-level paths.
5. Generate a clean sitemap with only indexable pages.

Primary files likely involved:

- `lib/home-tools.ts`
- `lib/language-converters.ts`
- `lib/online-tools.ts`
- `lib/seo.ts`
- `app/sitemap.xml/route.ts`
- `app/[slug]/page.tsx`

Expected result:

Google sees fewer weak URLs and a clearer set of index candidates.

### Phase 2: A-Class Page Upgrade

Objective: Make core pages deserve ranking.

Upgrade first:

- `/json-to-xml`
- `/xml-to-json`
- `/html-to-markdown`
- `/markdown-to-html`
- `/json-formatter`
- `/json-validator`
- `/json-viewer`
- `/base64-encode`
- `/base64-decode`
- `/url-encode`
- `/url-decode`
- `/remove-line-breaks`
- `/word-counter`
- `/character-counter`
- `/regex-tester`
- `/binary-code-translator`
- `/code-to-image`
- `/code-converter`

Required structure for each A-class tool page:

```md
# JSON to XML Converter

[Tool workspace above the fold]

## What is JSON to XML Converter?

## How to Convert JSON to XML?

## JSON to XML Examples

## Common Use Cases

## Related Tools

## FAQ
```

Required content standards:

- Clear definition.
- Real input/output examples.
- Use cases by user type.
- 5-8 tool-specific FAQ questions.
- Internal links to at least 3 related tools.
- No generic AI article padding.

### Phase 3: Internal Linking

Objective: Build topical clusters and pass internal relevance.

Create clusters:

#### JSON Tools

- JSON Formatter
- JSON Validator
- JSON Viewer
- JSON to XML
- JSON to CSV
- JSON to YAML

#### XML Tools

- XML Formatter
- XML Validator
- XML to JSON
- XML to CSV
- XML Viewer

#### HTML Tools

- HTML Formatter
- HTML Minifier
- HTML to Markdown
- HTML Encode
- HTML Decode

#### Text Tools

- Remove Line Breaks
- Word Counter
- Character Counter
- Duplicate Line Remover
- Whitespace Remover
- Title Case Converter

#### Encode / Decode Tools

- Base64 Encode
- Base64 Decode
- URL Encode
- URL Decode
- HTML Entity Encode
- Unicode Decode

Each A-class page should link to at least 3 sibling pages with descriptive anchors:

- `format JSON online`
- `validate JSON syntax`
- `convert XML to JSON`
- `remove line breaks`
- `count words online`

### Phase 4: GEO / AI Search Optimization

Objective: Make tool pages easy for AI search systems to cite.

For each A-class page, include:

- Clear one-sentence definition.
- Short answer paragraph near top.
- Example input and output.
- Common use cases.
- Comparison or difference section when relevant.
- FAQ with direct answers.
- Entity terms, such as JSON, XML, API, CSV, HTML, Markdown.

Avoid:

- Long generic AI-written paragraphs.
- Keyword stuffing.
- Repeating the same boilerplate on every page.

### Phase 5: Homepage Optimization

Objective: Make homepage a clean tool hub, not a keyword dump.

Recommended homepage:

```md
# Code Conversion Tools

Popular Tools

Categories:
- JSON
- XML
- HTML
- CSV
- YAML

Trust:
- Free
- No signup
- Browser based
- Privacy focused
```

Keep homepage concise. Let category sections and tool cards carry the internal links.

## 30-Day Execution Plan

### Day 1: Technical Fixes

Deliverables:

- Add indexability rules based on A/B classification.
- Remove B-class noindex pages from sitemap.
- Verify canonical and redirects.
- Submit updated sitemap in GSC.
- Request indexing for top A-class pages only.

Success check:

- Sitemap count decreases significantly.
- No A-class URL has `noindex`.
- B-class pages remain crawlable via `noindex, follow`.

### Day 7: Core Page Updates

Deliverables:

- Upgrade 15-20 A-class pages.
- Rewrite H1/title to exact search intent.
- Add examples, use cases, and page-specific FAQs.
- Replace generic content modules on A-class pages.

Success check:

- A-class pages have unique H1/H2 and examples.
- Internal links are contextual and cluster-based.
- GSC URL inspection shows pages as indexable.

### Day 14: Internal Linking

Deliverables:

- Add tool cluster modules.
- Add breadcrumb consistency.
- Add Related Tools by category.
- Link homepage categories to A-class pages.

Success check:

- Each A-class page has at least 3 relevant internal links.
- Homepage links directly to core clusters.
- No random unrelated recommendations.

### Day 30: Content and Product Depth

Deliverables:

- Improve real tool functionality for highest-value pages.
- Add more real examples only where useful.
- Review GSC query/page data.
- Promote recovered pages from noindex only after quality upgrades.

Success check:

- Impressions begin returning on A-class pages.
- Average position improves from `>50` toward crawlable ranking ranges.
- `Crawled - currently not indexed` count falls for upgraded URLs.

## What Not To Do

- Do not add 1000 new pages.
- Do not generate generic AI articles.
- Do not keep all programmatic pages indexable.
- Do not rely on meta keywords.
- Do not submit noindexed pages in sitemap.
- Do not request indexing for weak pages.

## Recommended Next Implementation Step

Implement the index segmentation layer:

1. Add a quality classification helper.
2. Use it in metadata generation to output `noindex, follow` for B-class pages.
3. Use it in sitemap generation to include only indexable URLs.
4. Rebuild and verify sitemap count.

This should happen before large-scale content rewriting.
