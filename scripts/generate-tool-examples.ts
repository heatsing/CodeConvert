import { writeFile } from "node:fs/promises";
import { generateVerifiedExamples } from "../lib/verified-example-cases.ts";

async function main() {
  const examples = await generateVerifiedExamples();
  await writeFile(new URL("../data/verified-tool-examples.json", import.meta.url), JSON.stringify(examples, null, 2) + "\n", "utf8");
  console.log(`Generated real processor examples for ${Object.keys(examples).length} tools.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
