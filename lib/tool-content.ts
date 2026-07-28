import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getToolUserIntent } from "@/lib/tool-user-intent";
import type { ToolPageContent } from "@/lib/tool-content-types";

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
    examples: [
      {
        title: "Representative input",
        description: "Start with a small sample that contains the structure or text condition you need to verify.",
        input: "Paste a representative input from the real task.",
        output: "The processed result appears here."
      },
      {
        title: "Edge-case check",
        description: "Run a second sample with different values or edge cases before relying on the result.",
        input: "Add an edge case from the destination workflow.",
        output: "Compare this result with the expected destination behavior."
      }
    ],
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
    content.examples.length === 2 &&
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
  if (!existsSync(path)) return fallbackContent(slug, title, description, category);

  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!isToolPageContent(parsed)) {
    throw new Error(`Invalid tool content file: data/tools/${slug}.json`);
  }

  return parsed;
}
