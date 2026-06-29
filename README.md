# CodeTools AI

CodeTools AI is a Next.js developer tools directory and tool workspace. It provides a full-screen tools homepage, root-level tool URLs, language-to-language converter pages, online runtime-style tools, and reusable MVP workspaces that are ready to connect to real processors or AI APIs later.

## Features

- Full-screen tools directory homepage with sidebar navigation.
- Root-level tool pages such as `/base64-encode`, `/json-formatter`, and `/ping-test`.
- Language converter pages such as `/perl-to-typescript-converter` and `/python-to-rust-converter`.
- Online developer workspace pages under `/online-tools/[slug]`.
- Original six AI-style tool pages under `/tools/[slug]`.
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
/online-tools/[slug]
```

Examples:

```text
/online-tools/python3-online-tool
/online-tools/regexr
/online-tools/postman
```

### Original Tool Pages

```text
/tools/code-converter
/tools/code-generator
/tools/code-explainer
/tools/comment-remover
/tools/code-checker
/tools/code-to-pdf
```

## Project Structure

```text
app/
  [slug]/page.tsx                 Root-level directory and converter pages
  online-tools/[slug]/page.tsx    Online developer tools
  tools/[slug]/page.tsx           Original six tool pages
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
npm run lint
npm run typecheck
npm run build
```

## Current MVP Notes

The app is front-end first. Many tools use local mock processing or lightweight browser-side logic. The structure is intentionally prepared so real implementations can be connected later through:

- Next.js route handlers
- OpenAI API
- self-hosted compiler/converter services
- third-party APIs for network/security utilities

## Brand and Copyright Notes

This project does not use CodeConvert branding, logos, images, original copy, or proprietary assets. The UI is built with custom layout, custom content, and lucide-react icons.
