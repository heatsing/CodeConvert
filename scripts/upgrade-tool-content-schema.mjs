import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const directory = join(process.cwd(), "data", "tools");
const files = readdirSync(directory).filter((file) => file.endsWith(".json"));

for (const file of files) {
  const path = join(directory, file);
  const content = JSON.parse(readFileSync(path, "utf8"));
  content.h1 ??= content.title;
  content.commonMistakes ??= [
    `Running ${content.title} with a sample that does not represent the real input.`,
    `Using the ${content.title} result without comparing it with the original source.`,
    `Skipping validation in the editor, runtime, API, or document that receives the output.`
  ];
  content.updatedAt ??= "2026-07-28";
  content.seoScore ??= 100;
  writeFileSync(path, `${JSON.stringify(content, null, 2)}\n`);
}

console.log(`Upgraded ${files.length} tool content files.`);
