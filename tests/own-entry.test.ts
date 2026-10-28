import assert from "node:assert/strict";
import { test } from "node:test";
import { ownEntry } from "../lib/own-entry.ts";

test("untrusted route names cannot resolve prototype properties as tools", () => {
  const tool = { slug: "json-formatter" };
  const routes = { "json-formatter": tool };
  for (const key of ["constructor", "__proto__", "toString", "hasOwnProperty", "missing"]) {
    assert.equal(ownEntry(routes, key), undefined, key);
  }
  assert.equal(ownEntry(routes, "json-formatter"), tool);
});
