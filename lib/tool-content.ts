import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getToolUserIntent } from "@/lib/tool-user-intent";
import type { ToolPageContent } from "@/lib/tool-content-types";
import type { ToolContentExample } from "@/lib/tool-content-types";
import verifiedExamples from "@/data/verified-tool-examples.json";
import { getToolCapability } from "@/lib/tool-capabilities";

const contentDirectory = join(process.cwd(), "data", "tools");

function fallbackContent(slug: string, title: string, description: string, category: string): ToolPageContent {
  const intent = getToolUserIntent(title, category);

  return {
    slug,
    title,
    description,
    h1: title,
    intro: `${intent.audience} use ${title} when ${intent.situation.charAt(0).toLowerCase()}${intent.situation.slice(1)}`,
    audience: intent.audience,
    input: intent.input,
    outcome: intent.outcome,
    review: intent.review,
    bestFor: intent.bestFor,
    steps: intent.steps,
    useCases: intent.useCases,
    commonMistakes: [
      `Using ${title} without a representative input sample.`,
      `Treating the first result as final without checking ${intent.review.toLowerCase()}`,
      "Copying output into a destination system without running its normal validation."
    ],
    examples: [],
    tips: [
      intent.review,
      "Keep the original input available for a side-by-side comparison.",
      "Use a representative sample before processing a larger input.",
      "Validate the result in the editor, runtime, API, or publishing system where it will be used."
    ],
    faq: [],
    relatedTools: [],
    keywords: [],
    updatedAt: "2026-07-28",
    seoScore: 0
  };
}

function isToolPageContent(value: unknown): value is ToolPageContent {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<ToolPageContent>;
  return (
    typeof content.slug === "string" &&
    typeof content.title === "string" &&
    typeof content.description === "string" &&
    typeof content.h1 === "string" &&
    typeof content.intro === "string" &&
    Array.isArray(content.steps) &&
    content.steps.length === 4 &&
    Array.isArray(content.useCases) &&
    content.useCases.length === 4 &&
    Array.isArray(content.commonMistakes) &&
    content.commonMistakes.length === 3 &&
    Array.isArray(content.examples) &&
    Array.isArray(content.tips) &&
    content.tips.length === 4 &&
    Array.isArray(content.faq) &&
    Array.isArray(content.relatedTools) &&
    Array.isArray(content.keywords) &&
    typeof content.updatedAt === "string" &&
    typeof content.seoScore === "number"
  );
}

export function getToolPageContent(
  slug: string,
  title: string,
  description: string,
  category: string
): ToolPageContent {
  const path = join(contentDirectory, `${slug}.json`);
  const examples = Object.hasOwn(verifiedExamples, slug) && getToolCapability(slug).status === "verified"
    ? (verifiedExamples as Record<string, ToolContentExample[]>)[slug] : [];
  if (!existsSync(path)) return { ...fallbackContent(slug, title, description, category), examples };

  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!isToolPageContent(parsed)) {
    throw new Error(`Invalid tool content file: data/tools/${slug}.json`);
  }

  return { ...parsed, examples };
}
