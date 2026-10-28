import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import {
  binaryToText, textToBinary, textToHex, hexToText, unicodeEncode, unicodeDecode,
  reverseText, removeCharacters, csvRows, csvToJson, jsonToCsv, baseConvert,
  runLengthCodec, digestText, generatePassword, decodeJwt, jsonToXml,
  unavailableToolReason, formatSource, minifyJavaScript, assertToolInput,
  compressText, jsonToClass, formatJson, minifyJson, parseJsonSafely,
  replaceLiteralText, decodeBase64Text, urlBatch,
} from "../lib/tool-processors.ts";

test("UTF-8 encodings preserve Unicode, emoji, NUL, and meaningful outer whitespace", () => {
  for (const text of ["  hello\n", "中文😀 café مرحبا", "\0hello", "", "e\u0301"]) {
    assert.equal(binaryToText(textToBinary(text)), text);
    assert.equal(hexToText(textToHex(text)), text);
    assert.equal(unicodeDecode(unicodeEncode(text)), text);
  }
  assert.equal(unicodeDecode("\\u{1f600}"), "😀");
  assert.throws(() => binaryToText("100"), /8-bit/);
  assert.throws(() => hexToText("zz"), /hexadecimal/);
  assert.throws(() => hexToText("ff"));
});

test("text reversal preserves graphemes and removal treats punctuation literally", () => {
  assert.equal(reverseText("A👩‍💻e\u0301"), "e\u0301👩‍💻A");
  assert.equal(removeCharacters("a-z 😀 middle", "a-z😀"), "  middle");
});

test("CSV parser accepts quoted separators, escaped quotes, CRLF and multiline fields", () => {
  const input = '\uFEFFname,note,empty\r\n"Smith, Alice","She said ""hi""\nagain",\r\nBob,"  spaces  ",';
  assert.deepEqual(JSON.parse(csvToJson(input)), [
    { name: "Smith, Alice", note: 'She said "hi"\nagain', empty: "" },
    { name: "Bob", note: "  spaces  ", empty: "" },
  ]);
  assert.deepEqual(csvRows('""\r\n'), [[""]]);
  assert.throws(() => csvToJson('name,name\na,b'), /unique/);
  assert.throws(() => csvToJson('a,b\n1'), /Row 2/);
  assert.throws(() => csvToJson('a\n"unclosed'), /closing quote/);
});

test("CSV export escapes quotes and nested values and neutralizes spreadsheet formulas", () => {
  const data = [{ name: 'a"b', note: "x,y\nz", dangerous: "=HYPERLINK(\"evil\")", nested: { x: 1 }, number: -2 }];
  const output = jsonToCsv(JSON.stringify(data));
  const rows = csvRows(output);
  assert.deepEqual(rows[1], ['a"b', 'x,y\nz', '\'=HYPERLINK("evil")', '{"x":1}', '-2']);
  assert.throws(() => jsonToCsv('[null,1]'), /JSON object/);
  assert.equal(jsonToCsv('[]'), "");
  assert.deepEqual(csvRows(jsonToCsv('[{"constructor":"x","toString":"y","__proto__":"z"},{}]'))[2], ["", "", ""]);
  assert.throws(() => jsonToCsv(JSON.stringify(Array.from({ length: 400 }, (_, index) => ({ [`column${index}`]: index })))), /100,000 cells/);
});

test("CSV import rejects repeated-header amplification before building the full JSON", () => {
  assert.throws(() => csvToJson("x".repeat(50_000) + "\n1".repeat(10_000)), /too large/);
  assert.throws(() => csvToJson("x\n" + "\t\n".repeat(40_000)), /too large/);
  assert.equal(csvToJson("name\nAlice"), '[\n  {\n    "name": "Alice"\n  }\n]');
});

test("URL batches retain equals and empty values while limiting amplification", () => {
  assert.equal(urlBatch("https://example.com\nq=a=b,\npage=1,2"), "https://example.com/?q=a%3Db&page=1\nhttps://example.com/?q=&page=2");
  assert.throws(() => urlBatch("https://example.com/" + "a".repeat(40_000) + "\nq=" + Array.from({ length: 20 }, (_, i) => i).join(",")), /too large/);
  assert.throws(() => urlBatch("https://example.com\n" + "q=1\n".repeat(101)), /100 URL parameters/);
});

test("base conversion keeps precision past Number.MAX_SAFE_INTEGER and rejects partial numbers", () => {
  assert.equal(baseConvert("10\n16\n9007199254740993"), "20000000000001");
  assert.equal(baseConvert("16\n10\nFFFFFFFFFFFFFFFF"), "18446744073709551615");
  assert.equal(baseConvert("2\n10\n-101"), "-5");
  assert.throws(() => baseConvert("2\n10\n102"), /invalid/);
  assert.throws(() => baseConvert("10\n37\n100"), /2–36/);
});

test("compression cannot allocate unbounded output and round-trips emoji", () => {
  assert.equal(runLengthCodec(runLengthCodec("😀😀aa")), "😀😀aa");
  assert.throws(() => runLengthCodec("9999999999999999999999:a"), /too large/);
  assert.throws(() => runLengthCodec("2:a garbage"), /Invalid/);
  assert.throws(() => assertToolInput("a".repeat(100001)), /100,000/);
  assert.throws(() => replaceLiteralText("aaa", "", "b"), /nonempty/);
  assert.throws(() => replaceLiteralText("a".repeat(49000), "a", "b".repeat(50000)), /too large/);
  assert.equal(replaceLiteralText("one one", "one", "$&"), "$& $&");
});

