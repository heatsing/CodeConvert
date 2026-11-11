import assert from "node:assert/strict";
import test from "node:test";
import { encodeBase64Text, decodeHtmlEntities, decodeUrlText, unixSecondsToIso, dateToUnixSeconds } from "../lib/browser-text-codecs.ts";
import { decodeBase64Text, unavailableToolReason } from "../lib/tool-processors.ts";

test("Base64 modes use the same UTF-8 codecs as the independent tools", () => {
  for (const input of ["中文 😀", "  café\n", "", "\0text"]) {
    const encoded = encodeBase64Text(input);
    assert.equal(encoded, Buffer.from(input).toString("base64"));
    assert.equal(decodeBase64Text(encoded), input);
  }
  assert.equal(decodeBase64Text("SGVsbG8="), "Hello");
  assert.throws(() => decodeBase64Text("not base64!"), /Base64/);
});

test("HTML decoder supports complete named and numeric entities without evaluating markup", () => {
  assert.equal(decodeHtmlEntities("&copy; &euro; &NotEqualTilde; &#20013;&#25991; &#x1F600;"), "© € ≂̸ 中文 😀");
  assert.equal(decodeHtmlEntities("&lt;img src=x onerror=alert(1)&gt;"), "<img src=x onerror=alert(1)>");
  assert.equal(decodeHtmlEntities("&amp;copy; &unknown; &amp;lt;"), "&copy; &unknown; &lt;");
  assert.equal(decodeHtmlEntities("&#0; &#xD800; &#x110000;"), "� � �");
});

test("URL decoding rejects malformed escapes and invalid UTF-8 instead of returning a success string", () => {
  assert.equal(decodeUrlText("%E4%B8%AD%E6%96%87%20%F0%9F%98%80"), "中文 😀");
  assert.equal(decodeUrlText("a+b%2Bc"), "a+b+c");
  for (const input of ["%", "%2", "%GG", "%E0%A4%A", "%FF", "%ED%A0%80"]) assert.throws(() => decodeUrlText(input), /Invalid URL-encoded input/);
});

test("Unix timestamps require complete integer seconds within the Date range", () => {
  assert.equal(unixSecondsToIso("0"), "1970-01-01T00:00:00.000Z");
  assert.equal(unixSecondsToIso("-1"), "1969-12-31T23:59:59.000Z");
  assert.equal(unixSecondsToIso(" 1709164800 "), "2024-02-29T00:00:00.000Z");
  for (const input of ["", "123abc", "1.5", "1e3", "NaN", "Infinity", "8640000000001", "9007199254740993"]) assert.throws(() => unixSecondsToIso(input));
});

test("dates reject calendar normalization and require an explicit time zone for times", () => {
  assert.equal(dateToUnixSeconds("1970-01-01"), "0");
  assert.equal(dateToUnixSeconds("2024-02-29"), "1709164800");
  assert.equal(dateToUnixSeconds("1970-01-01T08:00:00+08:00"), "0");
  assert.equal(dateToUnixSeconds("1969-12-31T23:59:59.500Z"), "-1");
  assert.equal(dateToUnixSeconds("1970-01-01T00:00Z"), "0");
  assert.equal(dateToUnixSeconds("0099-01-01"), String(Date.parse("0099-01-01T00:00:00Z") / 1000));
  for (const input of ["invalid", "123abc", "2023-02-29", "1900-02-29", "2024-04-31", "2024-00-01", "2024-13-01", "2024-01-00", "2024-01-01T24:00:00Z", "2024-01-01T00:60:00Z", "2024-01-01T00:00:60Z", "2024-01-01T00:00:00+24:00", "2024-01-01T00:00:00+08:60", "2024-01-01T00:00:00", "01/02/2024"]) assert.throws(() => dateToUnixSeconds(input), Error, input);
});

test("CSS inlining and automatic regex generation explicitly report unavailable", () => {
  assert.match(unavailableToolReason("CSS to Inline") ?? "", /not implemented/);
  assert.match(unavailableToolReason("Regex Generator") ?? "", /not available/);
});
