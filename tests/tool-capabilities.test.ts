import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync } from "node:fs";
import { getToolCapability, isDiscoverableTool, unavailableToolReason } from "../lib/tool-capabilities.ts";
import { directoryTools } from "../lib/home-tools.ts";
import examples from "../data/verified-tool-examples.json" with { type: "json" };
import contentSlugs from "../data/tool-content-manifest.json" with { type: "json" };

test("unsupported operations and limited workspaces never enter recommendations or search index", () => {
  for (const slug of ["code-converter", "code-generator", "css-minifier", "sql-formatter", "regex-generator", "css-to-inline", "python-to-rust-converter", "python3-online-tool", "constructor"]) {
    assert.equal(getToolCapability(slug).indexable, false, slug);
    assert.equal(isDiscoverableTool({ href: `/${slug}` }), false, slug);
  }
});

test("every promoted directory tool has executable examples and a working capability", () => {
  const accepted = directoryTools.filter(isDiscoverableTool);
  assert.ok(accepted.length > 10);
  assert.equal(new Set(accepted.map((tool) => tool.href)).size, accepted.length, "Directory entries must not duplicate a canonical tool URL");
  for (const tool of accepted) {
    const slug = tool.href.slice(1);
    assert.ok(Object.hasOwn(examples, slug), slug);
    assert.equal(unavailableToolReason(tool.name), null, slug);
    if (getToolCapability(slug).indexable) assert.ok(contentSlugs.includes(slug), slug);
  }
  for (const slug of Object.keys(examples)) assert.ok(directoryTools.some((tool) => tool.href === `/${slug}`), `Example has no public route: ${slug}`);
});

test("content manifest and canonical core URLs stay aligned with actual content", () => {
  assert.deepEqual([...contentSlugs].sort(), readdirSync(new URL("../data/tools", import.meta.url)).filter((file) => file.endsWith(".json")).map((file) => file.slice(0, -5)).sort());
  assert.ok(directoryTools.find((tool) => tool.href === "/code-converter")?.name.includes("Worksheet"));
  assert.ok(directoryTools.find((tool) => tool.href === "/code-generator")?.name.includes("Template"));
});