test("SHA algorithms match standard known-answer vectors", async () => {
  assert.equal(await digestText("abc", "SHA-1"), "a9993e364706816aba3e25717850c26c9cd0d89d");
  assert.equal(await digestText("abc", "SHA-256"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(await digestText("abc", "SHA-512"), "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f");
  assert.match(generatePassword(), /^[A-Za-z\d_-]{32}$/);
});

test("JWT decoding preserves UTF-8 and never claims signature verification", () => {
  const header = Buffer.from('{"alg":"HS256"}').toString("base64url");
  const payload = Buffer.from('{"name":"李😀"}').toString("base64url");
  const decoded = decodeJwt(`${header}.${payload}.untrusted`);
  assert.match(decoded, /UNVERIFIED/);
  assert.match(decoded, /李😀/);
  assert.throws(() => decodeJwt("not-a-token"), /JWT/);
  for (const name of ["JWT Verify", "HMAC Generator", "SSL Checker", "Ping Test", "DNS Lookup", "URL Scanner"]) assert.ok(unavailableToolReason(name), name);
  assert.equal(unavailableToolReason("SHA256 Generator"), null);
});

test("Base64 decoding rejects invalid input instead of silently encoding it", () => {
  assert.equal(decodeBase64Text(Buffer.from("hello 中文 😀 ").toString("base64")), "hello 中文 😀 ");
  assert.throws(() => decodeBase64Text("not valid # base64"), /Invalid/);
  assert.throws(() => decodeBase64Text("/w=="), /UTF-8/);
});

test("unimplemented generators and unsafe fallback conversions cannot claim success", () => {
  for (const name of ["APA Citation Generator", "Unit Test Generator", "Code Summarizer", "Code Commenter", "API Code Generator", "SQL Query Generator", "Shell Script Generator", "Dockerfile Generator", "Code Snippet Generator", "Minify HTML", "XML Minifier", "Base64 to Image", "Curl to PHP", "Quoted Printable Encode", "Wingdings Translator"]) {
    assert.ok(unavailableToolReason(name), name);
  }
});

test("JSON to XML escapes markup and preserves nested structure", () => {
  assert.equal(jsonToXml('{"name":"<b>&","values":[1,2]}'), '<root><name>&lt;b&gt;&amp;</name><values><item>1</item><item>2</item></values></root>');
  assert.throws(() => jsonToXml('{"bad key":"value"}'), /element name/);
});

test("language formatters preserve URL strings, regex literals and nested YAML indentation", async () => {
  const input = String.raw`globalThis.result={url:"https://example.com/a//b",text:"a;{b}",regex:/a\/\/b/.source};`;
  const formatted = await formatSource(input, "javascript");
  const before = runInNewContext(input + ";JSON.stringify(result)");
  const after = runInNewContext(formatted + ";JSON.stringify(result)");
  assert.equal(after, before);
  assert.match(await formatSource("root:\n  nested:\n    - item\n", "yaml"), /root:\n  nested:\n    - item/);
  assert.match(await formatSource('type User={name:string};', "typescript"), /name: string/);
  assert.match(await formatSource('a{content:"a;{b}"}', "css"), /"a;\{b\}"/);
});

test("JavaScript minifier preserves literals that previously looked like comments", async () => {
  const input = 'globalThis.result="https://example.com/a//b/*literal*/";';
  const output = await minifyJavaScript(input);
  assert.equal(runInNewContext(output + ";result"), "https://example.com/a//b/*literal*/");
});

test("JSON formatting and minifying preserve numeric tokens that conversion must reject", async () => {
  const json = '{"id":9007199254740993,"text":"a  b"}';
  assert.match(await formatJson(json), /9007199254740993/);
  assert.match(await formatJson(decodeBase64Text(Buffer.from(json).toString("base64"))), /9007199254740993/);
  assert.equal(minifyJson(' { "id": 9007199254740993, "text": "a  b" } '), json);
  assert.throws(() => parseJsonSafely(json), /safe range/);
  assert.throws(() => jsonToCsv(json), /safe range/);
  assert.throws(() => parseJsonSafely('{"value":1e400}'), /safe range/);
  await assert.rejects(formatJson("[".repeat(101) + "0" + "]".repeat(101)), /nesting/);
});

test("compression produces real gzip and deflate streams", async () => {
  for (const format of ["gzip", "deflate"] as const) {
    const encoded = await compressText("Hello 中文 😀", format);
    const bytes = Uint8Array.from(atob(encoded), (byte) => byte.charCodeAt(0));
    const restored = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format))).text();
    assert.equal(restored, "Hello 中文 😀");
  }
});

test("model generation uses real language types and rejects invalid identifiers", () => {
  const input = '{"name":"Alice","count":1,"active":true,"items":[],"meta":{}}';
  assert.match(jsonToClass(input, "python"), /name: str\n    count: int\n    active: bool\n    items: list\[Any\]\n    meta: dict\[str, Any\]/);
  assert.match(jsonToClass(input, "java"), /public List<Object> items;/);
  assert.match(jsonToClass('{"bad-key":1}', "typescript"), /"bad-key": number/);
  assert.throws(() => jsonToClass('{"class":1}', "python"), /field name/);
  assert.throws(() => jsonToClass('{"namespace":1}', "csharp"), /field name/);
  assert.throws(() => jsonToClass('{"public":1}', "java"), /field name/);
});
