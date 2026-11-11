import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { TOOLS } from "../lib/tools.ts";
import { runLocalTool } from "../lib/mock-ai.ts";

// These published examples are golden fixtures, not strings invented by the renderer.
// A processor change must update the editorial example as well as its behavior tests.
for (const tool of TOOLS) {
  test(`${tool.slug} documentation examples match real output`, async () => {
    const content = JSON.parse(readFileSync(new URL(`../data/tools/${tool.slug}.json`, import.meta.url), "utf8"));
    assert.equal(content.title, tool.title);
    assert.equal(content.h1, tool.title);
    assert.equal(content.description, tool.description);
    assert.equal(content.examples.length, 2);
    for (const example of content.examples) {
      assert.equal(typeof example.sourceLanguage, "string");
      assert.equal(typeof example.targetLanguage, "string");
      const actual = await runLocalTool({ tool, input: example.input, sourceLanguage: example.sourceLanguage, targetLanguage: example.targetLanguage });
      assert.equal(actual, example.output, example.title);
    }
  });
}
