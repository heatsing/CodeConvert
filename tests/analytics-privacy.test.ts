import assert from "node:assert/strict";
import { test } from "node:test";
import { analyticsAllowed, analyticsPageDetails, readAnalyticsConsent, refreshAnalyticsConsent, saveAnalyticsConsent } from "../lib/analytics-privacy.ts";

test("analytics requires explicit consent and respects browser privacy signals", () => {
  for (const preference of [null, "", "denied", "invalid"]) assert.equal(analyticsAllowed(preference, {}), false);
  assert.equal(analyticsAllowed("granted", {}), true);
  assert.equal(analyticsAllowed("granted", { doNotTrack: "1" }), false);
  assert.equal(analyticsAllowed("granted", { globalPrivacyControl: true }), false);
});

test("withdrawing consent still works if browser storage starts throwing", () => {
  const originalWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
    getItem() { return "granted"; },
    setItem() { throw new Error("Storage is blocked"); }
  } } });
  try {
    refreshAnalyticsConsent();
    assert.equal(readAnalyticsConsent(), "granted");
    assert.equal(saveAnalyticsConsent("denied"), false);
    assert.equal(analyticsAllowed(readAnalyticsConsent(), {}), false);
  } finally {
    refreshAnalyticsConsent();
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
  }
});

test("page views never include query strings, fragments, or a full referrer", () => {
  assert.deepEqual(analyticsPageDetails("https://codeconvert.net/json-formatter?token=secret#private", "https://example.com/users/private?email=test@example.com"), {
    page_location: "https://codeconvert.net/json-formatter",
    page_referrer: "https://example.com"
  });
  assert.equal(analyticsPageDetails("https://codeconvert.net/", "").page_referrer, "");
});
