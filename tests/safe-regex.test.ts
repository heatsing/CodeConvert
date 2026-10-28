import assert from "node:assert/strict";
import test from "node:test";
import { Worker } from "node:worker_threads";
import { parseRegexLiteral, regexWorkerSource, runSafeRegex } from "../lib/safe-regex.ts";

function evaluate(request: { pattern: string; text: string; flags?: string; operation?: string; replacement?: string }, timeout = 1000) {
  return new Promise<{ ok: boolean; result?: unknown; error?: string }>((resolve, reject) => {
    const worker = new Worker(`const { parentPort } = require('node:worker_threads'); globalThis.self = {postMessage: value => parentPort.postMessage(value)}; ${regexWorkerSource}; parentPort.on('message', data => self.onmessage({data}));`, { eval: true });
    const timer = setTimeout(() => { void worker.terminate(); reject(new Error("Worker timed out and was terminated.")); }, timeout);
    worker.once("message", (response) => { clearTimeout(timer); void worker.terminate(); resolve(response); });
    worker.once("error", (error) => { clearTimeout(timer); void worker.terminate(); reject(error); });
    worker.postMessage({ flags: "", operation: "match", replacement: "", ...request });
  });
}

test("regex parsing preserves empty patterns and literal flags", () => {
  assert.deepEqual(parseRegexLiteral("//u"), { pattern: "", flags: "u" });
  assert.deepEqual(parseRegexLiteral("/a\\/b/gi"), { pattern: "a\\/b", flags: "gi" });
});

test("worker executes matches, captures, empty matches and empty split fields", async () => {
  assert.deepEqual((await evaluate({ pattern: "a", text: "aba" })).result, ["a", "a"]);
  assert.deepEqual((await evaluate({ pattern: "", text: "😀", flags: "u" })).result, ["", ""]);
  assert.deepEqual((await evaluate({ pattern: ",", text: ",a,,", operation: "split" })).result, ["", "a", "", ""]);
  assert.equal((await evaluate({ pattern: "[", text: "abc" })).ok, false);
});

test("replacement follows native capture and context substitutions", async () => {
  const pattern = "(?<first>a)(b)?";
  const text = "cab ada";
  for (const replacement of ["$&", "$1-$2-$<first>", "$$:$12:$01", "$`:$'"]) {
    const actual = await evaluate({ pattern, text, flags: "g", operation: "replace", replacement });
    assert.equal(actual.result, text.replace(new RegExp(pattern, "g"), replacement), replacement);
  }
});

test("excessive regex output is rejected instead of silently truncated", async () => {
  assert.equal((await evaluate({ pattern: "a", text: "a".repeat(1001) })).ok, false);
  const result = await evaluate({ pattern: "a", text: "a".repeat(1000), flags: "g", operation: "replace", replacement: "b".repeat(1000) });
  assert.equal(result.ok, false);
  assert.match(result.error!, /too large/);
  for (const replacement of ["$'".repeat(5000), "$`".repeat(5000)]) {
    const amplified = await evaluate({ pattern: "a", text: "x".repeat(50000) + "a" + "x".repeat(49999), operation: "replace", replacement });
    assert.equal(amplified.ok, false);
    assert.match(amplified.error!, /too large/);
  }
});

test("replacement preserves the user's global flag choice", async () => {
  assert.equal((await evaluate({ pattern: "a", text: "aaa", operation: "replace", replacement: "x" })).result, "xaa");
  assert.equal((await evaluate({ pattern: "a", text: "aaa", flags: "g", operation: "replace", replacement: "x" })).result, "xxx");
});

test("catastrophic backtracking remains killable inside an isolated worker", async () => {
  await assert.rejects(evaluate({ pattern: "(a+)+$", text: "a".repeat(100) + "!" }, 100), /terminated/);
});

test("oversized expressions are rejected before a browser worker is allocated", async () => {
  await assert.rejects(runSafeRegex({ pattern: "a".repeat(501), text: "" }), /500 characters/);
  await assert.rejects(runSafeRegex({ pattern: "a", text: "a".repeat(100001) }), /100,000/);
});
