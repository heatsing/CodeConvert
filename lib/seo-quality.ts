import { directoryToolSlug, type DirectoryTool } from "@/lib/home-tools";
import type { OnlineTool } from "@/lib/online-tools";
import type { ToolRoute, ToolRouteKind } from "@/lib/tool-route-inventory";
import type { ToolConfig } from "@/lib/tools";

export type SeoGrade = "A" | "B" | "C";

export type SeoAssessment = {
  score: number;
  grade: SeoGrade;
  indexable: boolean;
  reasons: string[];
};

const verifiedDirectorySlugs = new Set([
  "json-formatter", "json-beautifier", "json-validator", "json-viewer", "json-to-xml", "xml-to-json",
  "json-to-csv", "csv-to-json", "html-to-markdown", "markdown-to-html", "html-formatter", "html-encode",
  "html-decode", "xml-formatter", "xml-beautifier", "css-formatter", "css-beautifier", "css-minifier",
  "javascript-formatter", "javascript-minifier", "typescript-formatter", "sql-formatter", "yaml-formatter",
  "markdown-formatter", "graphql-formatter", "base64-encode", "base64-decode", "base64-encode-and-decode",
  "url-encode", "url-decode", "jwt-decode", "regex-tester", "regex-generator", "regex-extractor",
  "regex-replace", "regex-explainer", "binary-code-translator", "url-parser", "query-string-parser",
  "code-formatter", "code-beautifier", "code-diff", "json-to-typescript", "json-to-java", "json-to-python",
  "remove-line-breaks", "character-remover", "duplicate-line-remover", "duplicate-word-finder",
  "word-counter", "character-counter", "whitespace-remover", "title-case-converter", "small-text-generator"
]);

const verifiedCoreSlugs = new Set(["code-generator", "code-explainer", "comment-remover", "code-checker"]);
const limitedCoreSlugs = new Set(["code-generator", "code-explainer", "code-checker"]);

function gradeFromScore(score: number): SeoGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  return "C";
}

function capabilityScore(kind: ToolRouteKind, slug: string) {
  if (kind === "core") return verifiedCoreSlugs.has(slug) ? 30 : 0;
  if (kind === "directory") return verifiedDirectorySlugs.has(slug) ? 30 : 0;
  return 0;
}

export function assessToolRoute(route: Pick<ToolRoute, "slug" | "kind">): SeoAssessment {
  const reasons: string[] = ["Route exists in the canonical inventory", "Initial HTML is statically generated"];
  let score = 35;
  const capability = capabilityScore(route.kind, route.slug);

  if (capability > 0) {
    score += limitedCoreSlugs.has(route.slug) ? 20 : capability;
    reasons.push("Tool has a verified local processor");
  } else {
    reasons.push("Tool capability is simulated, incomplete, or not independently verified");
  }

  if (verifiedDirectorySlugs.has(route.slug) || verifiedCoreSlugs.has(route.slug)) {
    score += limitedCoreSlugs.has(route.slug) ? 15 : 25;
    reasons.push("Independent content, examples, FAQ, and related links are configured");
  } else {
    reasons.push("Independent long-form content has not passed the quality gate");
  }

  if (route.kind === "directory" || route.kind === "core") {
    score += 10;
    reasons.push("Internal links are available from the tool directory");
  }

  if (limitedCoreSlugs.has(route.slug)) {
    reasons.push("Rule-based output is useful but narrower than a language compiler or AI model");
  }

  const boundedScore = Math.min(100, score);
  const grade = gradeFromScore(boundedScore);
  return { score: boundedScore, grade, indexable: grade !== "C", reasons };
}

function slugFromDirectoryTool(tool: DirectoryTool) {
  return (tool.href || `/${directoryToolSlug(tool.name)}`).replace(/^\/+|\/+$/g, "").toLowerCase();
}

export function assessCoreTool(tool: ToolConfig) {
  return assessToolRoute({ slug: tool.slug, kind: "core" });
}

export function shouldIndexCoreTool(tool: ToolConfig) {
  return assessCoreTool(tool).indexable;
}

export function getDirectoryToolIndexClass(tool: DirectoryTool): SeoGrade {
  return assessToolRoute({ slug: slugFromDirectoryTool(tool), kind: "directory" }).grade;
}

export function shouldIndexDirectoryTool(tool: DirectoryTool) {
  return getDirectoryToolIndexClass(tool) !== "C";
}

export function getOnlineToolIndexClass(tool: OnlineTool): SeoGrade {
  return assessToolRoute({ slug: tool.slug.toLowerCase(), kind: "online" }).grade;
}

export function shouldIndexOnlineTool(tool: OnlineTool) {
  return getOnlineToolIndexClass(tool) !== "C";
}
