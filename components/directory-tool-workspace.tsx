"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Download, Loader2, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolSeoContent } from "@/components/tool-seo-content";
import type { DirectoryTool } from "@/lib/home-tools";
import { useI18n } from "@/lib/i18n";
import { toolIcons } from "@/lib/tool-icons";

function sampleFor(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
  if (name.includes("find and replace")) return "old\nnew\nThis old text has old words.";
  if (name.includes("character remover")) return "aeiou\nRemove vowels from this sentence.";
  if (name.includes("repeat text")) return "3\nRepeat this line";
  if (name.includes("roman numeral")) return "2026";
  if (name.includes("nato") || name.includes("phonetic")) return "Code Tools";
  if (name.includes("pig latin")) return "hello developer world";
  if (name.includes("remove line breaks")) return "This paragraph\nwas copied\nwith line breaks.\n\nThis should become one clean line.";
  if (name.includes("duplicate word finder")) return "code tools help code writers find repeated repeated words in tools";
  if (name.includes("word frequency") || name.includes("word cloud")) return "code tools code text tools converter code";
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
  if (name.includes("binary")) return "Hello";
  if (name.includes("password")) return "CorrectHorseBatteryStaple!";
  if (name.includes("ping")) return "example.com";
  return `Paste input for ${tool.name}`;
}

