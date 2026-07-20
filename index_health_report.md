# Index Health Report - codeconvert.net

Audit date: 2026-07-20  
Scope: Technical SEO audit before content expansion  
Primary goal: Recover Google Search Console impressions and re-enter Google's ranking pool.

## Executive Summary

The site is crawlable and the basic technical setup is not blocking Google. `robots.txt` allows crawling, `sitemap.xml` returns `200`, canonical tags point to canonical root-level URLs, and legacy `/tools/...` and `/online-tools/...` routes redirect.

The main index risk is quality dilution:

- `sitemap.xml` currently submits 1,398 URLs.
- 932 URLs are language-pair converter pages.
- 81 URLs are online/developer tool pages, many of which are simulated or brand-like IDE pages.
- All sampled pages expose `index, follow`.
- No page-level `noindex` strategy is currently applied to low-value or near-duplicate pages.
- Many pages share the same layout, examples, FAQ shape, and generic content pattern.

This pattern is consistent with a site that may be crawled but not kept in the ranking set, especially after Google re-evaluates programmatic pages.

## Phase 1: Technical SEO Audit

### 1. Robots.txt

Live result:

```txt
User-Agent: *
Allow: /

Sitemap: https://codeconvert.net/sitemap.xml
```

Assessment:

- Crawl access is open.
- Sitemap is declared correctly.
- No accidental `Disallow` rule was found.
- No robots-level crawl block explains the impression collapse.

Status: Healthy

### 2. Sitemap.xml

Live result:

- Status: `200`
- Sitemap type: XML `urlset`
- Submitted URL count: 1,398
- Duplicate URL count found in sitemap: 0
- Homepage includes logo/favicon image entries.

URL mix:

| URL Type | Count | SEO Risk |
|---|---:|---|
| Homepage | 1 | Low |
| Legal | 2 | Low |
| Core tools | 6 | Low / medium |
| Directory tools | 376 | Medium |
| Language converter pages | 932 | High |
| Online/developer tool pages | 81 | High |

Assessment:

The sitemap is valid, but too broad for the current content depth. It exposes hundreds of low-differentiation URLs before the strongest tool pages have enough unique value.

Recommended action:

- Keep only high-value A-class URLs indexable in the short term.
- Add `noindex` to weak B-class pages until they have unique examples, definitions, use cases, and working functionality.
- Remove noindexed URLs from sitemap after implementation.

### 3. Canonical

Sampled live URLs:

| URL | Status | Canonical |
|---|---:|---|
| `/` | 200 | `https://codeconvert.net` |
| `/json-to-xml` | 200 | `https://codeconvert.net/json-to-xml` |
| `/xml-to-json` | 200 | `https://codeconvert.net/xml-to-json` |
| `/html-to-markdown` | 200 | `https://codeconvert.net/html-to-markdown` |
| `/json-formatter` | 200 | `https://codeconvert.net/json-formatter` |
| `/base64-encode` | 200 | `https://codeconvert.net/base64-encode` |
| `/remove-line-breaks` | 200 | `https://codeconvert.net/remove-line-breaks` |
| `/python-to-javascript-converter` | 200 | `https://codeconvert.net/python-to-javascript-converter` |
| `/cobol-to-fortran-converter` | 200 | `https://codeconvert.net/cobol-to-fortran-converter` |
| `/php-online-tool` | 200 | `https://codeconvert.net/php-online-tool` |

Assessment:

- Canonical tags exist and generally match the final root URL.
- Canonicalization is technically correct on sampled canonical pages.
- The issue is not canonical absence. The issue is that many canonical pages are weak or near-duplicate.

Status: Technically healthy, strategically risky.

### 4. Noindex

Code scan result:

- Global layout sets index/follow behavior.
- No low-quality URL class currently receives `noindex`.
- Sampled live pages expose `index, follow`.

Assessment:

This is a high-priority issue. Google is being asked to evaluate nearly every generated tool page as an index candidate, including weak language-pair pages and simulated online IDE pages.

Recommended noindex groups:

