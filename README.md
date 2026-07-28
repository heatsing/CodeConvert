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
- Front-end i18n switcher for `EN`, `PT`, `ES`, `DE`, `RU`, `FR`, `TR`, `PL`, and `TW`.
- Light/dark theme toggle with local persistence.

## Tech Stack

- Next.js 14
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

Install dependencies:

```bash
npm install
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
npm run seo:check
npm run lint
npm run typecheck
npm run build
```

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

The app is front-end first. Many tools use local mock processing or lightweight browser-side logic. The structure is intentionally prepared so real implementations can be connected later through:

- Next.js route handlers
- OpenAI API
- self-hosted compiler/converter services
- third-party APIs for network/security utilities

## Brand and Copyright Notes

This project does not use CodeConvert branding, logos, images, original copy, or proprietary assets. The UI is built with custom layout, custom content, and lucide-react icons.
