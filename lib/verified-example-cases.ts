import { binaryToText, textToBinary, formatJson, formatSource, minifyJavaScript, csvToJson, jsonToCsv, jsonToXml, jsonToClass, decodeBase64Text, digestText } from "./tool-processors.ts";
import { removeJavaScriptComments } from "./source-comments.ts";
import { encodeBase64Text, decodeHtmlEntities, decodeUrlText, unixSecondsToIso, dateToUnixSeconds } from "./browser-text-codecs.ts";

export type ExampleInput = { title: string; description: string; input: string; mode?: string };
export type VerifiedExample = ExampleInput & { output: string };
type ExampleCase = { examples: ExampleInput[]; run: (input: string, mode?: string) => string | Promise<string> };
const sample = (title: string, description: string, input: string, mode?: string): ExampleInput => ({ title, description, input, ...(mode ? { mode } : {}) });
const jsonSamples = [sample("Nested values", "Objects, arrays, booleans and null remain JSON values after formatting.", '{"user":{"name":"李"},"items":[1,true,null]}'), sample("Large identifier", "Formatting preserves this numeric token beyond the JavaScript safe integer range.", '{"id":9007199254740993,"message":"Hello 😀"}')];
const textSamples = [sample("UTF-8 text", "Chinese characters and an emoji are encoded as UTF-8 bytes.", "你好 😀"), sample("Whitespace", "Leading spaces and line breaks are meaningful input and remain in a round trip.", "  first\nsecond\n")];
const jsSamples = [sample("URL and comment-like string", "The URL and comment-like characters inside the string remain literal text.", 'const data={url:"https://example.com/a//b",text:"/* literal */"};'), sample("Array and function", "The source is parsed and formatted without executing the function.", 'function double(values){return values.map(value=>value*2)}')];

