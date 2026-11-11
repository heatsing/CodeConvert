import assert from "node:assert/strict";
import test from "node:test";
import examples from "../data/verified-tool-examples.json" with { type: "json" };
import { generateVerifiedExamples } from "../lib/verified-example-cases.ts";

test("published examples exactly match the processors and selected modes", async () => {
  assert.deepEqual(await generateVerifiedExamples(), examples, "Run node --experimental-strip-types scripts/generate-tool-examples.ts after reviewing processor changes.");
});

test("representative examples keep Unicode, exact integers and genuine output", () => {
  assert.equal(examples["base64-encode-and-decode"][1].output, "你好 😀");
  assert.match(examples["json-formatter"][1].output, /9007199254740993/);
  assert.equal(examples["sha256-generator"][0].output, "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(examples["html-decode"][0].output, "© 中文 😀 &");
  for (const entries of Object.values(examples)) for (const example of entries) assert.doesNotMatch(example.output, /Review note:|processed result appears here|Compare this result with the expected/);
});
