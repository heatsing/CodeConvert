import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { getToolCapability } from "../lib/tool-capabilities.ts";
import examples from "../data/verified-tool-examples.json" with { type: "json" };
import contentManifest from "../data/tool-content-manifest.json" with { type: "json" };

const contentDirectory = join(process.cwd(), "data", "tools");
const files = readdirSync(contentDirectory).filter((file) => file.endsWith(".json")).sort();
const pages = files.map((file) => ({ file, ...JSON.parse(readFileSync(join(contentDirectory, file), "utf8")) }));
const errors = [];
const coreSlugs = new Set(["code-converter", "code-generator", "code-explainer", "code-checker", "code-to-pdf", "comment-remover"]);
const knownSlugs = pages.map((page) => page.slug).sort();
if (!isDeepStrictEqual(knownSlugs, [...contentManifest].sort())) errors.push("tool-content-manifest.json must exactly match the existing content files.");

for (const page of pages) {
  if (page.slug !== basename(page.file, ".json")) errors.push(`${page.file}: slug must match its filename.`);
  for (const key of ["title", "description", "h1", "intro", "audience", "input", "outcome", "review", "bestFor"]) {
    if (typeof page[key] !== "string" || !page[key].trim()) errors.push(`${page.file}: ${key} is required.`);
  }
  for (const [key, size] of [["steps", 4], ["useCases", 4], ["commonMistakes", 3], ["tips", 4]]) {
    if (!Array.isArray(page[key]) || page[key].length !== size || page[key].some((item) => typeof item !== "string" || !item.trim())) errors.push(`${page.file}: ${key} needs ${size} nonempty text entries.`);
  }
  for (const key of ["faq", "examples", "relatedTools", "keywords"]) if (!Array.isArray(page[key])) errors.push(`${page.file}: ${key} must be an array.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(page.updatedAt ?? "")) errors.push(`${page.file}: updatedAt must use YYYY-MM-DD.`);
  for (const example of page.examples ?? []) {
    for (const key of ["title", "description", "input", "output"]) if (typeof example[key] !== "string") errors.push(`${page.file}: example ${key} must be text.`);
    if (/Review case:|Review note:|The processed result appears here\./.test(`${example.input}\n${example.output}`)) errors.push(`${page.file}: prose must not be appended to example input or output.`);
  }
  // Directory examples have one source of truth: the processor-generated manifest.
  if (!coreSlugs.has(page.slug) && page.examples?.length) errors.push(`${page.file}: put executable examples in verified-tool-examples.json instead of static editorial output.`);
  const capability = getToolCapability(page.slug);
  if (capability.indexable && (!Object.hasOwn(examples, page.slug) || capability.status !== "verified")) errors.push(`${page.file}: indexable content must have verified executable examples.`);
}
for (const [slug, entries] of Object.entries(examples)) {
  if (!entries.length) errors.push(`${slug}: no acceptance examples.`);
  for (const example of entries) {
    for (const key of ["title", "description", "input", "output"]) if (typeof example[key] !== "string") errors.push(`${slug}: verified example ${key} must be text.`);
    if (/Review case:|Review note:|The processed result appears here\./.test(`${example.input}\n${example.output}`)) errors.push(`${slug}: fabricated example annotations detected.`);
  }
}
if (errors.length) {
  errors.forEach((error) => console.error(`Error: ${error}`));
  process.exit(1);
}
console.log(`Checked ${pages.length} content files and ${Object.keys(examples).length} tools with executable examples.`);
console.log(`${pages.filter((page) => getToolCapability(page.slug).indexable).length} indexable tool pages share the verified capability registry.`);
console.log("Example outputs are checked against real processors by npm test; unverified pages do not publish example outputs.");
