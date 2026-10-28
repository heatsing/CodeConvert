# CodeTools AI

CodeTools AI is a Next.js developer tools directory and tool workspace. It provides a full-screen tools homepage, root-level tool URLs, language-to-language converter pages, online runtime-style tools, and reusable MVP workspaces that are ready to connect to real processors or AI APIs later.

## Features

- Full-screen tools directory homepage with sidebar navigation.
- Root-level tool pages such as `/base64-encode`, `/json-formatter`, and `/ping-test`.
- Language converter pages such as `/perl-to-typescript-converter` and `/python-to-rust-converter`.
- Online developer workspace pages also use root-level URLs such as `/python3-online-tool`.
- Core AI-style tool pages also use root-level URLs such as `/comment-remover`.
- Front-end MVP interactions for input, output, run, copy, clear, upload, and download flows.
- SEO content sections on tool pages: how-to, examples, usage table, FAQ, related tools, and online workspaces.
- Front-end i18n switcher for `EN`, `PT`, `ES`, `DE`, `RU`, `FR`, `TR`, `PL`, `CN`, and `TW`.
- Light/dark theme toggle with local persistence.

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- lucide-react icons

## Route Overview

### Homepage

```text
/
```

The homepage is a full-screen developer tools directory with:

- Popular tools
- Frequently used tools
- Language online tools
- Online developer tools
- Encode / Decode / Convert / Utility / Format / Security / Network / Regex / Code sections

### Root Tool Pages

Most directory tools use root-level URLs:

```text
/base64-encode
/url-decode
/json-formatter
/word-counter
/ping-test
```

These pages are generated from `lib/home-tools.ts`.

### Language Converter Pages

Language conversion pages use:

```text
/{source}-to-{target}-converter
```

Examples:

```text
/perl-to-typescript-converter
/python-to-rust-converter
/javascript-to-go-converter
```

These pages are generated from `lib/language-converters.ts` and the language list in `lib/languages.ts`.

### Online Tools

```text
/{slug}
```

Examples:

```text
/python3-online-tool
/regexr
/postman
```

Old prefixed online tool URLs redirect to the root-level version.

### Core Tool Pages

```text
/code-converter
/code-generator
/code-explainer
/comment-remover
/code-checker
/code-to-pdf
```

Legacy `/tools/[slug]` URLs redirect to the root-level version.

## Project Structure

```text
app/
  [slug]/page.tsx                 Root-level directory, converter, and online tool pages
  online-tools/[slug]/page.tsx    Legacy redirect handler for old online tool URLs
  tools/[slug]/page.tsx           Legacy redirects for old tool URLs
components/
  home-directory.tsx              Homepage directory UI
  directory-tool-workspace.tsx    Root tool workspace
  online-tool-workspace.tsx       Online tool workspace
  tool-layout.tsx                 Original tool layout
  tool-seo-content.tsx            Shared SEO content sections
  site-header.tsx                 Header, language switcher, theme toggle
  site-footer.tsx                 Global footer
lib/
  home-tools.ts                   Directory tool data
  language-converters.ts          Language converter route generation
  online-tools.ts                 Online tool data
  tools.ts                        Original tool configs
  i18n.tsx                        Front-end i18n provider and dictionaries
  mock-ai.ts                      Mock result layer
```

## Getting Started

Use Node.js 24.11 or newer within the Node.js 24 release line (`.nvmrc` selects 24). Install the exact dependency versions in the lockfile:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Quality Checks

```bash
npm run build:verified
```

This runs the dependency advisory gate (high/critical), lint, generated route types and TypeScript checks, regression tests, content checks, a production build, and production HTTP/SEO smoke checks. `npm run check` runs the fast local checks without a build. The smoke runner starts a temporary server bound to `127.0.0.1` and stops it after the check.

Pull requests and pushes to `main` run the same verified build in GitHub Actions. A weekly workflow checks newly published dependency advisories; Dependabot proposes monthly package and action updates. No workflow auto-merges changes. Branch protection and notification recipients are account settings that the repository alone cannot enforce.

## Netlify Deployment

The [codeconvenet project](https://app.netlify.com/projects/codeconvenet/) is connected to `heatsing/CodeConvert` on GitHub and deploys the `main` branch. Its default address is [codeconvenet.netlify.app](https://codeconvenet.netlify.app).

`netlify.toml` sets the build command to `npm run build:verified` and the publish directory to `.next`. Checks therefore run inside Netlify before publication, even when GitHub branch protection has not been enabled. `.nvmrc` selects Node.js 24 for local development and Netlify builds. Netlify automatically supplies its Next.js adapter; no manually pinned adapter is required. Keep the normal Next.js build so route handlers, legacy URL redirects, and security headers from `next.config.mjs` continue to work.

Production environment variables are managed in Netlify's project settings:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used by metadata, structured data, robots.txt, and the sitemap. Keep `https://codeconvert.net` for this migration; this is also the application's default. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional Google Analytics measurement ID. Analytics loads only after the visitor opts in through the privacy page; setting an ID does not override that choice. |

These public values are included at build time. Trigger a new deploy after changing them. Do not replace the production canonical origin with the temporary `netlify.app` address.

To finish the domain cutover, add `codeconvert.net` and any currently used aliases in Netlify's Domain management, keep `codeconvert.net` as the primary domain, and update the domain's DNS using the records shown by Netlify. Verify HTTPS, homepage and tool pages, legacy redirects, and `/sitemap.xml` on the custom domain before removing the old Vercel deployment.

The existing live SEO check can validate the Netlify deployment before DNS changes while still checking the production canonical URLs. In PowerShell:

```powershell
$env:SEO_BASE_URL = "https://codeconvenet.netlify.app"
npm run seo:live-check
```

After DNS propagation, run it again with `SEO_BASE_URL` set to `https://codeconvert.net`.

See [operations and recovery](docs/operations.md) for release checks, rollback instructions, dependency review, and account settings that require separate verification.

## Adding Programmatic SEO Content

Indexable tool pages read their long-form content from `data/tools/<slug>.json`. To add or promote a page:

1. Add the tool to the existing tool catalog so its current URL and workspace continue to work.
2. Copy an existing JSON file in `data/tools` and rename it to the exact page slug.
3. Write an independent introduction, audience, input, outcome, review guidance, examples, tips, FAQs, and related tool list.
4. Add the slug to the indexable set in `lib/seo-quality.ts` only after the content is complete.
5. Run `npm run seo:check`, followed by the normal lint, type, and build checks.

The page component does not need to be copied or edited. `app/[slug]/page.tsx` loads the JSON during static rendering and passes it into the existing visual components.

The optional `scripts/seed-tool-content.mjs` command only creates missing starter files. It does not overwrite existing JSON unless it is run with `--force`.

## Current MVP Notes

The app processes tool input locally in the browser. Implemented operations include text/encoding transforms, JSON/CSV processing, parser-based formatting, JavaScript/TypeScript comment removal, SHA hashes, and isolated regular expressions. Input/output limits apply.

Tools without reliable implementations show an explicit unavailable notice. Runtime, network, security, and unsupported conversion tools do not fabricate execution results. Core code generation produces labelled starter templates; code conversion produces a migration worksheet. The code-to-PDF workspace currently exports text, not PDF. No external AI service is connected. Real implementations could later be connected through:

- Next.js route handlers
- OpenAI API
- self-hosted compiler/converter services
- third-party APIs for network/security utilities

## Brand and Copyright Notes

The site displays CodeConvert branding and bundled logo assets. The UI also uses lucide-react icons. Ownership and licensing of the branding and bundled assets must be confirmed by the operator; this repository does not establish those rights.
