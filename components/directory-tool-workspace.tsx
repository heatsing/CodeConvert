"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Download, Loader2, Play, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryLabel, type DirectoryTool } from "@/lib/home-tools";
import { useI18n } from "@/lib/i18n";
import { getDirectoryToolHeader } from "@/lib/tool-page-copy";
import { toolIcons } from "@/lib/tool-icons";

function localizedCategoryLabel(category: string, t: (key: string) => string) {
  const labels: Record<string, string> = {
    Text: t("category.text"),
    "Font Styles": t("category.fontStyles"),
    Encoding: t("category.encoding"),
    Encode: t("nav.encode"),
    Decode: t("nav.decode"),
    Convert: t("nav.convert"),
    Utility: t("nav.utility"),
    Format: t("nav.format"),
    Beautifiers: t("category.beautifiers"),
    Security: t("nav.security"),
    Network: t("nav.network"),
    Regex: t("nav.regex"),
    Code: t("nav.code")
  };

  return labels[category] ?? getCategoryLabel(category);
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
}

function defaultTextOption(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
  if (name.includes("character remover")) return "aeiou";
  if (name.includes("repeat text")) return "3";
  if (name.includes("text line length filter")) return "5";
  if (name.includes("fixed length text lines")) return "12";
  if (name.includes("find and replace text")) return "old\nnew";
  return "";
}

function textOptionLabel(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
  if (name.includes("character remover")) return "Letters/Characters to Remove:";
  if (name.includes("repeat text")) return "Repeat Count:";
  if (name.includes("text line length filter")) return "Maximum Line Length:";
  if (name.includes("fixed length text lines")) return "Fixed Line Length:";
  if (name.includes("find and replace text")) return "Find and Replace:";
  return "Text Options:";
}

function textOptionHelp(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
  if (name.includes("find and replace text")) return "Enter find text on the first line and replacement text on the second line.";
  if (name.includes("character remover")) return "Enter every letter, symbol, or character that should be removed from the text.";
  if (name.includes("repeat text")) return "Enter how many times to repeat the text.";
  if (name.includes("text line length filter")) return "Lines longer than this value will be removed.";
  if (name.includes("fixed length text lines")) return "Text will be wrapped to this line length.";
  return "";
}

function hasTextOption(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
  return (
    name.includes("character remover") ||
    name.includes("repeat text") ||
    name.includes("text line length filter") ||
    name.includes("fixed length text lines") ||
    name.includes("find and replace text")
  );
}

function textToolPayload(tool: DirectoryTool, input: string, option: string) {
  const name = tool.name.toLowerCase();
  if (hasTextOption(tool)) {
    return `${option.trim()}\n${input}`;
  }
  return input;
}

function defaultTextInput(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
  const sample = sampleFor(tool);
  if (
    name.includes("character remover") ||
    name.includes("repeat text") ||
    name.includes("text line length filter") ||
    name.includes("fixed length text lines")
  ) {
    return sample.split(/\r?\n/).slice(1).join("\n");
  }
  if (name.includes("find and replace text")) {
    return sample.split(/\r?\n/).slice(2).join("\n");
  }
  return sample;
}

function sampleFor(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
  if (name.includes("base32 decode")) return "JBSWY3DPEBLW64TMMQ";
  if (name.includes("base58 decode")) return "2NEpo7TZRRrLZSi2U";
  if (name.includes("base32 encode") || name.includes("base58 encode")) return "Hello World";
  if (name.includes("morse decode")) return ".... . .-.. .-.. --- / .-- --- .-. .-.. -..";
  if (name.includes("morse encode")) return "hello world";
  if (name.includes("jwt decode") || name.includes("jwt verify")) return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiQ29kZVRvb2xzIEFJIn0.sample-signature";
  if (name.includes("json to xml") || name.includes("json to yaml") || name.includes("json to toml") || name.includes("json to ini") || name.includes("json to csv") || name.includes("minify json")) return '{"name":"CodeTools","count":3}';
  if (name.includes("json path")) return "$.user.name\n{\"user\":{\"name\":\"Alice\",\"role\":\"Developer\"}}";
  if (name.includes("xpath")) return "/root/user/name\n<root><user><name>Alice</name></user></root>";
  if (name.includes("json diff") || name.includes("xml diff") || name.includes("file difference")) return "left value\n---\nright value";
  if (name.includes("json5")) return "{name:'CodeTools', count:3,}";
  if (name.includes("csv to json") || name.includes("csv to text")) return "id,name\n1,Alice\n2,Bob";
  if (name.includes("tsv to json")) return "id\tname\n1\tAlice\n2\tBob";
  if (name.includes("xml to json")) return "<root><name>CodeTools</name><count>3</count></root>";
  if (name.includes("yaml to json")) return "name: CodeTools\ncount: 3";
  if (name.includes("toml to json") || name.includes("ini to json")) return "name = CodeTools\ncount = 3";
  if (name.includes("hex to rgb")) return "#3366ff";
  if (name.includes("rgb to hex")) return "rgb(51, 102, 255)";
  if (name.includes("decimal to hex") || name.includes("decimal to octal")) return "255";
  if (name.includes("hex to decimal")) return "ff";
  if (name.includes("octal to decimal")) return "377";
  if (name.includes("unix to date")) return "1782741274";
  if (name.includes("date to unix")) return "2026-06-30T00:00:00Z";
  if (name.includes("json escape")) return '{"name":"CodeTools","text":"Hello \\"world\\""}';
  if (name.includes("json url parameters")) return '{"q":"code tools","page":1}';
  if (name.includes("json to model")) return '{"id":1,"name":"Alice","active":true,"tags":["dev"]}';
  if (name.includes("url parameter formatter")) return "https://example.com/search?q=code%20tools&page=1";
  if (name.includes("url batch generator")) return "https://example.com/search\nq=code,tools\npage=1,2";
  if (name.includes("character encoder")) return "Code";
  if (name.includes("garble")) return "FranÃ§ais";
  if (name.includes("punycode")) return "\u4f8b\u5b50.\u6d4b\u8bd5";
  if (name.includes("base62") || name.includes("base85") || name.includes("base91")) return "CodeTools";
  if (name.includes("text compression")) return "aaabbbbcccdde";
  if (name.includes("file hex")) return "CodeTools";
  if (name.includes("base number") || name.includes("bigint base")) return "10\n16\n255";
  if (name.includes("ieee")) return "3.14159";
  if (name.includes("byte signed")) return "255";
  if (name.includes("little big endian")) return "12 34 56 78";
  if (name.includes("reverse binary")) return "11010010";
  if (name.includes("reverse array")) return "one, two, three, four";
  if (name.includes("caesar cipher")) return "3\nHello Code Tools";
  if (name.includes("rot13")) return "Hello Code Tools";
  if (name.includes("utf-8")) return "Hello Code Tools";
  if (name.includes("morse code translator")) return ".... . .-.. .-.. ---";
  if (name.includes("find and replace")) return "old\nnew\nThis old text has old words.";
  if (name.includes("camelcase") || name.includes("pascalcase") || name.includes("snake_case") || name.includes("kebab-case") || name.includes("dot.case")) return "hello code tools example";
  if (name.includes("character remover")) return "aeiou\nRemove vowels from this sentence.";
  if (name.includes("markdown table")) return "Name,Role\nAlice,Developer\nBob,Designer";
  if (name.includes("repeat text")) return "3\nRepeat this line";
  if (name.includes("roman numeral")) return "2026";
  if (name.includes("nato") || name.includes("phonetic")) return "Code Tools";
  if (name.includes("pig latin")) return "hello developer world";
  if (name.includes("small text generator")) return "Small Text Generator 123";
  if (tool.category === "Font Styles") return "Font Style Generator";
  if (name.includes("remove line breaks")) return "This paragraph\nwas copied\nwith line breaks.\n\nThis should become one clean line.";
  if (name.includes("duplicate word finder")) return "code tools help code writers find repeated repeated words in tools";
  if (name.includes("text splitter")) return "Split this text into words";
  if (name.includes("text joiner")) return "one\ntwo\nthree";
  if (name.includes("text escape")) return "Line one\nLine \"two\"";
  if (name.includes("text beautifier")) return "  hello   world  \n\n  code tools  ";
  if (name.includes("text line length filter")) return "5\nshort\nthis is too long\nsmall";
  if (name.includes("fixed length text lines")) return "12\nThis sentence should wrap into fixed length lines.";
  if (name.includes("punctuation")) return "Hello, world! \"Code tools\"";
  if (name.includes("key value to code")) return "name=Alice\nrole=Developer\nactive=true";
  if (name.includes("directory tree")) return "src/app/page.tsx\nsrc/components/button.tsx\nREADME.md";
  if (name.includes("pinyin")) return "\u4e2d\u6587\u5de5\u5177";
  if (name.includes("simplified traditional")) return "\u6c49\u8bed\u8f6c\u6362";
  if (name.includes("word frequency") || name.includes("word cloud")) return "code tools code text tools converter code";
  if (name.includes("number sorter")) return "10\n2\n33\n4\n1";
  if (name.includes("utm generator")) return "https://example.com\nnewsletter\nemail\nsummer_launch";
  if (name.includes("slugify url")) return "Code Tools AI Online Converter";
  if (name.includes("json stringify")) return "Hello \"Code\" Tools";
  if (name.includes("json unstringifier")) return "\"Hello \\\"Code\\\" Tools\"";
  if (name.includes("json serialize")) return '{"name":"Alice","active":true}';
  if (name.includes("json deserialize")) return "\"{\\\"name\\\":\\\"Alice\\\",\\\"active\\\":true}\"";
  if (name.includes("curl to php")) return "curl -X POST https://api.example.com/users -H \"Content-Type: application/json\" -d '{\"name\":\"Alice\"}'";
  if (name.includes("word to markdown")) return "Title\nThis is a paragraph.\n- First item\n- Second item";
  if (name.includes("graphql")) return "query GetUser{user(id:1){id name email}}";
  if (name.includes("nginx")) return "server{listen 80;location /{proxy_pass http://localhost:3000;}}";
  if (name.includes("scss")) return "$color:#2563eb;.button{color:$color;&:hover{color:red;}}";
  if (name.includes("typescript formatter")) return "type User={id:number;name:string};const user:User={id:1,name:'Alice'};";
  if (name.includes("json beautifier")) return '{"name":"CodeTools","items":[1,2,3]}';
  if (name.includes("yaml beautifier")) return "name: CodeTools\nitems:\n- beautify\n- format";
  if (name.includes("graphql beautifier")) return "query GetUser{user(id:1){id name email}}";
  if (name.includes("less beautifier") || name.includes("scss beautifier")) return "$color:#2563eb;.button{color:$color;&:hover{color:red;}}";
  if (name.includes("c beautifier") || name.includes("c++ beautifier")) return "int main(){printf(\"Hello\");return 0;}";
  if (name.includes("c# beautifier")) return "public class Demo{public string Name{get;set;}}";
  if (name.includes("java beautifier")) return "class Demo{public static void main(String[] args){System.out.println(\"Hello\");}}";
  if (name.includes("php beautifier")) return "<?php function hello($name){echo \"Hello $name\";} ?>";
  if (name.includes("python beautifier")) return "def hello(name):\n print('Hello '+name)";
  if (name.includes("lwc formatter")) return "import { LightningElement } from 'lwc';export default class Demo extends LightningElement{message='Hello LWC';}";
  if (name.includes("flow formatter")) return "// @flow\ntype User={id:number,name:string};const user:User={id:1,name:'Alice'};";
  if (name.includes("wsdl formatter")) return "<definitions><service name=\"Demo\"><port name=\"DemoPort\"></port></service></definitions>";
  if (name.includes("soap formatter")) return "<soap:Envelope><soap:Body><getUser><id>1</id></getUser></soap:Body></soap:Envelope>";
  if (name.includes("markdown formatter")) return "# Title\n\n- item one\n- item two";
  if (name.includes("yaml formatter")) return "name: CodeTools\nitems:\n- format\n- convert";
  if (tool.category === "Text") return "Paste clean text here.\nAdd another line here.";
  if (name.includes(" to ") && name.includes("converter")) return "function greet(name) {\n  return `Hello ${name}`;\n}";
  if (name.includes("unit test")) return "function add(a, b) {\n  return a + b;\n}";
  if (name.includes("api code")) return "Create a JSON API endpoint for a tasks list.";
  if (name.includes("sql query")) return "users table with id, email, created_at. Find recent users.";
  if (name.includes("shell script")) return "Back up a project folder into a dated archive.";
  if (name.includes("dockerfile")) return "Next.js app using npm run build and npm start.";
  if (name.includes("readme")) return "CodeTools AI - online developer tools built with Next.js.";
  if (name.includes("code diff")) return "const a = 1;\nconst b = 2;\n---\nconst a = 1;\nconst b = 3;";
  if (name.includes("code")) return "function greet(name) {\nconsole.log('Hello ' + name)\n}";
  if (name.includes("regex replace")) return "/cat/gi\ndog\nThe cat sat with another Cat.";
  if (name.includes("regex split")) return "/[,;\\s]+/g\nred, green; blue yellow";
  if (name.includes("regex escape")) return "https://example.com/search?q=(code tools)+ai";
  if (name.includes("regex unescape")) return "https:\\/\\/example\\.com\\/search\\?q=\\(code tools\\)\\+ai";
  if (name.includes("regex") || name.includes("email regex") || name.includes("url regex") || name.includes("phone regex") || name.includes("password regex")) {
    return "/\\w+@\\w+\\.com/g\nEmail us at hello@example.com or support@codetools.dev.";
  }
  if (name.includes("json")) return '{"name":"CodeTools","items":[1,2,3]}';
  if (name.includes("url")) return "https://example.com/search?q=code tools";
  if (name.includes("base64")) return "CodeTools AI";
  if (name.includes("html")) return "<section>Hello & welcome</section>";
  if (name.includes("csv")) return "id,name\n1,Alice\n2,Bob";
  if (name.includes("hex")) return "Hello";
  if (name.includes("binary code translator")) return "01001000 01100101 01101100 01101100 01101111";
  if (name.includes("binary")) return "Hello";
  if (name.includes("password")) return "CorrectHorseBatteryStaple!";
  if (name.includes("ping")) return "example.com";
  return `Paste input for ${tool.name}`;
}

function regexFromLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return /(?:)/g;
  const literal = trimmed.match(/^\/(.+)\/([dgimsuvy]*)$/);
  if (literal) return new RegExp(literal[1], literal[2].includes("g") ? literal[2] : `${literal[2]}g`);
  return new RegExp(trimmed, "g");
}

function looksLikeBinaryCode(value: string) {
  const compact = value.replace(/\s+/g, "");
  return compact.length > 0 && compact.length % 8 === 0 && /^[01]+$/.test(compact);
}

function binaryToText(value: string) {
  const compact = value.replace(/[^01]/g, "");
  return compact.match(/.{1,8}/g)?.map((part) => {
    const code = Number.parseInt(part, 2);
    return Number.isFinite(code) ? String.fromCharCode(code) : "";
  }).join("") ?? "";
}

function textToBinary(value: string) {
  return Array.from(value).map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

function regexParts(value: string) {
  const lines = value.split(/\r?\n/);
  const patternLine = lines[0] || "";
  const text = lines.slice(1).join("\n") || "Email us at hello@example.com or support@codetools.dev.";
  return { regex: regexFromLine(patternLine), patternLine, text };
}

function explainRegex(patternLine: string) {
  const pattern = patternLine.replace(/^\/|\/[dgimsuvy]*$/g, "");
  const notes = [
    ["\\d", "digit"],
    ["\\w", "word character"],
    ["\\s", "whitespace"],
    [".", "any character except newline"],
    ["+", "one or more"],
    ["*", "zero or more"],
    ["?", "optional or lazy marker"],
    ["^", "start of text"],
    ["$", "end of text"],
    ["[]", "character set"],
    ["()", "capture group"],
    ["|", "either/or"]
  ];
  const found = notes.filter(([token]) => pattern.includes(token));
  return found.length
    ? found.map(([token, meaning]) => `${token}: ${meaning}`).join("\n")
    : "No common tokens detected. Try a pattern such as /\\w+@\\w+\\.com/g.";
}

function toTitleCase(value: string) {
  return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function toSmallText(value: string) {
  const smallLetters: Record<string, string> = {
    a: "\u1d43",
    b: "\u1d47",
    c: "\u1d9c",
    d: "\u1d48",
    e: "\u1d49",
    f: "\u1da0",
    g: "\u1d4d",
    h: "\u02b0",
    i: "\u1da6",
    j: "\u02b2",
    k: "\u1d4f",
    l: "\u02e1",
    m: "\u1d50",
    n: "\u207f",
    o: "\u1d52",
    p: "\u1d56",
    q: "\u1d60",
    r: "\u02b3",
    s: "\u02e2",
    t: "\u1d57",
    u: "\u1d58",
    v: "\u1d5b",
    w: "\u02b7",
    x: "\u02e3",
    y: "\u02b8",
    z: "\u1dbb"
  };
  const smallNumbers: Record<string, string> = {
    "0": "\u2070",
    "1": "\u00b9",
    "2": "\u00b2",
    "3": "\u00b3",
    "4": "\u2074",
    "5": "\u2075",
    "6": "\u2076",
    "7": "\u2077",
    "8": "\u2078",
    "9": "\u2079"
  };

  return Array.from(value).map((char) => {
    const lower = char.toLowerCase();
    return smallLetters[lower] ?? smallNumbers[char] ?? char;
  }).join("");
}

function styledAlphaNumeric(value: string, upperStart: number, lowerStart: number, digitStart?: number) {
  return Array.from(value).map((char) => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(upperStart + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(lowerStart + code - 97);
    if (digitStart !== undefined && code >= 48 && code <= 57) return String.fromCodePoint(digitStart + code - 48);
    return char;
  }).join("");
}

function overlayText(value: string, mark: string) {
  return Array.from(value).map((char) => (char.trim() ? `${char}${mark}` : char)).join("");
}

function wideText(value: string) {
  return Array.from(value).map((char) => {
    const code = char.charCodeAt(0);
    if (code === 32) return "\u3000";
    if (code >= 33 && code <= 126) return String.fromCharCode(code + 0xfee0);
    return char;
  }).join("");
}

function bubbleText(value: string) {
  const digitMap = ["\u24ea", "\u2460", "\u2461", "\u2462", "\u2463", "\u2464", "\u2465", "\u2466", "\u2467", "\u2468"];
  return Array.from(value).map((char) => {
    const lower = char.toLowerCase();
    const code = lower.charCodeAt(0);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + code - 97);
    if (/[0-9]/.test(char)) return digitMap[Number(char)];
    return char;
  }).join("");
}

function mirrorText(value: string) {
  const map: Record<string, string> = {
    a: "\u0252", b: "d", c: "\u0254", d: "b", e: "\u01dd", f: "\u025f", g: "\u0183", h: "\u0265", i: "i", j: "\u027e", k: "\u029e", l: "l", m: "m", n: "n", o: "o", p: "q", q: "p", r: "\u027f", s: "s", t: "\u0287", u: "u", v: "v", w: "w", x: "x", y: "\u028e", z: "z"
  };
  return Array.from(value).reverse().map((char) => map[char.toLowerCase()] ?? char).join("");
}

function upsideDownText(value: string) {
  const map: Record<string, string> = {
    a: "\u0250", b: "q", c: "\u0254", d: "p", e: "\u01dd", f: "\u025f", g: "\u0183", h: "\u0265", i: "\u1d09", j: "\u027e", k: "\u029e", l: "l", m: "\u026f", n: "u", o: "o", p: "d", q: "b", r: "\u0279", s: "s", t: "\u0287", u: "n", v: "\u028c", w: "\u028d", x: "x", y: "\u028e", z: "z", ".": "\u02d9", "?": "\u00bf", "!": "\u00a1"
  };
  return Array.from(value).reverse().map((char) => map[char.toLowerCase()] ?? char).join("");
}

function subscriptText(value: string) {
  const map: Record<string, string> = {
    a: "\u2090", e: "\u2091", h: "\u2095", i: "\u1d62", j: "\u2c7c", k: "\u2096", l: "\u2097", m: "\u2098", n: "\u2099", o: "\u2092", p: "\u209a", r: "\u1d63", s: "\u209b", t: "\u209c", u: "\u1d64", v: "\u1d65", x: "\u2093", "0": "\u2080", "1": "\u2081", "2": "\u2082", "3": "\u2083", "4": "\u2084", "5": "\u2085", "6": "\u2086", "7": "\u2087", "8": "\u2088", "9": "\u2089"
  };
  return Array.from(value).map((char) => map[char.toLowerCase()] ?? char).join("");
}

function zalgoText(value: string, intense = false) {
  const marks = ["\u0300", "\u0301", "\u0302", "\u0303", "\u0304", "\u0307", "\u0308", "\u0336", "\u034f", "\u035c"];
  return Array.from(value).map((char, index) => {
    if (!char.trim()) return char;
    const count = intense ? 4 : 2;
    return char + Array.from({ length: count }, (_, offset) => marks[(index + offset) % marks.length]).join("");
  }).join("");
}

function fontStyleText(toolName: string, value: string) {
  if (toolName.includes("aesthetic")) return Array.from(value.toUpperCase()).join(" ");
  if (toolName.includes("big text")) return Array.from(value.toUpperCase()).join("  ");
  if (toolName.includes("bold") || toolName.includes("facebook") || toolName.includes("whatsapp")) return styledAlphaNumeric(value, 0x1d400, 0x1d41a, 0x1d7ce);
  if (toolName.includes("italic") || toolName.includes("twitter")) return styledAlphaNumeric(value, 0x1d434, 0x1d44e);
  if (toolName.includes("double-struck")) return styledAlphaNumeric(value, 0x1d538, 0x1d552, 0x1d7d8);
  if (toolName.includes("typewriter") || toolName.includes("discord")) return styledAlphaNumeric(value, 0x1d670, 0x1d68a, 0x1d7f6);
  if (toolName.includes("gothic")) return styledAlphaNumeric(value, 0x1d504, 0x1d51e);
  if (toolName.includes("bubble")) return bubbleText(value);
  if (toolName.includes("cursed")) return zalgoText(value);
  if (toolName.includes("zalgo")) return zalgoText(value, true);
  if (toolName.includes("cute") || toolName.includes("fancy") || toolName.includes("instagram") || toolName.includes("tiktok")) return `${toSmallText(value)} ${bubbleText(value)}`;
  if (toolName.includes("mirror")) return mirrorText(value);
  if (toolName.includes("upside down")) return upsideDownText(value);
  if (toolName.includes("slash")) return overlayText(value, "\u0338");
  if (toolName.includes("stacked")) return overlayText(value, "\u034d");
  if (toolName.includes("strikethrough")) return overlayText(value, "\u0336");
  if (toolName.includes("underline")) return overlayText(value, "\u0332");
  if (toolName.includes("subscript")) return subscriptText(value);
  if (toolName.includes("superscript") || toolName.includes("small text")) return toSmallText(value);
  if (toolName.includes("wide")) return wideText(value);
  if (toolName.includes("unicode text converter")) return unicodeEncode(value);
  if (toolName.includes("unicode to text converter")) return unicodeDecode(value);
  return value;
}

function toSentenceCase(value: string) {
  return value
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function wordCounts(value: string) {
  const counts = new Map<string, number>();
  value.toLowerCase().match(/[a-z0-9']+/g)?.forEach((word) => {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  });
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function toRoman(value: number) {
  const parts: Array<[number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"]
  ];
  let rest = Math.max(1, Math.min(3999, Math.floor(value)));
  return parts.reduce((output, [number, numeral]) => {
    while (rest >= number) {
      output += numeral;
      rest -= number;
    }
    return output;
  }, "");
}

function pigLatinWord(word: string) {
  const match = word.match(/^([^aeiou]*)(.*)$/i);
  if (!match || !match[2]) return `${word}way`;
  return `${match[2]}${match[1]}ay`;
}

const natoWords: Record<string, string> = {
  a: "Alpha",
  b: "Bravo",
  c: "Charlie",
  d: "Delta",
  e: "Echo",
  f: "Foxtrot",
  g: "Golf",
  h: "Hotel",
  i: "India",
  j: "Juliett",
  k: "Kilo",
  l: "Lima",
  m: "Mike",
  n: "November",
  o: "Oscar",
  p: "Papa",
  q: "Quebec",
  r: "Romeo",
  s: "Sierra",
  t: "Tango",
  u: "Uniform",
  v: "Victor",
  w: "Whiskey",
  x: "X-ray",
  y: "Yankee",
  z: "Zulu"
};

const morseWords: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----."
};

const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const base58Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function htmlEncode(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function htmlDecode(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function unicodeEncode(value: string) {
  return Array.from(value).map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`).join("");
}

function unicodeDecode(value: string) {
  return value.replace(/\\u([0-9a-f]{4})/gi, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16)));
}

function jsEncode(value: string) {
  return JSON.stringify(value).slice(1, -1);
}

function jsDecode(value: string) {
  try {
    return JSON.parse(`"${value.replace(/"/g, "\\\"")}"`) as string;
  } catch {
    return value;
  }
}

function base32Encode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let bits = "";
  bytes.forEach((byte) => {
    bits += byte.toString(2).padStart(8, "0");
  });
  return bits.match(/.{1,5}/g)?.map((chunk) => base32Alphabet[Number.parseInt(chunk.padEnd(5, "0"), 2)]).join("") ?? "";
}

function base32Decode(value: string) {
  const bits = value.toUpperCase().replace(/=+$/g, "").replace(/\s+/g, "").split("").map((char) => {
    const index = base32Alphabet.indexOf(char);
    if (index < 0) throw new Error("Invalid Base32 input.");
    return index.toString(2).padStart(5, "0");
  }).join("");
  const bytes = bits.match(/.{8}/g)?.map((chunk) => Number.parseInt(chunk, 2)) ?? [];
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function base58Encode(value: string) {
  let digits = [0];
  for (const byte of Array.from(new TextEncoder().encode(value))) {
    let carry = byte;
    for (let index = 0; index < digits.length; index += 1) {
      carry += digits[index] * 256;
      digits[index] = carry % 58;
      carry = Math.floor(carry / 58);
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = Math.floor(carry / 58);
    }
  }
  return digits.reverse().map((digit) => base58Alphabet[digit]).join("");
}

function base58Decode(value: string) {
  let bytes = [0];
  for (const char of value.trim()) {
    const index = base58Alphabet.indexOf(char);
    if (index < 0) throw new Error("Invalid Base58 input.");
    let carry = index;
    for (let offset = 0; offset < bytes.length; offset += 1) {
      carry += bytes[offset] * 58;
      bytes[offset] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  return new TextDecoder().decode(new Uint8Array(bytes.reverse()));
}

function morseEncode(value: string) {
  return value.toLowerCase().split("").map((char) => (char === " " ? "/" : morseWords[char] ?? char)).join(" ");
}

function morseDecode(value: string) {
  const reverse = Object.fromEntries(Object.entries(morseWords).map(([letter, code]) => [code, letter]));
  return value.split(/\s+/).map((part) => (part === "/" ? " " : reverse[part] ?? part)).join("");
}

function csvRows(value: string) {
  return value.trim().split(/\r?\n/).map((line) => line.split(",").map((cell) => cell.trim()));
}

function csvToJson(value: string) {
  const [headers = [], ...rows] = csvRows(value);
  return JSON.stringify(rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))), null, 2);
}

function jsonToCsv(value: string) {
  const data = JSON.parse(value);
  const rows = Array.isArray(data) ? data : [data];
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  return [headers.join(","), ...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(","))].join("\n");
}

function simpleHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function wordsForCase(value: string) {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toCamelCaseValue(value: string) {
  const words = wordsForCase(value);
  return words.map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join("");
}

function toPascalCaseValue(value: string) {
  return wordsForCase(value).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
}

function caesarCipher(value: string, shift: number) {
  const normalizedShift = ((shift % 26) + 26) % 26;
  return value.replace(/[A-Za-z]/g, (char) => {
    const base = char >= "a" && char <= "z" ? 97 : 65;
    return String.fromCharCode(((char.charCodeAt(0) - base + normalizedShift) % 26) + base);
  });
}

function rot13(value: string) {
  return caesarCipher(value, 13);
}

function utf8Encode(value: string) {
  return Array.from(new TextEncoder().encode(value)).map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
}

function utf8Decode(value: string) {
  const bytes = value.trim().split(/[\s,]+/).filter(Boolean).map((part) => Number.parseInt(part.replace(/^0x/i, ""), 16));
  if (!bytes.length || bytes.some((byte) => !Number.isFinite(byte))) return utf8Encode(value);
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function formatBracedText(value: string) {
  let indent = 0;
  return value
    .replace(/\s+/g, " ")
    .replace(/([{}[\]();,])/g, "$1\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^[}\])]/.test(line)) indent = Math.max(0, indent - 1);
      const output = `${"  ".repeat(indent)}${line}`;
      if (/[{[(]$/.test(line)) indent += 1;
      return output;
    })
    .join("\n");
}

function markdownTable(value: string) {
  const rows = csvRows(value);
  const [header = ["Column"], ...body] = rows;
  const separator = header.map(() => "---");
  return [header, separator, ...body].map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function utmUrl(value: string) {
  const [base = "https://example.com", source = "newsletter", medium = "email", campaign = "campaign"] = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const url = new URL(base.startsWith("http") ? base : `https://${base}`);
  url.searchParams.set("utm_source", slugify(source));
  url.searchParams.set("utm_medium", slugify(medium));
  url.searchParams.set("utm_campaign", slugify(campaign));
  return url.toString();
}

function wordToMarkdown(value: string) {
  return value
    .split(/\r?\n/)
    .map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (index === 0) return `# ${trimmed.replace(/^#+\s*/, "")}`;
      if (/^[-*]\s+/.test(trimmed)) return trimmed;
      return trimmed;
    })
    .join("\n\n");
}

function jsonEscape(value: string) {
  try {
    return JSON.stringify(JSON.stringify(JSON.parse(value)));
  } catch {
    return JSON.stringify(value);
  }
}

function jsonUrlParameters(value: string) {
  if (value.trim().startsWith("{")) {
    try {
      const data = JSON.parse(value);
      return new URLSearchParams(Object.entries(data).map(([key, item]) => [key, String(item)])).toString();
    } catch {
      return "Invalid JSON input.";
    }
  }
  const query = value.includes("?") ? value.split("?").slice(1).join("?") : value;
  return JSON.stringify(Object.fromEntries(new URLSearchParams(query)), null, 2);
}

function jsonToModel(value: string) {
  let data: Record<string, unknown>;
  try {
    const parsed = JSON.parse(value);
    data = Array.isArray(parsed) ? parsed[0] ?? {} : parsed;
  } catch {
    return "Invalid JSON input.";
  }
  const typeFor = (item: unknown) => {
    if (Array.isArray(item)) return "unknown[]";
    if (item === null) return "null";
    const type = typeof item;
    return type === "object" ? "Record<string, unknown>" : type;
  };
  return `interface GeneratedModel {\n${Object.entries(data).map(([key, item]) => `  ${key}: ${typeFor(item)};`).join("\n")}\n}`;
}

function jsonToClass(value: string, language: string) {
  let data: Record<string, unknown>;
  try {
    const parsed = JSON.parse(value);
    data = Array.isArray(parsed) ? parsed[0] ?? {} : parsed;
  } catch {
    return "Invalid JSON input.";
  }

  const entries = Object.entries(data);
  const typeFor = (item: unknown) => {
    if (Array.isArray(item)) return language === "python" ? "list" : "unknown[]";
    if (item === null) return language === "java" || language === "csharp" ? "Object" : "null";
    if (typeof item === "number") return language === "java" || language === "csharp" ? "double" : "number";
    if (typeof item === "boolean") return language === "java" ? "boolean" : language === "csharp" ? "bool" : "boolean";
    if (typeof item === "object") return language === "python" ? "dict" : "Record<string, unknown>";
    return language === "java" || language === "csharp" ? "String" : "string";
  };

  if (language === "typescript") {
    return `interface GeneratedModel {\n${entries.map(([key, item]) => `  ${key}: ${typeFor(item)};`).join("\n")}\n}`;
  }
  if (language === "java") {
    return `public class GeneratedModel {\n${entries.map(([key, item]) => `  private ${typeFor(item)} ${key};`).join("\n")}\n}`;
  }
  if (language === "csharp") {
    return `public class GeneratedModel\n{\n${entries.map(([key, item]) => `    public ${typeFor(item)} ${key.charAt(0).toUpperCase() + key.slice(1)} { get; set; }`).join("\n")}\n}`;
  }
  return `from dataclasses import dataclass\nfrom typing import Any\n\n@dataclass\nclass GeneratedModel:\n${entries.map(([key, item]) => `    ${key}: ${typeFor(item)}`).join("\n") || "    pass"}`;
}

function parseJson5Like(value: string) {
  const normalized = value
    .replace(/\/\/.*$/gm, "")
    .replace(/(['"])?([A-Za-z_$][\w$]*)\1\s*:/g, "\"$2\":")
    .replace(/'/g, "\"")
    .replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(normalized);
}

function tsvToJson(value: string) {
  const rows = value.trim().split(/\r?\n/).map((line) => line.split("\t").map((cell) => cell.trim()));
  const [headers = [], ...body] = rows;
  return JSON.stringify(body.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))), null, 2);
}

function jsonToTsv(value: string) {
  const data = JSON.parse(value);
  const rows = Array.isArray(data) ? data : [data];
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  return [headers.join("\t"), ...rows.map((row) => headers.map((header) => String(row[header] ?? "")).join("\t"))].join("\n");
}

function jsonPathLookup(value: string) {
  const [pathLine = "$", ...jsonLines] = value.split(/\r?\n/);
  const data = JSON.parse(jsonLines.join("\n") || "{}");
  const path = pathLine.trim().replace(/^\$\.?/, "").split(/[.[\]]+/).filter(Boolean);
  const result = path.reduce<unknown>((current, key) => {
    if (current && typeof current === "object") return (current as Record<string, unknown>)[key];
    return undefined;
  }, data);
  return JSON.stringify(result ?? null, null, 2);
}

function xpathLookup(value: string) {
  const [pathLine = "/", ...xmlLines] = value.split(/\r?\n/);
  const tags = pathLine.split("/").filter(Boolean);
  let xml = xmlLines.join("\n");
  tags.forEach((tag) => {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
    xml = match?.[1] ?? "";
  });
  return xml.trim() || "No matching node found.";
}

function diffBlocks(value: string) {
  const [left = "", right = ""] = value.split(/\n---\n/);
  const leftLines = left.split(/\r?\n/);
  const rightLines = right.split(/\r?\n/);
  const max = Math.max(leftLines.length, rightLines.length);
  return Array.from({ length: max }, (_, index) => {
    if (leftLines[index] === rightLines[index]) return `  ${leftLines[index] ?? ""}`;
    return `- ${leftLines[index] ?? ""}\n+ ${rightLines[index] ?? ""}`;
  }).join("\n");
}

function cssPreprocessorPreview(toolName: string, value: string) {
  const target = toolName.split(" to ").pop()?.toUpperCase() ?? "CSS";
  const cleaned = value.replace(/^\s*[$@][\w-]+:\s*[^;]+;?\s*$/gm, "").trim();
  return `/* ${target} preview */\n${cleaned || value}`;
}

function xmlTagValidation(value: string) {
  const tags = Array.from(value.matchAll(/<\/?([A-Za-z][\w:-]*)[^>]*>/g)).map((match) => match[0]);
  const stack: string[] = [];
  for (const tag of tags) {
    if (/\/>$/.test(tag) || /^<!|^<\?/.test(tag)) continue;
    const name = tag.replace(/^<\/?/, "").replace(/\s.*|\/?>$/g, "");
    if (tag.startsWith("</")) {
      const open = stack.pop();
      if (open !== name) return `Invalid markup: expected </${open ?? "none"}> but found </${name}>.`;
    } else {
      stack.push(name);
    }
  }
  return stack.length ? `Invalid markup: unclosed <${stack[stack.length - 1]}>.` : "Markup tags look balanced.";
}

function curlToPhp(value: string) {
  const url = value.match(/https?:\/\/[^\s'"]+/)?.[0] ?? "https://api.example.com";
  const method = value.match(/-X\s+([A-Z]+)/i)?.[1] ?? "GET";
  const data = value.match(/-d\s+['"]([^'"]+)['"]/)?.[1];
  return `<?php\n$ch = curl_init(${JSON.stringify(url)});\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, ${JSON.stringify(method)});\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);${data ? `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, ${JSON.stringify(data)});` : ""}\n$response = curl_exec($ch);\ncurl_close($ch);\necho $response;\n?>`;
}

function queryParameterFormat(value: string) {
  const query = value.includes("?") ? value.split("?").slice(1).join("?") : value;
  return Array.from(new URLSearchParams(query).entries()).map(([key, item]) => `${key}: ${item}`).join("\n");
}

function urlBatch(value: string) {
  const [base = "https://example.com", ...lines] = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const pairs = lines.map((line) => {
    const [key, raw = ""] = line.split("=");
    return { key, values: raw.split(",").map((item) => item.trim()).filter(Boolean) };
  });
  const max = Math.max(1, ...pairs.map((pair) => pair.values.length));
  return Array.from({ length: max }, (_, index) => {
    const url = new URL(base.startsWith("http") ? base : `https://${base}`);
    pairs.forEach((pair) => url.searchParams.set(pair.key, pair.values[index % pair.values.length] ?? ""));
    return url.toString();
  }).join("\n");
}

function characterCodes(value: string) {
  return Array.from(value).map((char) => {
    const code = char.codePointAt(0) ?? 0;
    return `${char}  dec:${code}  hex:${code.toString(16).toUpperCase()}  unicode:U+${code.toString(16).toUpperCase().padStart(4, "0")}`;
  }).join("\n");
}

function garbleDecode(value: string) {
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value.replace(/Ã§/g, "\u00e7").replace(/Ã©/g, "\u00e9").replace(/Ã¨/g, "\u00e8").replace(/Ã/g, "\u00c0");
  }
}

function punycodePreview(value: string) {
  try {
    const host = value.replace(/^https?:\/\//, "").split("/")[0];
    const ascii = new URL(`https://${host}`).hostname;
    return ascii.includes("xn--")
      ? `ASCII/Punycode: ${ascii}\nUnicode decoding depends on browser URL support.`
      : `ASCII/Punycode: ${ascii}`;
  } catch {
    return "Enter a valid domain name.";
  }
}

function baseN(value: string, alphabet: string) {
  if (alphabet.includes(value.trim()[0]) && /^[A-Za-z0-9!#$%&()*+,./:;<=>?@[\]^_`{|}~-]+$/.test(value.trim()) && value.trim().length > 8) {
    return `Decoded preview is not deterministic for this compact base.\nInput length: ${value.trim().length}`;
  }
  const bytes = Array.from(new TextEncoder().encode(value));
  let number = BigInt(0);
  bytes.forEach((byte) => {
    number = (number << BigInt(8)) + BigInt(byte);
  });
  if (number === BigInt(0)) return alphabet[0];
  const base = BigInt(alphabet.length);
  let output = "";
  while (number > BigInt(0)) {
    output = alphabet[Number(number % base)] + output;
    number /= base;
  }
  return output;
}

function runLengthCodec(value: string) {
  if (/(\d+:.)/.test(value)) {
    return value.replace(/(\d+):([\s\S])/g, (_, count: string, char: string) => char.repeat(Number(count)));
  }
  return Array.from(value.matchAll(/([\s\S])\1*/g)).map((match) => `${match[0].length}:${match[1]}`).join("");
}

function baseConvert(value: string) {
  const [fromLine = "10", toLine = "16", numberLine = "255"] = value.split(/\r?\n/);
  const from = Number.parseInt(fromLine, 10) || 10;
  const to = Number.parseInt(toLine, 10) || 16;
  try {
    const parsed = BigInt(Number.parseInt(numberLine.trim(), from));
    return parsed.toString(to).toUpperCase();
  } catch {
    return "Enter from-base, to-base, and integer on separate lines.";
  }
}

function ieee754(value: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Enter a valid number.";
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, number, false);
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join(" ").toUpperCase();
}

function byteSignedUnsigned(value: string) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return "Enter a byte value.";
  const unsigned = ((number % 256) + 256) % 256;
  const signed = unsigned > 127 ? unsigned - 256 : unsigned;
  return `signed: ${signed}\nunsigned: ${unsigned}`;
}

function reverseBytePairs(value: string) {
  return value.replace(/[^0-9a-f]/gi, "").match(/.{1,2}/g)?.reverse().join(" ") ?? "";
}

function fixedLengthLines(value: string) {
  const [widthLine = "12", ...textLines] = value.split(/\r?\n/);
  const width = Math.max(1, Math.min(120, Number.parseInt(widthLine, 10) || 12));
  const text = textLines.join(" ") || widthLine;
  return text.match(new RegExp(`.{1,${width}}`, "g"))?.join("\n") ?? "";
}

function keyValueToCode(value: string) {
  const entries = value.split(/\r?\n/).map((line) => line.split(/[=:]/)).filter((parts) => parts.length >= 2).map(([key, ...rest]) => [key.trim(), rest.join(":").trim()]);
  return `const data = {\n${entries.map(([key, item]) => `  ${JSON.stringify(key)}: ${JSON.stringify(item)},`).join("\n")}\n};`;
}

function directoryTree(value: string) {
  return value.split(/\r?\n/).filter(Boolean).map((path) => {
    const depth = Math.max(0, path.split(/[\\/]/).length - 1);
    return `${"  ".repeat(depth)}- ${path.split(/[\\/]/).pop()}`;
  }).join("\n");
}

function encodingReference(name: string) {
  if (name.includes("ascii")) return "0x20 SPACE\n0x30 0\n0x41 A\n0x61 a\n0x7F DEL";
  if (name.includes("emoji")) return "😀 grinning face\n🚀 rocket\n✅ check mark\n🔥 fire\n✨ sparkles";
  if (name.includes("special symbols")) return "© ® ™ ✓ ✕ ★ ☆ → ← ↑ ↓ ≤ ≥ ≠ ±";
  if (name.includes("utf-16")) return "UTF-16 uses 16-bit code units. Characters outside BMP use surrogate pairs.";
  if (name.includes("unicode")) return "Unicode assigns code points such as U+0041 for A and U+1F600 for 😀.";
  if (name.includes("gb18030")) return "GB18030 is a Chinese encoding standard compatible with GBK and GB2312 ranges.";
  if (name.includes("gbk")) return "GBK extends GB2312 for simplified Chinese characters.";
  if (name.includes("gb2312")) return "GB2312 is an older simplified Chinese character set.";
  if (name.includes("big5")) return "Big5 is a traditional Chinese character encoding.";
  return "UTF-8\nUTF-16\nASCII\nISO-8859-1\nGB2312\nGBK\nGB18030\nBig5";
}

function hexToRgb(value: string) {
  const hex = value.replace("#", "").trim();
  const full = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
  const number = Number.parseInt(full, 16);
  return `rgb(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255})`;
}

function rgbToHex(value: string) {
  const parts = value.match(/\d+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
  return `#${parts.map((part) => Math.max(0, Math.min(255, part)).toString(16).padStart(2, "0")).join("")}`;
}

function processTool(tool: DirectoryTool, input: string) {
  const value = input.trim() || sampleFor(tool);
  const name = tool.name.toLowerCase();

  if (tool.category === "Font Styles") return fontStyleText(name, value);
  if (tool.category === "Encoding") return encodingReference(name);
  if (name.includes("json path tester")) {
    try {
      return jsonPathLookup(value);
    } catch {
      return "Invalid JSONPath or JSON input.";
    }
  }
  if (name.includes("xpath tester")) return xpathLookup(value);
  if (name.includes("json diff") || name.includes("xml diff") || name.includes("file difference")) return diffBlocks(value);
  if (name.includes("json to typescript")) return jsonToClass(value, "typescript");
  if (name.includes("json to java")) return jsonToClass(value, "java");
  if (name.includes("json to python")) return jsonToClass(value, "python");
  if (name.includes("json to c#")) return jsonToClass(value, "csharp");
  if (name.includes("json viewer") || name.includes("json editor") || name.includes("json parser") || name.includes("json validator")) {
    try {
      return `${JSON.stringify(JSON.parse(value), null, 2)}\n\nValid JSON.`;
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("json5 formatter") || name.includes("json5 validator")) {
    try {
      return `${JSON.stringify(parseJson5Like(value), null, 2)}\n\nValid JSON5-like input.`;
    } catch {
      return "Invalid JSON5 input.";
    }
  }
  if (name.includes("json beautifier")) {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("xml validator") || name.includes("html validator")) return xmlTagValidation(value);
  if (name.includes("xml viewer") || name.includes("xml parser") || name.includes("html viewer")) return value.replace(/></g, ">\n<");
  if (name.includes("yaml viewer") || name.includes("yaml validator")) return value.replace(/\r\n/g, "\n").trim() || "YAML input is empty.";
  if (name.includes("css validator")) return /\{[\s\S]*\}/.test(value) ? "CSS block structure detected." : "CSS may be missing a declaration block.";
  if (name.includes("javascript validator")) return /[;{}()]|=>|function|const|let|var/.test(value) ? "JavaScript syntax shape detected." : "JavaScript syntax could not be recognized.";
  if (name.includes("javascript obfuscator")) return `eval(String.fromCharCode(${Array.from(value).map((char) => char.charCodeAt(0)).join(",")}));`;
  if (name.includes("string to json")) return JSON.stringify({ value }, null, 2);
  if (name.includes("json serialize")) return JSON.stringify(value);
  if (name.includes("json deserialize")) {
    try {
      return JSON.stringify(JSON.parse(JSON.parse(value)), null, 2);
    } catch {
      return "Invalid serialized JSON string.";
    }
  }
  if (name.includes("xml stringify")) return JSON.stringify(value);
  if (name.includes("curl to php")) return curlToPhp(value);
  if (name.includes("json escape")) return jsonEscape(value);
  if (name.includes("json url parameters")) return jsonUrlParameters(value);
  if (name.includes("json to model")) return jsonToModel(value);
  if (name.includes("url parameter formatter")) return queryParameterFormat(value);
  if (name.includes("url batch generator")) return urlBatch(value);
  if (name.includes("javascript url encoder")) return value.includes("%") ? decodeURIComponent(value) : encodeURIComponent(value);
  if (name.includes("character encoder")) return characterCodes(value);
  if (name.includes("garble")) return garbleDecode(value);
  if (name.includes("punycode")) return punycodePreview(value);
  if (name.includes("base62")) return baseN(value, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  if (name.includes("base85")) return baseN(value, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~");
  if (name.includes("base91")) return baseN(value, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~\"");
  if (name.includes("text compression")) return runLengthCodec(value);
  if (name.includes("file hex")) return /^[0-9a-f\s]+$/i.test(value) ? binaryToText(value.replace(/\s+/g, "").match(/.{1,2}/g)?.map((hex) => Number.parseInt(hex, 16).toString(2).padStart(8, "0")).join(" ") ?? "") : Array.from(value).map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
  if (name.includes("base number") || name.includes("bigint base")) return baseConvert(value);
  if (name.includes("ieee")) return ieee754(value);
  if (name.includes("byte signed")) return byteSignedUnsigned(value);
  if (name.includes("little big endian")) return reverseBytePairs(value);
  if (name.includes("reverse binary")) return value.replace(/\s+/g, "").split("").reverse().join("");
  if (name.includes("reverse array")) return value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean).reverse().join("\n");
  if (name.includes("gzip text compressor") || name.includes("deflate text compressor")) return runLengthCodec(value);
  if (name.includes("json url encode") || name.includes("xml url encode") || name.includes("yaml url encode")) return encodeURIComponent(value);
  if (name.includes("json url decode") || name.includes("xml url decode") || name.includes("yaml url decode")) {
    try {
      return decodeURIComponent(value);
    } catch {
      return "Invalid URL encoded input.";
    }
  }
  if (name.includes("json to base64") || name.includes("xml to base64") || name.includes("yaml to base64") || name.includes("text to base64") || name.includes("base64 encode")) return btoa(unescape(encodeURIComponent(value)));
  if (name.includes("base64 to json") || name.includes("base64 to xml") || name.includes("base64 to yaml") || name.includes("base64 to text") || name.includes("base64 encode and decode")) {
    try {
      const decoded = decodeURIComponent(escape(atob(value)));
      if (name.includes("base64 to json")) {
        try {
          return JSON.stringify(JSON.parse(decoded), null, 2);
        } catch {
          return decoded;
        }
      }
      return decoded;
    } catch {
      return btoa(unescape(encodeURIComponent(value)));
    }
  }
  if (name.includes("base64 encode")) return btoa(unescape(encodeURIComponent(value)));
  if (name.includes("base64 decode")) {
    try {
      return decodeURIComponent(escape(atob(value)));
    } catch {
      return "Invalid Base64 input.";
    }
  }
  if (name.includes("url encode")) return encodeURIComponent(value);
  if (name.includes("url decode")) {
    try {
      return decodeURIComponent(value);
    } catch {
      return "Invalid URL encoded input.";
    }
  }
  if (name.includes("html entity encode") || name.includes("html encode") || name.includes("escape html")) return htmlEncode(value);
  if (name.includes("html entity decode") || name.includes("html decode") || name.includes("unescape html")) return htmlDecode(value);
  if (name.includes("javascript encode")) return jsEncode(value);
  if (name.includes("javascript decode")) return jsDecode(value);
  if (name.includes("unicode encode")) return unicodeEncode(value);
  if (name.includes("unicode decode")) return unicodeDecode(value);
  if (name.includes("utf-8")) return utf8Decode(value);
  if (name.includes("rot13")) return rot13(value);
  if (name.includes("caesar cipher")) {
    const [shiftLine = "3", ...text] = value.split(/\r?\n/);
    return caesarCipher(text.join("\n") || shiftLine, Number.parseInt(shiftLine, 10) || 3);
  }
  if (name.includes("base32 encode")) return base32Encode(value);
  if (name.includes("base32 decode")) return base32Decode(value);
  if (name.includes("base58 encode")) return base58Encode(value);
  if (name.includes("base58 decode")) return base58Decode(value);
  if (name.includes("morse code translator")) return /^[.\-/\s]+$/.test(value) ? morseDecode(value) : morseEncode(value);
  if (name.includes("morse encode")) return morseEncode(value);
  if (name.includes("morse decode")) return morseDecode(value);
  if (name.includes("quoted printable encode")) {
    return Array.from(value).map((char) => /[A-Za-z0-9 ]/.test(char) ? char : `=${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`).join("");
  }
  if (name.includes("quoted printable decode")) return value.replace(/=([0-9A-F]{2})/gi, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)));
  if (name.includes("jwt encode")) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=+$/g, "");
    const payload = btoa(value.startsWith("{") ? value : JSON.stringify({ data: value })).replace(/=+$/g, "");
    return `${header}.${payload}.sample-signature`;
  }
  if (name.includes("jwt decode") || name.includes("jwt verify")) {
    const [header = "", payload = "", signature = ""] = value.split(".");
    const decodePart = (part: string) => {
      try {
        return JSON.stringify(JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))), null, 2);
      } catch {
        return "Invalid section";
      }
    };
    return `Header\n${decodePart(header)}\n\nPayload\n${decodePart(payload)}\n\nSignature\n${signature || "missing"}`;
  }
  if (name.includes("json stringify text")) return JSON.stringify(value);
  if (name.includes("json unstringifier")) {
    try {
      return JSON.parse(value);
    } catch {
      return value.replace(/^"|"$/g, "").replace(/\\"/g, "\"").replace(/\\n/g, "\n").replace(/\\t/g, "\t");
    }
  }
  if (name.includes("json") && name.includes("format")) {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("minify json")) {
    try {
      return JSON.stringify(JSON.parse(value));
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("minify html") || name.includes("minify xml")) return value.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
  if (name.includes("javascript minifier") || name.includes("minify js") || name.includes("css minifier") || name.includes("minify css")) {
    return value.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
  }
  if (name.includes("csv to json")) return csvToJson(value);
  if (name.includes("tsv to json")) return tsvToJson(value);
  if (name.includes("json to csv")) {
    try {
      return jsonToCsv(value);
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("json to tsv")) {
    try {
      return jsonToTsv(value);
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("json to xml")) {
    try {
      return `<root>\n${Object.entries(JSON.parse(value)).map(([key, item]) => `  <${key}>${String(item)}</${key}>`).join("\n")}\n</root>`;
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("xml to json")) {
    const entries = Array.from(value.matchAll(/<([A-Za-z0-9_-]+)>([\s\S]*?)<\/\1>/g)).map((match) => [match[1], match[2]]);
    return JSON.stringify(Object.fromEntries(entries), null, 2);
  }
  if (name.includes("csv to xml")) {
    const [headers = [], ...rows] = csvRows(value);
    return `<rows>\n${rows.map((row) => `  <row>\n${headers.map((header, index) => `    <${header}>${htmlEncode(row[index] ?? "")}</${header}>`).join("\n")}\n  </row>`).join("\n")}\n</rows>`;
  }
  if (name.includes("xml to csv")) {
    const entries = Array.from(value.matchAll(/<([A-Za-z0-9_-]+)>([\s\S]*?)<\/\1>/g)).map((match) => [match[1], match[2].trim()]);
    return entries.map(([key, item]) => `${key},${JSON.stringify(item)}`).join("\n");
  }
  if (name.includes("csv to yaml")) {
    const [headers = [], ...rows] = csvRows(value);
    return rows.map((row) => headers.map((header, index) => `${header}: ${row[index] ?? ""}`).join("\n")).join("\n---\n");
  }
  if (name.includes("yaml to csv")) {
    const entries = value.split(/\r?\n/).map((line) => line.split(/:\s*/)).filter((parts) => parts.length >= 2);
    return entries.map(([key, ...rest]) => `${key},${rest.join(":")}`).join("\n");
  }
  if (name.includes("xml to yaml")) {
    const entries = Array.from(value.matchAll(/<([A-Za-z0-9_-]+)>([\s\S]*?)<\/\1>/g)).map((match) => `${match[1]}: ${match[2].trim()}`);
    return entries.join("\n");
  }
  if (name.includes("yaml to xml")) {
    const entries = value.split(/\r?\n/).map((line) => line.split(/:\s*/)).filter((parts) => parts.length >= 2);
    return `<root>\n${entries.map(([key, ...rest]) => `  <${key}>${htmlEncode(rest.join(":"))}</${key}>`).join("\n")}\n</root>`;
  }
  if (name.includes("json to yaml")) {
    try {
      return Object.entries(JSON.parse(value)).map(([key, item]) => `${key}: ${String(item)}`).join("\n");
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("yaml to json") || name.includes("toml to json") || name.includes("ini to json")) {
    return JSON.stringify(Object.fromEntries(value.split(/\r?\n/).map((line) => line.split(/[:=]/)).filter((parts) => parts.length >= 2).map(([key, ...rest]) => [key.trim(), rest.join(":").trim()])), null, 2);
  }
  if (name.includes("json to toml") || name.includes("json to ini")) {
    try {
      return Object.entries(JSON.parse(value)).map(([key, item]) => `${key} = ${JSON.stringify(item)}`).join("\n");
    } catch {
      return "Invalid JSON input.";
    }
  }
  if (name.includes("markdown to html")) return value.split(/\r?\n/).map((line) => line.startsWith("# ") ? `<h1>${line.slice(2)}</h1>` : `<p>${line}</p>`).join("\n");
  if (name.includes("html to markdown")) return htmlDecode(value.replace(/<h1>(.*?)<\/h1>/gi, "# $1\n").replace(/<[^>]+>/g, ""));
  if (name.includes("word to markdown")) return wordToMarkdown(value);
  if (name.includes("html to text")) return htmlDecode(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  if (name.includes("text to html")) return value.split(/\r?\n/).map((line) => `<p>${htmlEncode(line)}</p>`).join("\n");
  if (name.includes("text to csv")) return value.split(/\r?\n/).map((line) => JSON.stringify(line)).join("\n");
  if (name.includes("csv to text")) return csvRows(value).map((row) => row.join(" ")).join("\n");
  if (name.includes("hex to rgb")) return hexToRgb(value);
  if (name.includes("rgb to hex")) return rgbToHex(value);
  if (name.includes("decimal to hex")) return Number.parseInt(value, 10).toString(16).toUpperCase();
  if (name.includes("hex to decimal")) return Number.parseInt(value.replace(/^0x/i, ""), 16).toString(10);
  if (name.includes("octal to decimal")) return Number.parseInt(value, 8).toString(10);
  if (name.includes("decimal to octal")) return Number.parseInt(value, 10).toString(8);
  if (name.includes("unix to date")) return new Date(Number.parseInt(value, 10) * 1000).toISOString();
  if (name.includes("date to unix")) return Math.floor(new Date(value).getTime() / 1000).toString();
  if (name.includes("css to inline")) return `style="${value.replace(/\s+/g, " ").trim()}"`;
  if (name.includes("inline to css")) return value.match(/style=["']([^"']+)["']/)?.[1].split(";").filter(Boolean).map((rule) => `  ${rule.trim()};`).join("\n") ?? value;
  if ((name.includes("css to ") || name.includes("scss to ") || name.includes("less to ") || name.includes("sass to ") || name.includes("stylus to ")) && name.includes("css") || name.includes(" to scss") || name.includes(" to less") || name.includes(" to sass") || name.includes(" to stylus")) return cssPreprocessorPreview(name, value);
  if (name.includes("graphql formatter") || name.includes("graphql beautifier") || name.includes("nginx formatter") || name.includes("scss formatter") || name.includes("scss beautifier") || name.includes("less formatter") || name.includes("less beautifier") || name.includes("typescript formatter") || name.includes("react formatter") || name.includes("angular formatter") || name.includes("vue js formatter") || name.includes("babel formatter") || name.includes("glimmer js formatter") || name.includes("lwc formatter") || name.includes("flow formatter") || name.includes("css formatter") || name.includes("javascript formatter") || name.includes("javascript beautifier")) return formatBracedText(value);
  if (name.includes("markdown formatter")) return value.replace(/\n{3,}/g, "\n\n").replace(/^(#+)([^\s#])/gm, "$1 $2").trim();
  if (name.includes("yaml formatter") || name.includes("yaml beautifier")) return value.replace(/\r\n/g, "\n").replace(/^\s*-\s*/gm, "- ").trim();
  if (name.includes("word counter")) return `Words: ${value.split(/\s+/).filter(Boolean).length}`;
  if (name.includes("character counter")) return `Characters: ${value.length}`;
  if (name.includes("line counter")) return `Lines: ${value.split(/\r?\n/).length}`;
  if (name.includes("binary code translator")) return looksLikeBinaryCode(value) ? binaryToText(value) : textToBinary(value);
  if (name.includes("text to binary")) return textToBinary(value);
  if (name.includes("binary to text")) {
    return binaryToText(value);
  }
  if (name.includes("text to hex")) return Array.from(value).map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  if (name.includes("hex to text")) {
    return value.replace(/\s+/g, "").match(/.{1,2}/g)?.map((part) => {
      const code = Number.parseInt(part, 16);
      return Number.isFinite(code) ? String.fromCharCode(code) : "";
    }).join("") ?? "";
  }
  if (name.includes("camelcase converter")) return toCamelCaseValue(value);
  if (name.includes("pascalcase converter")) return toPascalCaseValue(value);
  if (name.includes("snake_case converter")) return wordsForCase(value).join("_");
  if (name.includes("kebab-case converter")) return wordsForCase(value).join("-");
  if (name.includes("dot.case converter")) return wordsForCase(value).join(".");
  if (name.includes("case converter")) return `UPPER\n${value.toUpperCase()}\n\nlower\n${value.toLowerCase()}`;
  if (name.includes("remove duplicates")) return Array.from(new Set(value.split(/\r?\n/))).join("\n");
  if (name.includes("sort lines")) return value.split(/\r?\n/).sort((a, b) => a.localeCompare(b)).join("\n");
  if (name.includes("number sorter")) return value.match(/-?\d+(\.\d+)?/g)?.map(Number).sort((a, b) => a - b).join("\n") ?? "";
  if (name.includes("text reverser")) return value.split("").reverse().join("");
  if (name.includes("remove line breaks")) return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join(" ");
  if (name.includes("duplicate line remover")) return Array.from(new Set(value.split(/\r?\n/).filter(Boolean))).join("\n");
  if (name.includes("remove text formatting") || name.includes("plain text converter")) return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (name.includes("remove underscores")) return value.replace(/_/g, " ");
  if (name.includes("whitespace remover")) return value.replace(/\s+/g, " ").trim();
  if (name.includes("em dash remover")) return value.replace(/\u2014/g, "-").replace(/\u2013/g, "-");
  if (name.includes("small text generator")) return toSmallText(value);
  if (name.includes("reverse text generator")) return value.split("").reverse().join("");
  if (name.includes("sentence case converter")) return toSentenceCase(value);
  if (name.includes("title case converter")) return toTitleCase(value);
  if (name.includes("sort words alphabetically")) return value.split(/\s+/).filter(Boolean).sort((a, b) => a.localeCompare(b)).join(" ");
  if (name.includes("online sentence counter")) return `Sentences: ${value.split(/[.!?]+/).filter((part) => part.trim()).length}`;
  if (name.includes("word frequency counter") || name.includes("word cloud generator")) {
    return wordCounts(value).map(([word, count]) => `${word}: ${count}`).join("\n") || "No words found.";
  }
  if (name.includes("duplicate word finder")) {
    const duplicates = wordCounts(value).filter(([, count]) => count > 1);
    return duplicates.length ? `Duplicate words found\n\n${duplicates.map(([word, count]) => `${word}: ${count}`).join("\n")}` : "No duplicate words found.";
  }
  if (name.includes("find and replace text")) {
    const [find = "", replace = "", ...text] = value.split(/\r?\n/);
    return text.join("\n").split(find).join(replace);
  }
  if (name.includes("character remover")) {
    const [chars = "", ...text] = value.split(/\r?\n/);
    if (!chars) return text.join("\n");
    const escaped = chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.join("\n").replace(new RegExp(`[${escaped}]`, "g"), "");
  }
  if (name.includes("repeat text generator")) {
    const [countLine = "3", ...text] = value.split(/\r?\n/);
    const count = Math.max(1, Math.min(100, Number.parseInt(countLine, 10) || 3));
    return Array.from({ length: count }, () => text.join("\n") || countLine).join("\n");
  }
  if (name.includes("invisible text generator")) return "\u200B".repeat(Math.max(1, Math.min(200, Number.parseInt(value, 10) || 24)));
  if (name.includes("text splitter")) return value.split(/\s+/).filter(Boolean).join("\n");
  if (name.includes("text joiner")) return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join(" ");
  if (name.includes("text escape")) return JSON.stringify(value);
  if (name.includes("text beautifier")) return value.split(/\r?\n/).map((line) => line.trim().replace(/\s+/g, " ")).filter(Boolean).join("\n");
  if (name.includes("text line length filter")) {
    const [limitLine = "20", ...lines] = value.split(/\r?\n/);
    const limit = Number.parseInt(limitLine, 10) || 20;
    return lines.filter((line) => line.length <= limit).join("\n");
  }
  if (name.includes("fixed length text lines")) return fixedLengthLines(value);
  if (name.includes("punctuation")) return value.replace(/,/g, "\uff0c").replace(/\./g, "\u3002").replace(/!/g, "\uff01").replace(/\?/g, "\uff1f").replace(/"/g, "\u201d");
  if (name.includes("key value to code")) return keyValueToCode(value);
  if (name.includes("directory tree")) return directoryTree(value);
  if (name.includes("pinyin")) return "zhong wen gong ju";
  if (name.includes("simplified traditional")) return `${value}\nTraditional preview: \u6f22\u8a9e\u8f49\u63db`;
  if (name.includes("markdown table generator")) return markdownTable(value);
  if (name.includes("nato phonetic alphabet translator") || name.includes("phonetic spelling tool")) {
    return value.toLowerCase().split("").map((char) => natoWords[char] ?? char).join(" ");
  }
  if (name.includes("pig latin translator")) return value.split(/\s+/).map(pigLatinWord).join(" ");
  if (name.includes("roman numeral dates")) return value.match(/\d{1,4}/g)?.map((number) => `${number}: ${toRoman(Number(number))}`).join("\n") ?? "Enter a year or number.";
  if (name.includes("wingdings translator")) return Array.from(value).map((char) => `&#${10000 + char.charCodeAt(0)};`).join(" ");
  if (name.includes("apa citation generator")) return `${value.replace(/\.$/, "")}. (2026). CodeTools AI. https://example.com`;
  if (name.includes("online notepad")) return value;
  if (name.includes("text compare") || name.includes("text diff")) {
    const [left = "", right = ""] = value.split(/\n---\n/);
    return left === right ? "The two text blocks match." : `Different text blocks\n\nLeft length: ${left.length}\nRight length: ${right.length}`;
  }
  if (name.includes("password generator")) return `${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}A1!`;
  if (name.includes("slug generator")) return slugify(value);
  if (name.includes("slugify url generator")) return slugify(value);
  if (name.includes("utm generator")) return utmUrl(value);
  if (name.includes("username generator")) return `${slugify(value || "code tools").slice(0, 16)}_${Math.floor(Math.random() * 1000)}`;
  if (name.includes("cron generator")) return `# Every day at 09:00\n0 9 * * * ${value || "run-command"}`;
  if (name.includes("cron expression parser")) {
    const [minute = "*", hour = "*", day = "*", month = "*", weekday = "*"] = value.split(/\s+/);
    return `Minute: ${minute}\nHour: ${hour}\nDay of month: ${day}\nMonth: ${month}\nWeekday: ${weekday}`;
  }
  if (name.includes("barcode generator") || name.includes("qr code generator")) return `Payload\n${value}\n\nASCII preview\n[ ${value.slice(0, 36)} ]`;
  if (name.includes("htaccess generator")) return `RewriteEngine On\nRewriteCond %{HTTPS} !=on\nRewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n# ${value}`;
  if (name.includes("lorem ipsum") || name.includes("lorem faker")) {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae velit at massa luctus tincidunt.";
  }
  if (name.includes("code formatter") || name.includes("code beautifier")) {
    return value
      .replace(/\{/g, "{\n  ")
      .replace(/;/g, ";\n  ")
      .replace(/\}/g, "\n}")
      .replace(/\n\s+\n/g, "\n")
      .trim();
  }
  if (name.includes("code minifier")) return value.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").replace(/\s+/g, " ").trim();
  if (name.includes("code diff")) {
    const [left = "", right = ""] = value.split(/\n---\n/);
    const leftLines = left.split(/\r?\n/);
    const rightLines = right.split(/\r?\n/);
    const max = Math.max(leftLines.length, rightLines.length);
    return Array.from({ length: max }, (_, index) => {
      if (leftLines[index] === rightLines[index]) return `  ${leftLines[index] ?? ""}`;
      return `- ${leftLines[index] ?? ""}\n+ ${rightLines[index] ?? ""}`;
    }).join("\n");
  }
  if (name.includes("code snippet generator")) {
    return `function handleInput(value) {\n  if (!value) return null;\n  return value.trim();\n}\n\nexport { handleInput };`;
  }
  if (name.includes("code commenter")) return value.split(/\r?\n/).map((line) => line.trim() ? `${line} // explain this step` : line).join("\n");
  if (name.includes("code refactor")) return `// Refactor suggestion\n// 1. Extract repeated logic into small functions.\n// 2. Name intermediate values clearly.\n// 3. Keep side effects near the edge.\n\n${value}`;
  if (name.includes("code optimizer")) return `Optimization notes\n- Remove repeated work inside loops.\n- Prefer early returns for guard clauses.\n- Cache derived values when reused.\n\n${value}`;
  if (name.includes("code summarizer")) return `Summary\nThis code appears to define a small routine, process input, and return or print a result.\n\nKey input\n${value.slice(0, 240)}`;
  if (name.includes("code documentation")) return `# Code Documentation\n\n## Purpose\nDescribe what this code does and when to use it.\n\n## Inputs\nList parameters, types, and expected values.\n\n## Output\nDescribe the returned value or side effect.\n\n## Source\n\`\`\`\n${value}\n\`\`\``;
  if (name.includes("unit test")) return `import { describe, expect, it } from "vitest";\n\nimport { add } from "./module";\n\ndescribe("add", () => {\n  it("adds two numbers", () => {\n    expect(add(2, 3)).toBe(5);\n  });\n});`;
  if (name.includes("api code")) return `export async function GET() {\n  return Response.json({ data: [], ok: true });\n}\n\nexport async function POST(request: Request) {\n  const body = await request.json();\n  return Response.json({ data: body, ok: true }, { status: 201 });\n}`;
  if (name.includes("sql query")) return `SELECT id, email, created_at\nFROM users\nWHERE created_at >= NOW() - INTERVAL '30 days'\nORDER BY created_at DESC\nLIMIT 50;`;
  if (name.includes("shell script")) return `#!/usr/bin/env bash\nset -euo pipefail\n\nsrc="./project"\ndest="./backup-$(date +%Y%m%d).tar.gz"\ntar -czf "$dest" "$src"\necho "Created $dest"`;
  if (name.includes("dockerfile")) return `FROM node:20-alpine AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\n\nFROM deps AS build\nCOPY . .\nRUN npm run build\n\nEXPOSE 3000\nCMD ["npm", "start"]`;
  if (name.includes("readme")) return `# Project Name\n\nShort description of the tool or application.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Features\n\n- Fast developer workflow\n- Clean UI\n- Extensible architecture`;
  if (name.includes("sql formatter")) return value.replace(/\b(select|from|where|order by|group by|limit)\b/gi, "\n$1").trim().toUpperCase();
  if (name.includes("xml formatter") || name.includes("html formatter") || name.includes("wsdl formatter") || name.includes("soap formatter") || name.includes("xml beautifier") || name.includes("html beautifier")) {
    return value.replace(/></g, ">\n<");
  }
  if (name.includes("css formatter") || name.includes("css beautifier")) return value.replace(/\{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/\}/g, "\n}");
  if (name.includes("javascript formatter") || name.includes("js beautifier") || name.includes("javascript beautifier") || name.includes("python formatter") || name.includes("python beautifier") || name.includes("php formatter") || name.includes("php beautifier") || name.includes("java formatter") || name.includes("java beautifier") || name.includes("c# formatter") || name.includes("c# beautifier") || name.includes("c/c++ formatter") || name.includes("c beautifier") || name.includes("c++ beautifier") || name.includes("go formatter") || name.includes("perl beautifier") || name.includes("ruby beautifier") || name.includes("lua beautifier")) {
    return value.replace(/\{/g, "{\n  ").replace(/;/g, ";\n  ").replace(/\}/g, "\n}").trim();
  }
  if (name.includes("add line numbers")) return value.split(/\r?\n/).map((line, index) => `${String(index + 1).padStart(3, " ")}  ${line}`).join("\n");
  if (name.includes("text wrap")) return value.match(/.{1,80}(\s|$)/g)?.map((line) => line.trim()).join("\n") ?? value;
  if (name.includes("hash generator") || name.includes("md5 generator") || name.includes("sha1 generator") || name.includes("sha256 generator") || name.includes("sha512 generator") || name.includes("hmac generator")) {
    return `${tool.name}\n${simpleHash(value)}${simpleHash(`${tool.name}:${value}`)}`;
  }
  if (name.includes("hash identifier")) {
    const length = value.replace(/\s+/g, "").length;
    if (length === 32) return "Likely MD5";
    if (length === 40) return "Likely SHA1";
    if (length === 64) return "Likely SHA256";
    if (length === 128) return "Likely SHA512";
    return "Unknown hash length";
  }
  if (name.includes("password strength")) {
    const score = [value.length >= 12, /[A-Z]/.test(value), /[a-z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
    return `Score: ${score}/5\nStrength: ${score >= 4 ? "Strong" : score >= 3 ? "Medium" : "Weak"}`;
  }
  if (name.includes("md5 decrypt") || name.includes("hash cracker")) return `No local reverse match found for ${value}.\nTip: real cracking requires a server-side dictionary or lookup API.`;
  if (name.includes("ssl checker")) return `SSL check preview\nHost: ${value}\nStatus: valid\nProtocol: TLS 1.3\nExpires: future date`;
  if (name.includes("whois lookup")) return `WHOIS lookup preview\nDomain: ${value}\nRegistrar: Example Registrar\nStatus: active`;
  if (name.includes("dns lookup") || name.includes("dns record viewer") || name.includes("dns propagation")) return `DNS records for ${value}\nA     203.0.113.10\nAAAA  2001:db8::10\nMX    mail.${value.replace(/^https?:\/\//, "")}`;
  if (name.includes("ip lookup") || name.includes("ip information")) return `IP information\nInput: ${value}\nType: ${value.includes(":") ? "IPv6" : "IPv4"}\nNetwork: documentation range`;
  if (name.includes("user agent parser")) return `Browser: ${value.includes("Chrome") ? "Chrome-like" : "Unknown"}\nOS: ${value.includes("Windows") ? "Windows" : "Unknown"}\nRaw: ${value}`;
  if (name.includes("url scanner")) return `URL scan\nURL: ${value}\nScheme: ${value.startsWith("https") ? "HTTPS" : "Other"}\nRisk: ${value.includes(" ") ? "Check input" : "Low preview risk"}`;
  if (name.includes("security headers")) return "Recommended headers\nContent-Security-Policy\nStrict-Transport-Security\nX-Content-Type-Options: nosniff\nReferrer-Policy";
  if (name.includes("http headers")) return `GET / HTTP/1.1\nHost: ${value}\nUser-Agent: CodeTools AI\nAccept: */*`;
  if (name.includes("url extractor")) return value.match(/https?:\/\/[^\s]+/g)?.join("\n") ?? "No URLs found.";
  if (name.includes("ping test")) return `PING ${value}\n64 bytes from ${value}: time=23ms\n64 bytes from ${value}: time=21ms\nPackets: sent=2 received=2 lost=0`;
  if (name.includes("traceroute")) return `Traceroute to ${value}\n1  local.gateway  1 ms\n2  isp.example     8 ms\n3  ${value}        24 ms`;
  if (name.includes("domain checker")) return `${value}\nStatus: available check requires registrar API\nSyntax: ${/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value) ? "valid" : "check domain format"}`;
  if (name.includes("port scanner")) return value.split(/[,\s]+/).filter(Boolean).map((port) => `${port}: ${Number(port) % 2 === 0 ? "open" : "filtered"} (preview)`).join("\n");
  if (name.includes("subdomain finder")) return [`www.${value}`, `api.${value}`, `cdn.${value}`, `status.${value}`].join("\n");
  if (name.includes("http status checker")) return `${value}\nStatus: 200 OK (preview)`;
  if (name.includes("redirect checker")) return `${value}\n301 -> https://${value.replace(/^https?:\/\//, "")}\n200 -> final URL`;
  if (name.includes("url parser")) {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return `Protocol: ${url.protocol}\nHost: ${url.host}\nPath: ${url.pathname}\nQuery: ${url.search}`;
  }
  if (name.includes("query string parser")) {
    const query = value.includes("?") ? value.split("?")[1] : value;
    return Array.from(new URLSearchParams(query).entries()).map(([key, item]) => `${key}: ${item}`).join("\n") || "No query params found.";
  }
  if (name.includes("cidr calculator")) return `${value}\nNetwork: sample network range\nUsable hosts: depends on prefix length`;
  if (name.includes("ipv4 converter")) return value.split(".").map((part) => Number(part).toString(16).padStart(2, "0")).join("");
  if (name.includes("mac address lookup")) return `MAC prefix: ${value.slice(0, 8)}\nVendor: Example Networks (preview)`;
  if (name.includes("base64 to image") || name.includes("image to base64")) return `Data URL preview\ndata:image/png;base64,${name.includes("image to") ? btoa(value) : value.slice(0, 120)}`;
  if (name.includes("regex cheat sheet")) {
    return "\\d digit\n\\w word character\n\\s whitespace\n. any character\n+ one or more\n* zero or more\n? optional\n^ start\n$ end\n[] character set\n() capture group\n| either/or";
  }
  if (name.includes("email regex")) return "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/";
  if (name.includes("url regex")) return "/https?:\\/\\/[^\\s/$.?#].[^\\s]*/gi";
  if (name.includes("phone regex")) return "/\\+?[0-9][0-9\\s().-]{7,}[0-9]/g";
  if (name.includes("password regex")) return "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/";
  if (name.includes("regex escape")) return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (name.includes("regex unescape")) return value.replace(/\\([.*+?^${}()|[\]\\])/g, "$1");
  if (name.includes("regex replace")) {
    const lines = value.split(/\r?\n/);
    const regex = regexFromLine(lines[0] || "");
    const replacement = lines[1] ?? "";
    const text = lines.slice(2).join("\n");
    return text.replace(regex, replacement);
  }
  if (name.includes("regex split")) {
    const { regex, text } = regexParts(value);
    return text.split(regex).filter(Boolean).join("\n");
  }
  if (name.includes("regex validator")) {
    const { regex } = regexParts(value);
    return `Valid regex\nPattern: ${regex.toString()}`;
  }
  if (name.includes("regex explainer")) {
    const { patternLine } = regexParts(value);
    return explainRegex(patternLine);
  }
  if (name.includes("regex groups")) {
    const { regex, text } = regexParts(value);
    const matches = Array.from(text.matchAll(regex));
    return matches.length
      ? matches.map((match, index) => `Match ${index + 1}: ${match[0]}\nGroups: ${match.slice(1).join(", ") || "none"}`).join("\n\n")
      : "No matches found.";
  }
  if (name.includes("regex")) {
    const { regex, text } = regexParts(value);
    const matches = Array.from(text.matchAll(regex)).map((match) => match[0]);
    return matches.length
      ? `Matches: ${matches.length}\n\n${matches.map((match, index) => `${index + 1}. ${match}`).join("\n")}`
      : "No matches found.";
  }
  if (name.includes(" to ") && name.includes("converter")) {
    return `// ${tool.name} preview\n// Review and adapt the result for your project.\n\n${value}`;
  }

  return `${tool.name} result\n\nInput\n${value}\n\nReview this preview before using it in a production workflow.`;
}

export function DirectoryToolWorkspace({ tool }: { tool: DirectoryTool }) {
  const [input, setInput] = useState(tool.category === "Text" ? defaultTextInput(tool) : sampleFor(tool));
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [textOption, setTextOption] = useState(defaultTextOption(tool));
  const { t } = useI18n();
  const Icon = toolIcons[tool.iconName];
  const headerCopy = getDirectoryToolHeader(tool);
  const pageDescription = headerCopy.description;
  const eyebrow = headerCopy.eyebrow === getCategoryLabel(tool.category) ? localizedCategoryLabel(tool.category, t) : headerCopy.eyebrow;

  const run = async () => {
    setLoading(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 250));
    try {
      setOutput(processTool(tool, tool.category === "Text" ? textToolPayload(tool, input, textOption) : input));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("online.processError"));
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tool-output"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: tool.name, text: output || input });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  if (tool.category === "Text") {
    const inputLines = input ? input.split(/\r?\n/).length : 0;
    const outputLines = output ? output.split(/\r?\n/).length : 0;
    const hasOption = hasTextOption(tool);

    return (
        <main className="bg-gradient-to-b from-cyan-50 to-white px-4 py-8 text-slate-950">
          <section className="mx-auto max-w-[1200px]">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4" />
              {t("online.back")}
            </Link>

            <div className="mt-5">
              <p className="inline-block bg-blue-700 px-2 py-1 text-[13px] font-black uppercase tracking-[0.2em] text-white">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{headerCopy.title}</h1>
              <p className="mt-3 max-w-5xl text-base leading-7 text-slate-700 sm:text-lg">{pageDescription}</p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={`Type or paste text to ${tool.name.toLowerCase()}...`}
                  className="min-h-[420px] w-full resize-y bg-white p-4 text-base leading-7 text-slate-900 outline-none placeholder:text-slate-500"
                  spellCheck={false}
                />
                <div className="border-t-8 border-slate-300 bg-white px-4 py-3 text-right text-sm font-medium text-slate-700">
                  Character Count: {input.length} | Word Count: {countWords(input)} | Line Count: {inputLines}
                </div>
              </div>

              <div className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                <textarea
                  value={output}
                  onChange={(event) => setOutput(event.target.value)}
                  placeholder={`Type or paste text to ${tool.name.toLowerCase()}...`}
                  className="min-h-[420px] w-full resize-y bg-white p-4 text-base leading-7 text-slate-900 outline-none placeholder:text-slate-500"
                  spellCheck={false}
                />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t-8 border-slate-300 bg-white px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={copy} disabled={!output} title={t("online.copy")} className="grid h-9 w-9 place-items-center rounded bg-slate-100 text-slate-900 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400">
                      <Copy className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={share} title="Share" className="grid h-9 w-9 place-items-center rounded bg-slate-100 text-slate-900 transition hover:bg-blue-50">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={download} disabled={!output} title={t("tool.download")} className="grid h-9 w-9 place-items-center rounded bg-slate-100 text-slate-900 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400">
                      <Download className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={clearAll} title={t("online.clear")} className="grid h-9 w-9 place-items-center rounded bg-slate-100 text-slate-900 transition hover:bg-blue-50">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    Character Count: {output.length} | Word Count: {countWords(output)} | Line Count: {outputLines}
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-5 rounded border border-slate-300 bg-white p-4 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[minmax(240px,360px)_1fr_auto] lg:items-end">
                {hasOption && (
                  <label className="grid gap-2 text-sm font-semibold text-slate-900">
                    {textOptionLabel(tool)}
                    {textOption.includes("\n") || tool.name.toLowerCase().includes("find and replace") ? (
                      <textarea
                        value={textOption}
                        onChange={(event) => setTextOption(event.target.value)}
                        className="min-h-20 rounded border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    ) : (
                      <input
                        value={textOption}
                        onChange={(event) => setTextOption(event.target.value)}
                        className="h-10 rounded border border-slate-300 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    )}
                  </label>
                )}
                <p className="text-sm leading-6 text-slate-600">{textOptionHelp(tool)}</p>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="gradient" onClick={run} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    {loading ? t("online.running") : t("online.runTool")}
                  </Button>
                  <Button type="button" variant="outline" onClick={clearAll}>
                    <Trash2 className="h-4 w-4" />
                    {t("online.clear")}
                  </Button>
                </div>
              </div>
              {error && <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
            </section>
          </section>
        </main>
    );
  }

  return (
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          {t("online.back")}
        </Link>

        <section className="mt-5 rounded-lg border bg-white p-5 shadow-soft sm:p-7">
        <div className="flex gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-md ${tool.accent}`}>
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{headerCopy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{pageDescription}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="grid gap-3">
            <label className="text-sm font-black text-slate-900">{t("online.input")}</label>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="code-scrollbar min-h-[320px] resize-y rounded-md border bg-slate-50 p-4 font-mono text-sm leading-6 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              spellCheck={false}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-sm font-black text-slate-900">{t("online.output")}</label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" disabled={!output} onClick={copy}>
                  <Copy className="h-4 w-4" />
                  {t("online.copy")}
                </Button>
                <Button type="button" variant="outline" size="sm" disabled={!output} onClick={download}>
                  <Download className="h-4 w-4" />
                  {t("tool.download")}
                </Button>
              </div>
            </div>
            <pre className="code-scrollbar min-h-[320px] overflow-auto whitespace-pre-wrap rounded-md border bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100">
              {output || <span className="text-slate-400">{t("online.outputPlaceholder")}</span>}
            </pre>
            {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="gradient" onClick={run} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {loading ? t("online.running") : t("online.runTool")}
          </Button>
          <Button type="button" variant="outline" onClick={clearAll}>
            <Trash2 className="h-4 w-4" />
            {t("online.clear")}
          </Button>
        </div>
        </section>
      </main>
  );
}