- Low-demand language converter pairs without unique examples.
- Simulated online compiler / IDE pages without real execution.
- Brand-like tool pages modeled after third-party products.
- Thin utility pages with generic examples and no distinct use case.
- Duplicate encode/decode variants where one combined page should be canonical.

### 5. Page Status Codes

Sampled live results:

| URL | Status | Notes |
|---|---:|---|
| `/json-to-xml` | 200 | Indexable |
| `/xml-to-json` | 200 | Indexable |
| `/html-to-markdown` | 200 | Indexable |
| `/json-formatter` | 200 | Indexable |
| `/tools/code-converter` | 308 | Redirects to root-level canonical |
| `/online-tools/code-to-image` | 308 | Redirects to root-level canonical |

Assessment:

- Canonical routes return `200`.
- Legacy route redirects exist.
- Old `/tools/...` and `/online-tools/...` routes are not in sitemap.
- Redirects are acceptable, but should be monitored in GSC for discovered duplicate URLs.

### 6. Duplicate URL Risk

No exact duplicate URLs were found in sitemap.

However, semantic duplication is high:

- Many language converter pages share the same page structure.
- Many converter pairs differ only by source/target language names.
- Online IDE pages use similar simulated workflows.
- Encode/decode pages sometimes overlap with combined encoder/decoder tools.
- Tool body content still uses common shared components, tables, examples, and FAQ structure.

Assessment:

The risk is not duplicate URL strings. The risk is duplicate page intent and repeated content patterns.

### 7. Crawled - Currently Not Indexed

GSC data was not directly exported into the repo during this audit, so exact counts cannot be verified locally.

Based on the URL mix and current indexability, the most likely groups to fall into `Crawled - Currently Not Indexed` are:

- Long-tail language converter pages.
- Online tool pages that simulate third-party IDE-style workflows.
- Low-differentiation formatter/encoder variants.
- Pages with generic H1/title patterns like `Use JSON to XML Online` instead of stronger direct intent like `JSON to XML Converter`.

Recommended GSC export:

- Export Pages report.
- Filter by `Crawled - currently not indexed`.
- Join exported URL list with `page_quality_score.csv`.
- Prioritize pages that are A-class but not indexed.

## Key Findings

### Critical

1. Too many indexable programmatic pages.
2. No noindex segmentation for weak pages.
3. Core converter pages need stronger H1/title patterns.
4. Language converter pages create the largest quality-dilution footprint.

### High

1. Sitemap should not submit every generated page while page quality is uneven.
2. Online/developer pages need either real execution value or noindex.
3. Tool pages need more unique examples and use cases.
4. Internal links should cluster by tool family, not just generic related tools.

### Medium

1. Homepage H1 currently says `All-in-One Online Code Tools`; target positioning should be closer to `Code Conversion Tools`.
2. Some metadata is improved but still not enough for A-class pages.
3. FAQ blocks need more page-specific questions on core URLs.

## Technical Recommendations

### Immediate

- Add page-level noindex for B-class pages listed in `page_quality_score.csv`.
- Remove noindexed URLs from sitemap.
- Keep A-class URLs indexable.
- Keep redirects for `/tools/...` and `/online-tools/...`.

### Near Term

- Rewrite A-class page H1/title patterns:
  - `/json-to-xml`: `JSON to XML Converter`
  - `/xml-to-json`: `XML to JSON Converter`
  - `/html-to-markdown`: `HTML to Markdown Converter`
  - `/json-formatter`: `JSON Formatter`
  - `/base64-encode`: `Base64 Encoder`
- Add tool-specific examples, definitions, use cases, and FAQs to A-class pages.

### Monitoring

- Submit updated sitemap after noindex/sitemap segmentation.
- Request indexing only for A-class pages.
- Track GSC impressions by page group:
  - Core tools
  - JSON/XML/HTML/CSV/YAML tools
  - Text tools
  - Regex tools
  - Language converters
  - Online tools

## Conclusion

The site does not appear technically blocked. The drop is more likely caused by Google's quality and duplication assessment of a large programmatic tool inventory. Recovery should focus on reducing low-quality index signals, strengthening a smaller set of high-intent pages, and rebuilding internal clusters around real tool usefulness.