export const verifiedExampleCases: Record<string, ExampleCase> = {};
const add = (slugs: string[], examples: ExampleInput[], run: ExampleCase["run"]) => { for (const slug of slugs) verifiedExampleCases[slug] = { examples, run }; };
add(["json-formatter", "json-beautifier"], jsonSamples, formatJson);
add(["json-validator", "json-viewer"], jsonSamples, formatJson);
add(["javascript-formatter", "code-formatter", "code-beautifier"], jsSamples, (input) => formatSource(input, "javascript"));
add(["javascript-minifier"], jsSamples, minifyJavaScript);
add(["typescript-formatter"], [sample("Typed record", "Type annotations are retained while spacing is normalized.", 'type User={name:string;active:boolean};'), sample("Typed function", "Formatting does not execute or type-check this function.", 'function greet(name:string):string{return `Hello ${name}`}')], (input) => formatSource(input, "typescript"));
add(["css-formatter", "css-beautifier"], [sample("CSS declarations", "The selector and declarations are parsed as CSS.", 'p{color:red;margin:0 1rem}'), sample("String content", "Semicolons and braces within a quoted content value remain literal.", 'a::before{content:"a;{b}"}')], (input) => formatSource(input, "css"));
add(["html-formatter"], [sample("Nested tags", "Markup is formatted without rendering or executing it.", '<section><h1>Hello</h1><p>你好 😀</p></section>'), sample("Attribute value", "An ampersand entity in an attribute remains part of the markup.", '<a href="/?a=1&amp;b=2">Open</a>')], (input) => formatSource(input, "html"));
add(["yaml-formatter"], [sample("Nested YAML", "Nested list indentation is preserved by the YAML parser.", 'root:\n  items:\n  - one\n  - two\n'), sample("Quoted value", "Quoted punctuation is treated as string content.", 'message: "a: b # text"\nenabled: true\n')], (input) => formatSource(input, "yaml"));
add(["markdown-formatter"], [sample("List formatting", "Markdown list indentation is normalized.", '# Title\n\n* one\n* two\n'), sample("Code fence", "Code fences remain part of the Markdown document.", 'Text with **bold**.\n\n```text\nhello 😀\n```\n')], (input) => formatSource(input, "markdown"));
add(["graphql-formatter"], [sample("Query fields", "The query is formatted without sending it to a GraphQL server.", '{user(id:1){name email}}'), sample("Named operation", "Variables and a named operation are preserved.", 'query GetUser($id:ID!){user(id:$id){name}}')], (input) => formatSource(input, "graphql"));
add(["base64-encode"], textSamples, encodeBase64Text);
add(["base64-decode"], textSamples.map((entry) => ({ ...entry, input: encodeBase64Text(entry.input) })), decodeBase64Text);
add(["base64-encode-and-decode"], [sample("Encode UTF-8", "Choose Encode to turn this text into Base64.", "你好 😀", "encode"), sample("Decode UTF-8", "Choose Decode to recover the original Unicode text.", encodeBase64Text("你好 😀"), "decode")], (input, mode) => mode === "decode" ? decodeBase64Text(input) : encodeBase64Text(input));
add(["base64-to-json"], jsonSamples.map((entry) => ({ ...entry, input: encodeBase64Text(entry.input) })), (input) => formatJson(decodeBase64Text(input)));
add(["url-encode"], [sample("Query value", "Encode a parameter value before placing it in a URL.", "hello world & 你好 😀"), sample("Reserved characters", "Reserved URL characters are percent-encoded.", "a=b?x#fragment")], encodeURIComponent);
add(["url-decode"], [sample("Unicode value", "Percent-encoded UTF-8 becomes readable text.", encodeURIComponent("hello world & 你好 😀")), sample("Reserved characters", "This decodes a single layer of percent encoding.", "a%3Db%3Fx%23fragment")], decodeUrlText);
add(["html-decode"], [sample("Named and numeric entities", "Named entities and decimal or hexadecimal character references are decoded.", "&copy; &#20013;&#25991; &#x1F600; &amp;"), sample("Decode once", "A doubly escaped ampersand is decoded once; markup remains text output.", "&amp;copy; &lt;script&gt; &NotEqualTilde;")], decodeHtmlEntities);
add(["json-to-csv"], [sample("Quoted values", "Commas, quotes and newlines are quoted correctly in CSV cells.", JSON.stringify([{ name: "Smith, Alice", note: 'She said "hi"\nagain' }])), sample("Spreadsheet formula protection", "Formula-like text is prefixed with an apostrophe for spreadsheet safety.", JSON.stringify([{ name: "=1+1", count: 2 }, { name: "李😀", count: 3 }]))], jsonToCsv);
add(["csv-to-json"], [sample("Quoted multiline cells", "Quoted commas, doubled quotes and line breaks stay within their original fields.", 'name,note\r\n"Smith, Alice","She said ""hi""\nagain"'), sample("Empty field and Unicode", "Empty cells remain empty strings; values are not silently coerced into numbers.", 'name,id,note\n李😀,001,')], csvToJson);
add(["json-to-xml"], [sample("Nested values", "Arrays become item elements under the containing key.", '{"user":{"name":"李"},"roles":["editor","reader"]}'), sample("Escaped text", "Markup punctuation in string values is escaped as XML text.", '{"message":"<b> & hello"}')], jsonToXml);
for (const [slug, language] of [["json-to-typescript", "typescript"], ["json-to-java", "java"], ["json-to-python", "python"]] as const) add([slug], [sample("Model fields", "Types are inferred from this sample only; the result is not a schema guarantee.", '{"name":"Alice","count":2,"active":true}'), sample("Containers and null", "Unknown container values and null receive general types.", '{"items":[],"meta":{},"optional":null}')], (input) => jsonToClass(input, language));
add(["binary-code-translator"], [sample("UTF-8 to bytes", "Each group is one UTF-8 byte, including the emoji's four bytes.", "Hi 😀"), sample("Bytes to Unicode", "Complete binary bytes are decoded as UTF-8.", textToBinary("中文😀"))], (input) => /^(?:[01]{8}\s*)+$/.test(input) ? binaryToText(input) : textToBinary(input));
for (const [slug, algorithm] of [["sha1-generator", "SHA-1"], ["sha256-generator", "SHA-256"], ["sha512-generator", "SHA-512"]] as const) add([slug], [sample("Standard abc vector", "Compare this digest with the standard abc test vector.", "abc"), sample("Unicode bytes", "The digest is calculated over the UTF-8 bytes of the exact input.", "你好 😀")], (input) => digestText(input, algorithm));
add(["comment-remover"], [sample("JavaScript literals", "Select JavaScript. Comment characters inside the URL and string are preserved; removed comments leave spaces.", 'const url = "https://example.com/*literal*/"; // comment\nconsole.log(url);', "JavaScript"), sample("TypeScript annotation", "Select TypeScript. The type annotation and line structure are retained.", 'const value: string = "/* literal */"; /* remove */\nexport { value };', "TypeScript")], (input, language) => removeJavaScriptComments(input, language ?? "JavaScript"));
add(["unix-to-date"], [sample("Unix epoch", "Integer seconds are converted to an ISO date in UTC.", "0"), sample("Before the epoch", "Negative seconds represent instants before 1970-01-01.", "-1")], unixSecondsToIso);
add(["date-to-unix"], [sample("Explicit UTC", "Use an ISO date with an explicit timezone for an unambiguous instant.", "2026-11-08T00:00:00Z"), sample("Timezone offset", "Equivalent timezone offsets map to the same Unix instant.", "2026-11-08T08:00:00+08:00")], dateToUnixSeconds);

export async function generateVerifiedExamples() {
  const results: Record<string, VerifiedExample[]> = {};
  for (const [slug, entry] of Object.entries(verifiedExampleCases)) {
    results[slug] = await Promise.all(entry.examples.map(async (example) => ({ ...example, output: await entry.run(example.input, example.mode) })));
  }
  return results;
}
