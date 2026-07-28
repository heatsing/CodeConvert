import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const contentDirectory = join(root, "data", "tools");
const files = readdirSync(contentDirectory).filter((file) => file.endsWith(".json")).sort();
const pages = files.map((file) => {
  const content = JSON.parse(readFileSync(join(contentDirectory, file), "utf8"));
  return { file, ...content };
});

const errors = [];
const warnings = [];

function normalized(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function shingles(value, size = 5) {
  const words = normalized(value).split(/\s+/).filter(Boolean);
  const result = new Set();
  for (let index = 0; index <= words.length - size; index += 1) {
    result.add(words.slice(index, index + size).join(" "));
  }
  return result;
}

function similarity(left, right) {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const value of left) {
    if (right.has(value)) intersection += 1;
  }
  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function duplicateGroups(entries) {
  const groups = new Map();
  for (const [slug, value] of entries) {
    const key = normalized(value);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(slug);
  }
  return [...groups.values()].filter((group) => group.length > 1);
}

const requiredStrings = {
  slug: 3,
  title: 3,
  description: 60,
  h1: 3,
  intro: 100,
  audience: 30,
  input: 60,
  outcome: 60,
  review: 60,
  bestFor: 60
};
const knownSlugs = new Set(pages.map((page) => page.slug));

for (const page of pages) {
  const expectedSlug = basename(page.file, ".json");
  if (page.slug !== expectedSlug) errors.push(`${page.file}: slug must match the file name.`);

  for (const [key, minimumLength] of Object.entries(requiredStrings)) {
    if (typeof page[key] !== "string" || page[key].trim().length < minimumLength) {
      errors.push(`${page.file}: ${key} must be a meaningful string.`);
    }
  }

  for (const [key, expectedLength] of [["steps", 4], ["useCases", 4], ["commonMistakes", 3], ["examples", 2], ["tips", 4]]) {
    if (!Array.isArray(page[key]) || page[key].length !== expectedLength) {
      errors.push(`${page.file}: ${key} must contain exactly ${expectedLength} entries.`);
    }
  }

  if (!Array.isArray(page.faq) || page.faq.length < 5) errors.push(`${page.file}: faq must contain at least five entries.`);
  if (!Array.isArray(page.relatedTools) || page.relatedTools.length < 3) errors.push(`${page.file}: relatedTools must contain at least three entries.`);
  if (!Array.isArray(page.keywords) || page.keywords.length < 4) errors.push(`${page.file}: keywords must contain at least four entries.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(page.updatedAt ?? "")) errors.push(`${page.file}: updatedAt must use YYYY-MM-DD.`);
  if (!Number.isInteger(page.seoScore) || page.seoScore < 0 || page.seoScore > 100) errors.push(`${page.file}: seoScore must be an integer from 0 to 100.`);

  const faqQuestions = new Set((page.faq ?? []).map((item) => normalized(item.question)));
  if (faqQuestions.size !== page.faq.length) errors.push(`${page.file}: duplicate FAQ questions found on the same page.`);

  const exampleSignatures = new Set((page.examples ?? []).map((item) => normalized(`${item.input} ${item.output}`)));
  if (exampleSignatures.size !== page.examples.length) errors.push(`${page.file}: duplicate examples found on the same page.`);

  for (const relatedSlug of page.relatedTools ?? []) {
    if (relatedSlug === page.slug) errors.push(`${page.file}: relatedTools cannot link to itself.`);
    if (!knownSlugs.has(relatedSlug)) warnings.push(`${page.file}: related tool ${relatedSlug} has no independent content file.`);
  }
}

for (const group of duplicateGroups(pages.map((page) => [page.slug, page.intro]))) {
  errors.push(`Duplicate introductions: ${group.join(", ")}`);
}

for (const group of duplicateGroups(pages.map((page) => [
  page.slug,
  page.examples.map((example) => `${example.input}\n${example.output}`).join("\n")
]))) {
  errors.push(`Duplicate example sets: ${group.join(", ")}`);
}

for (const group of duplicateGroups(pages.map((page) => [
  page.slug,
  page.faq.map((faq) => `${faq.question}\n${faq.answer}`).join("\n")
]))) {
  errors.push(`Duplicate FAQ sets: ${group.join(", ")}`);
}

const contentShingles = pages.map((page) => ({
  slug: page.slug,
  values: shingles([
    page.intro,
    ...page.useCases,
    ...page.examples.flatMap((example) => [example.title, example.description, example.input, example.output]),
    ...page.tips,
    ...page.faq.flatMap((faq) => [faq.question, faq.answer])
  ].join(" "))
}));

let lowestPairwiseRatio = 1;
let closestPair = [];
for (let leftIndex = 0; leftIndex < contentShingles.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < contentShingles.length; rightIndex += 1) {
    const left = contentShingles[leftIndex];
    const right = contentShingles[rightIndex];
    const pairwiseRatio = 1 - similarity(left.values, right.values);
    if (pairwiseRatio < lowestPairwiseRatio) {
      lowestPairwiseRatio = pairwiseRatio;
      closestPair = [left.slug, right.slug];
    }
  }
}

const allBlocks = pages.flatMap((page) => [
  [page.slug, "intro", page.intro],
  ...page.useCases.map((value, index) => [page.slug, `useCases.${index}`, value]),
  ...page.examples.flatMap((example, index) => [
    [page.slug, `examples.${index}.description`, example.description],
    [page.slug, `examples.${index}.input`, example.input],
    [page.slug, `examples.${index}.output`, example.output]
  ]),
  ...page.tips.map((value, index) => [page.slug, `tips.${index}`, value]),
  ...page.faq.flatMap((faq, index) => [
    [page.slug, `faq.${index}.question`, faq.question],
    [page.slug, `faq.${index}.answer`, faq.answer]
  ])
]);
const blockCounts = new Map();
for (const [, , value] of allBlocks) {
  const key = normalized(value);
  blockCounts.set(key, (blockCounts.get(key) ?? 0) + 1);
}
for (const page of pages) {
  const pageBlocks = allBlocks.filter(([slug]) => slug === page.slug);
  const uniqueBlocks = pageBlocks.filter(([, , value]) => blockCounts.get(normalized(value)) === 1);
  const uniqueRatio = pageBlocks.length === 0 ? 0 : uniqueBlocks.length / pageBlocks.length;
  if (uniqueRatio < 0.7) {
    errors.push(`${page.file}: independent content-block ratio is ${(uniqueRatio * 100).toFixed(1)}%; minimum is 70%.`);
  }
}

if (lowestPairwiseRatio < 0.4) {
  warnings.push(`Closest pages are ${closestPair.join(" and ")} with ${(lowestPairwiseRatio * 100).toFixed(1)}% pairwise lexical difference; review these first during editorial refinement.`);
}

const indexSource = readFileSync(join(root, "lib", "seo-quality.ts"), "utf8");
const verifiedBlocks = [...indexSource.matchAll(/const verified(?:Directory|Core)Slugs = new Set\(\[([\s\S]*?)\]\);/g)];
const indexableSlugs = verifiedBlocks.flatMap((block) => [...block[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]));
for (const slug of indexableSlugs) {
  if (!knownSlugs.has(slug)) errors.push(`Indexable page ${slug} is missing data/tools/${slug}.json.`);
}

for (const warning of [...new Set(warnings)]) console.warn(`Warning: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`Error: ${error}`);
  process.exit(1);
}

console.log(`Checked ${pages.length} tool content files.`);
console.log("Every page has at least 70% independently authored content blocks.");
console.log(`Lowest pairwise lexical difference: ${(lowestPairwiseRatio * 100).toFixed(1)}% (${closestPair.join(" vs ")}).`);
console.log(`All ${indexableSlugs.length} verified indexable slugs have independent content files.`);