function regexFromLine(line: string) {
  const trimmed = line.trim();
  const literal = trimmed.match(/^\/(.+)\/([dgimsuvy]*)$/);
  if (literal) return new RegExp(literal[1], literal[2].includes("g") ? literal[2] : `${literal[2]}g`);
  return new RegExp(trimmed, "g");
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
  const bits = value.toUpperCase().replace(/=+$/g, "").split("").map((char) => {
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

  if (name.includes("base64 encode")) return btoa(unescape(encodeURIComponent(value)));
  if (name.includes("base64 decode")) {
    try {
      return decodeURIComponent(escape(atob(value)));
    } catch {
      return "Invalid Base64 input.";
    }
  }
  if (name.includes("url encode")) return encodeURIComponent(value);
  if (name.includes("url decode")) return decodeURIComponent(value);
  if (name.includes("html entity encode") || name.includes("html encode") || name.includes("escape html")) return htmlEncode(value);
  if (name.includes("html entity decode") || name.includes("html decode") || name.includes("unescape html")) return htmlDecode(value);
  if (name.includes("javascript encode")) return jsEncode(value);
  if (name.includes("javascript decode")) return jsDecode(value);
  if (name.includes("unicode encode")) return unicodeEncode(value);
  if (name.includes("unicode decode")) return unicodeDecode(value);
  if (name.includes("base32 encode")) return base32Encode(value);
  if (name.includes("base32 decode")) return base32Decode(value);
  if (name.includes("base58 encode")) return base58Encode(value);
  if (name.includes("base58 decode")) return base58Decode(value);
  if (name.includes("morse encode")) return morseEncode(value);
  if (name.includes("morse decode")) return morseDecode(value);
  if (name.includes("quoted printable encode")) {
    return Array.from(value).map((char) => /[A-Za-z0-9 ]/.test(char) ? char : `=${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`).join("");
  }
  if (name.includes("quoted printable decode")) return value.replace(/=([0-9A-F]{2})/gi, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)));
  if (name.includes("jwt encode")) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=+$/g, "");
    const payload = btoa(value.startsWith("{") ? value : JSON.stringify({ data: value })).replace(/=+$/g, "");
    return `${header}.${payload}.mock-signature`;
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
  if (name.includes("json") && name.includes("format")) {
    return JSON.stringify(JSON.parse(value), null, 2);
  }
  if (name.includes("minify json")) return JSON.stringify(JSON.parse(value));
  if (name.includes("minify html") || name.includes("minify xml")) return value.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
  if (name.includes("javascript minifier") || name.includes("minify js") || name.includes("css minifier") || name.includes("minify css")) {
    return value.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
  }
  if (name.includes("csv to json")) return csvToJson(value);
  if (name.includes("json to csv")) return jsonToCsv(value);
  if (name.includes("json to xml")) return `<root>\n${Object.entries(JSON.parse(value)).map(([key, item]) => `  <${key}>${String(item)}</${key}>`).join("\n")}\n</root>`;
  if (name.includes("xml to json")) {
    const entries = Array.from(value.matchAll(/<([A-Za-z0-9_-]+)>([\s\S]*?)<\/\1>/g)).map((match) => [match[1], match[2]]);
    return JSON.stringify(Object.fromEntries(entries), null, 2);
  }
  if (name.includes("json to yaml")) return Object.entries(JSON.parse(value)).map(([key, item]) => `${key}: ${String(item)}`).join("\n");
  if (name.includes("yaml to json") || name.includes("toml to json") || name.includes("ini to json")) {
    return JSON.stringify(Object.fromEntries(value.split(/\r?\n/).map((line) => line.split(/[:=]/)).filter((parts) => parts.length >= 2).map(([key, ...rest]) => [key.trim(), rest.join(":").trim()])), null, 2);
  }
  if (name.includes("json to toml") || name.includes("json to ini")) return Object.entries(JSON.parse(value)).map(([key, item]) => `${key} = ${JSON.stringify(item)}`).join("\n");
  if (name.includes("markdown to html")) return value.split(/\r?\n/).map((line) => line.startsWith("# ") ? `<h1>${line.slice(2)}</h1>` : `<p>${line}</p>`).join("\n");
  if (name.includes("html to markdown")) return htmlDecode(value.replace(/<h1>(.*?)<\/h1>/gi, "# $1\n").replace(/<[^>]+>/g, ""));
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
  if (name.includes("word counter")) return `Words: ${value.split(/\s+/).filter(Boolean).length}`;
  if (name.includes("character counter")) return `Characters: ${value.length}`;
  if (name.includes("line counter")) return `Lines: ${value.split(/\r?\n/).length}`;
  if (name.includes("text to binary")) return Array.from(value).map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
  if (name.includes("binary to text")) {
    return value.split(/\s+/).map((part) => String.fromCharCode(parseInt(part, 2))).join("");
  }
  if (name.includes("text to hex")) return Array.from(value).map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  if (name.includes("hex to text")) {
    return value.replace(/\s+/g, "").match(/.{1,2}/g)?.map((part) => String.fromCharCode(parseInt(part, 16))).join("") ?? "";
  }
  if (name.includes("case converter")) return `UPPER\n${value.toUpperCase()}\n\nlower\n${value.toLowerCase()}`;
  if (name.includes("remove duplicates")) return Array.from(new Set(value.split(/\r?\n/))).join("\n");
  if (name.includes("sort lines")) return value.split(/\r?\n/).sort((a, b) => a.localeCompare(b)).join("\n");
  if (name.includes("text reverser")) return value.split("").reverse().join("");
  if (name.includes("remove line breaks")) return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join(" ");
  if (name.includes("duplicate line remover")) return Array.from(new Set(value.split(/\r?\n/).filter(Boolean))).join("\n");
  if (name.includes("remove text formatting") || name.includes("plain text converter")) return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (name.includes("remove underscores")) return value.replace(/_/g, " ");
  if (name.includes("whitespace remover")) return value.replace(/\s+/g, " ").trim();
  if (name.includes("em dash remover")) return value.replace(/\u2014/g, "-").replace(/\u2013/g, "-");
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
    const escaped = chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.join("\n").replace(new RegExp(`[${escaped}]`, "g"), "");
  }
  if (name.includes("repeat text generator")) {
    const [countLine = "3", ...text] = value.split(/\r?\n/);
    const count = Math.max(1, Math.min(100, Number.parseInt(countLine, 10) || 3));
    return Array.from({ length: count }, () => text.join("\n") || countLine).join("\n");
  }
  if (name.includes("invisible text generator")) return "\u200B".repeat(Math.max(1, Math.min(200, Number.parseInt(value, 10) || 24)));
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
  if (name.includes("random string")) return Array.from({ length: 24 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
  if (name.includes("uuid generator")) return crypto.randomUUID();
  if (name.includes("password generator")) return `${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}A1!`;
  if (name.includes("slug generator")) return slugify(value);
  if (name.includes("username generator")) return `${slugify(value || "code tools").slice(0, 16)}_${Math.floor(Math.random() * 1000)}`;
  if (name.includes("cron generator")) return `# Every day at 09:00\n0 9 * * * ${value || "run-command"}`;
  if (name.includes("color picker")) return `${value}\nHEX: ${value.startsWith("#") ? value : rgbToHex(value)}\nRGB: ${value.startsWith("#") ? hexToRgb(value) : value}`;
  if (name.includes("image resizer")) return `Suggested sizes\nThumbnail: 320x180\nCard: 640x360\nHero: 1280x720\n\nSource note\n${value}`;
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
  if (name.includes("xml formatter") || name.includes("html formatter") || name.includes("xml beautifier") || name.includes("html beautifier")) {
    return value.replace(/></g, ">\n<");
  }
  if (name.includes("css formatter") || name.includes("css beautifier")) return value.replace(/\{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/\}/g, "\n}");
  if (name.includes("javascript formatter") || name.includes("js beautifier") || name.includes("python formatter") || name.includes("php formatter") || name.includes("java formatter") || name.includes("c# formatter") || name.includes("c/c++ formatter") || name.includes("go formatter")) {
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
  if (name.includes("ssl checker")) return `SSL check mock\nHost: ${value}\nStatus: valid\nProtocol: TLS 1.3\nExpires: future date`;
  if (name.includes("whois lookup")) return `WHOIS lookup mock\nDomain: ${value}\nRegistrar: Example Registrar\nStatus: active`;
  if (name.includes("dns lookup") || name.includes("dns record viewer") || name.includes("dns propagation")) return `DNS records for ${value}\nA     203.0.113.10\nAAAA  2001:db8::10\nMX    mail.${value.replace(/^https?:\/\//, "")}`;
  if (name.includes("ip lookup") || name.includes("ip information")) return `IP information\nInput: ${value}\nType: ${value.includes(":") ? "IPv6" : "IPv4"}\nNetwork: documentation range`;
  if (name.includes("user agent parser")) return `Browser: ${value.includes("Chrome") ? "Chrome-like" : "Unknown"}\nOS: ${value.includes("Windows") ? "Windows" : "Unknown"}\nRaw: ${value}`;
  if (name.includes("url scanner")) return `URL scan\nURL: ${value}\nScheme: ${value.startsWith("https") ? "HTTPS" : "Other"}\nRisk: ${value.includes(" ") ? "Check input" : "Low mock risk"}`;
  if (name.includes("security headers")) return "Recommended headers\nContent-Security-Policy\nStrict-Transport-Security\nX-Content-Type-Options: nosniff\nReferrer-Policy";
  if (name.includes("http headers")) return `GET / HTTP/1.1\nHost: ${value}\nUser-Agent: CodeTools AI\nAccept: */*`;
  if (name.includes("url extractor")) return value.match(/https?:\/\/[^\s]+/g)?.join("\n") ?? "No URLs found.";
  if (name.includes("ping test")) return `PING ${value}\n64 bytes from ${value}: time=23ms\n64 bytes from ${value}: time=21ms\nPackets: sent=2 received=2 lost=0`;
  if (name.includes("traceroute")) return `Traceroute to ${value}\n1  local.gateway  1 ms\n2  isp.example     8 ms\n3  ${value}        24 ms`;
  if (name.includes("domain checker")) return `${value}\nStatus: available check requires registrar API\nSyntax: ${/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value) ? "valid" : "check domain format"}`;
  if (name.includes("port scanner")) return value.split(/[,\s]+/).filter(Boolean).map((port) => `${port}: ${Number(port) % 2 === 0 ? "open" : "filtered"} (mock)`).join("\n");
  if (name.includes("subdomain finder")) return [`www.${value}`, `api.${value}`, `cdn.${value}`, `status.${value}`].join("\n");
  if (name.includes("http status checker")) return `${value}\nStatus: 200 OK (mock)`;
  if (name.includes("redirect checker")) return `${value}\n301 -> https://${value.replace(/^https?:\/\//, "")}\n200 -> final URL`;
  if (name.includes("url parser")) {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return `Protocol: ${url.protocol}\nHost: ${url.host}\nPath: ${url.pathname}\nQuery: ${url.search}`;
  }
  if (name.includes("query string parser")) {
    const query = value.includes("?") ? value.split("?")[1] : value;
    return Array.from(new URLSearchParams(query).entries()).map(([key, item]) => `${key}: ${item}`).join("\n") || "No query params found.";
  }
  if (name.includes("cidr calculator")) return `${value}\nNetwork: mock network range\nUsable hosts: depends on prefix length`;
  if (name.includes("ipv4 converter")) return value.split(".").map((part) => Number(part).toString(16).padStart(2, "0")).join("");
  if (name.includes("mac address lookup")) return `MAC prefix: ${value.slice(0, 8)}\nVendor: Example Networks (mock)`;
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
    return `// Mock ${tool.name}\n// Replace this processor with an API-backed converter when ready.\n\n${value}`;
  }

  return `${tool.name} result\n\nInput\n${value}\n\nThis is a front-end MVP page for ${tool.href}. A real processor can be connected here later.`;
}

export function DirectoryToolWorkspace({ tool }: { tool: DirectoryTool }) {
  const [input, setInput] = useState(sampleFor(tool));
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();
  const Icon = toolIcons[tool.iconName];

  const run = async () => {
    setLoading(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 250));
    try {
      setOutput(processTool(tool, input));
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

  return (
    <>
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
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">{tool.category}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{tool.name}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{tool.description}</p>
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
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-black text-slate-900">{t("online.output")}</label>
              <Button type="button" variant="outline" size="sm" disabled={!output} onClick={copy}>
                <Copy className="h-4 w-4" />
                {t("online.copy")}
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={!output} onClick={download}>
                <Download className="h-4 w-4" />
                {t("tool.download")}
              </Button>
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
          <Button type="button" variant="outline" onClick={() => { setInput(""); setOutput(""); setError(""); }}>
            <Trash2 className="h-4 w-4" />
            {t("online.clear")}
          </Button>
        </div>
        </section>
      </main>
      <ToolSeoContent title={tool.name} description={tool.description} category={tool.category} />
    </>
  );
}
