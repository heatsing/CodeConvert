import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { removeJavaScriptComments } from "../lib/source-comments.ts";
import { runLocalTool } from "../lib/mock-ai.ts";
import { toolBySlug } from "../lib/tools.ts";
import { readTextFile, maxTextFileSize } from "../lib/text-file.ts";
import { readPreference, writePreference } from "../lib/client-preferences.ts";
import { canRunOnlineTool, runOnlineTool } from "../lib/online-tool-runner.ts";
import type { OnlineTool } from "../lib/online-tools.ts";

test("comment removal preserves literals, regex, templates, token boundaries, and line numbers", async () => {
  const source = 'const url = "https://example.com/*literal*/";\nconst regex = /\\/\\*.*?\\*\\//g;\nconst template = `keep /* text */ ${1 /* comment */ + 2}`;\nconst/* separator */value = 7; // remove me\n({url, matches:url.match(regex), template, value});';
  const result = await removeJavaScriptComments(source, "JavaScript");
  assert.equal(JSON.stringify(runInNewContext(result)), JSON.stringify(runInNewContext(source)));
  assert.equal(result.split("\n").length, source.split("\n").length);
  assert.ok(!result.includes("remove me"));
  assert.ok(!result.includes("separator"));
  assert.ok(result.includes("/*literal*/"));
});

test("TypeScript comment removal preserves type syntax and rejects unsupported languages", async () => {
  const source = 'const value: string = "/* literal */"; /* delete */\nexport { value };';
  const result = await removeJavaScriptComments(source, "TypeScript");
  assert.ok(result.includes('const value: string = "/* literal */";'));
  assert.ok(!result.includes("delete"));
  await assert.rejects(removeJavaScriptComments('text = "# keep"', "Python"), /supports JavaScript and TypeScript/);
});

test("invalid source is reported instead of partially rewriting it", async () => {
  await assert.rejects(removeJavaScriptComments('const = /* comment */ 1;', "JavaScript"));
});

test("JavaScript generation emits JavaScript and prompt cannot escape its comment", async () => {
  const result = await runLocalTool({ tool: toolBySlug["code-generator"], input: '*/ globalThis.injected = true; /*', sourceLanguage: "JavaScript", targetLanguage: "JavaScript" });
  assert.ok(!result.includes("public final class"));
  const context = { console: { log: () => undefined }, injected: false };
  runInNewContext(result, context);
  assert.equal(context.injected, false);
  assert.match(result, /Starter template only/);
});

test("generator rejects unsupported targets and prefixes reserved identifiers", async () => {
  await assert.rejects(runLocalTool({ tool: toolBySlug["code-generator"], input: "return", sourceLanguage: "JavaScript", targetLanguage: "Rust" }), /not available for Rust/);
  const result = await runLocalTool({ tool: toolBySlug["code-generator"], input: "class", sourceLanguage: "JavaScript", targetLanguage: "JavaScript" });
  assert.match(result, /function generated_class/);
  assert.doesNotThrow(() => runInNewContext(result, { console: { log: () => undefined } }));
});

test("large core inputs are rejected before parsing or transformation", async () => {
  await assert.rejects(runLocalTool({ tool: toolBySlug["comment-remover"], input: "x".repeat(100_001), sourceLanguage: "JavaScript", targetLanguage: "Python" }), /100,000/);
});

function textFile(bytes: number[] | Uint8Array) {
  const data = Uint8Array.from(bytes);
  return { size: data.byteLength, arrayBuffer: async () => data.buffer };
}

test("file import retains Unicode and accepts UTF-16 BOM text", async () => {
  assert.equal(await readTextFile(textFile(new TextEncoder().encode("你好 café 😀"))), "你好 café 😀");
  assert.equal(await readTextFile(textFile([0xff, 0xfe, 0x41, 0x00, 0x2d, 0x4e])), "A中");
  assert.equal(await readTextFile(textFile([0xfe, 0xff, 0x00, 0x41, 0x4e, 0x2d])), "A中");
});

test("file import rejects malformed encoding, binary text, and oversized files", async () => {
  await assert.rejects(readTextFile(textFile([0xc3, 0x28])), /not valid UTF-8/);
  await assert.rejects(readTextFile(textFile([0x61, 0x00, 0x62])), /binary data/);
  let read = false;
  await assert.rejects(readTextFile({ size: maxTextFileSize + 1, arrayBuffer: async () => { read = true; return new ArrayBuffer(0); } }), /5 MB/);
  assert.equal(read, false);
});

test("blocked browser storage does not break reading or changing preferences", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { get localStorage() { throw new Error("SecurityError"); } } });
  try {
    assert.equal(readPreference("theme"), null);
    assert.doesNotThrow(() => writePreference("theme", "dark"));
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("online runtimes cannot report fabricated success", async () => {
  for (const mode of ["code", "api", "redis", "database", "visual", "docs"] as const) {
    const tool = { mode, sample: "sample" } as OnlineTool;
    assert.equal(canRunOnlineTool(tool), false);
    await assert.rejects(runOnlineTool(tool, "invalid command", ""), /Execution is not available/);
  }
});

test("real JSON workspace validates provided data and does not silently run a sample", async () => {
  const tool = { mode: "json", sample: '{"sample": true}' } as OnlineTool;
  assert.deepEqual(JSON.parse(await runOnlineTool(tool, '{"name":"O’Connor 😀"}', "")), { name: "O’Connor 😀" });
  assert.match(await runOnlineTool(tool, '{"id":9007199254740993}', ""), /9007199254740993/);
  await assert.rejects(runOnlineTool(tool, "", ""), /Enter input/);
  await assert.rejects(runOnlineTool(tool, '{"bad":}', ""));
});
