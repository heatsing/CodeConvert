import { directoryToolSlug, type DirectoryTool } from "@/lib/home-tools";
import type { OnlineTool } from "@/lib/online-tools";

export type SeoIndexClass = "A" | "B";

const indexableDirectorySlugs = new Set([
  "code-converter",
  "code-generator",
  "code-explainer",
  "comment-remover",
  "code-checker",
  "code-to-pdf",
  "json-formatter",
  "json-formatter-and-minifier",
  "json-beautifier",
  "json-validator",
  "json-viewer",
  "json-to-xml",
  "xml-to-json",
  "json-to-yaml-converter",
  "json-to-csv",
  "csv-to-json",
  "html-to-markdown",
  "markdown-to-html",
  "html-formatter",
  "html-formatter-minifier-and-beautifier",
  "html-encode",
  "html-decode",
  "xml-formatter",
  "xml-beautifier",
  "css-formatter",
  "css-beautifier",
  "css-minifier",
  "javascript-formatter",
  "javascript-minifier",
  "typescript-formatter",
  "sql-formatter",
  "yaml-formatter",
  "markdown-formatter",
  "graphql-formatter",
  "base64-encode",
  "base64-decode",
  "base64-encode-and-decode",
  "url-encode",
  "url-decode",
  "url-encode-and-decode",
  "jwt-decode",
  "regex-tester",
  "regex-tester-tool",
  "regex-generator",
  "regex-extractor",
  "regex-replace",
  "regex-explainer",
  "binary-code-translator",
  "url-parser",
  "query-string-parser",
  "code-formatter",
  "code-beautifier",
  "code-diff",
  "json-to-typescript",
  "json-to-java",
  "json-to-python",
  "remove-line-breaks",
  "character-remover",
  "duplicate-line-remover",
  "duplicate-word-finder",
  "word-counter",
  "character-counter",
  "whitespace-remover",
  "title-case-converter",
  "small-text-generator"
]);

const indexableOnlineSlugs = new Set<string>([]);

function slugFromHref(href: string) {
  return href.replace(/^\//, "").replace(/\/$/, "");
}

function getDirectorySlug(tool: DirectoryTool) {
  return slugFromHref(tool.href || `/${directoryToolSlug(tool.name)}`);
}

function isIndexableLanguageConverterSlug(slug: string) {
  const match = slug.match(/^(.+)-to-(.+)-converter$/);
  if (!match) return false;

  return false;
}

export function getDirectoryToolIndexClass(tool: DirectoryTool): SeoIndexClass {
  const slug = getDirectorySlug(tool);
  if (indexableDirectorySlugs.has(slug) || isIndexableLanguageConverterSlug(slug)) return "A";
  return "B";
}

export function shouldIndexDirectoryTool(tool: DirectoryTool) {
  return getDirectoryToolIndexClass(tool) === "A";
}

export function getOnlineToolIndexClass(tool: OnlineTool): SeoIndexClass {
  return indexableOnlineSlugs.has(tool.slug) ? "A" : "B";
}

export function shouldIndexOnlineTool(tool: OnlineTool) {
  return getOnlineToolIndexClass(tool) === "A";
}
