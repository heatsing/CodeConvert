// These processors never execute input or send it to a service.
export const maxToolInputLength = 100_000;
export const maxToolOutputLength = 500_000;

export function assertToolInput(value: string) {
  if (value.length > maxToolInputLength) throw new Error("Input must be 100,000 characters or fewer.");
}

export function assertToolOutput(value: string) {
  if (typeof value !== "string") throw new Error("This tool requires a text result.");
  if (value.length > maxToolOutputLength) throw new Error("The result is too large. Use a smaller input.");
  return value;
}

function assertJsonInput(value: string) {
  assertToolInput(value);
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (const character of value) {
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') quoted = false;
    } else if (character === '"') quoted = true;
    else if (character === "{" || character === "[") {
      if (++depth > 100) throw new Error("JSON nesting must not exceed 100 levels.");
    } else if (character === "}" || character === "]") depth -= 1;
  }
}

export function parseJsonSafely(value: string): unknown {
  assertJsonInput(value);
  return JSON.parse(value, (_key, item: unknown) => {
    if (typeof item === "number" && (!Number.isFinite(item) || (Number.isInteger(item) && !Number.isSafeInteger(item)))) {
      throw new Error("This JSON contains a number outside JavaScript's safe range. Quote large IDs as strings before converting; use JSON Formatter to preserve numeric text.");
    }
    return item;
  });
}

export async function formatJson(value: string) {
  assertJsonInput(value);
  JSON.parse(value); // Validate syntax without using the parsed numbers in the output.
  const [{ format }, babel, estree] = await Promise.all([import("prettier/standalone"), import("prettier/plugins/babel"), import("prettier/plugins/estree")]);
  return assertToolOutput(await format(value, { parser: "json", plugins: [babel, estree] }));
}

export function minifyJson(value: string) {
  assertJsonInput(value);
  JSON.parse(value);
  // Preserve original string and number tokens; remove only inter-token whitespace.
  return value.match(/"(?:[^"\\]|\\[\s\S])*"|[^\s"]/g)?.join("") ?? "";
}

export function binaryToText(value: string) {
  const bits = value.replace(/\s/g, "");
  if (!/^(?:[01]{8})*$/.test(bits)) throw new Error("Enter complete 8-bit binary bytes containing only 0 and 1.");
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bits.match(/.{8}/g) ?? [], (byte) => Number.parseInt(byte, 2)));
}

export function textToBinary(value: string) {
  return Array.from(new TextEncoder().encode(value), (byte) => byte.toString(2).padStart(8, "0")).join(" ");
}

export function textToHex(value: string) {
  return Array.from(new TextEncoder().encode(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function hexToText(value: string) {
  const hex = value.replace(/\s/g, "");
  if (!/^(?:[a-f\d]{2})*$/i.test(hex)) throw new Error("Enter complete hexadecimal bytes (00 to FF).");
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16)));
}

export function unicodeEncode(value: string) {
  // JavaScript escapes represent UTF-16 code units, including both halves of a surrogate pair.
  return value.split("").map((unit) => `\\u${unit.charCodeAt(0).toString(16).padStart(4, "0")}`).join("");
}

export function unicodeDecode(value: string) {
  return value.replace(/\\u\{([0-9a-f]{1,6})\}|\\u([0-9a-f]{4})/gi, (_, point: string | undefined, unit: string | undefined) => {
    if (point) return String.fromCodePoint(Number.parseInt(point, 16));
    return String.fromCharCode(Number.parseInt(unit!, 16));
  });
}

export function reverseText(value: string) {
  const segments = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value);
  return Array.from(segments, ({ segment }) => segment).reverse().join("");
}

export function removeCharacters(value: string, characters: string) {
  const removed = new Set(Array.from(characters));
  return Array.from(value).filter((character) => !removed.has(character)).join("");
}

export function csvRows(value: string, separator = ",") {
  assertToolInput(value);
  if (!value) return [];
  const input = value.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let closedQuote = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') { quoted = false; closedQuote = true; }
      else field += char;
      continue;
    }
    if (char === separator) { row.push(field); field = ""; closedQuote = false; }
    else if (char === "\r" || char === "\n") {
      row.push(field); rows.push(row); row = []; field = ""; closedQuote = false;
      if (char === "\r" && input[index + 1] === "\n") index += 1;
    } else if (char === '"' && !field && !closedQuote) quoted = true;
    else {
      if (char === '"' || closedQuote) throw new Error("Invalid delimited text: quotes must wrap a complete field and be doubled inside it.");
      field += char;
    }
  }
  if (quoted) throw new Error("Invalid delimited text: an opening quote has no closing quote.");
  if (field || row.length || closedQuote || !/[\r\n]$/.test(input)) { row.push(field); rows.push(row); }
  return rows;
}

export function csvToJson(value: string, separator = ",") {
  const [headers = [], ...rows] = csvRows(value, separator);
  if (!headers.length) return "[]";
  if (headers.some((header) => !header) || new Set(headers).size !== headers.length) throw new Error("Column names must be nonempty and unique; duplicate columns would lose data.");
  // Repeating a long header for many short rows can amplify a small CSV dramatically.
  const headerLength = headers.reduce((length, header) => length + JSON.stringify(header).length, 0);
  if (headerLength * rows.length > maxToolOutputLength) throw new Error("JSON output is too large. Use fewer rows or shorter column names.");
  let outputLength = 4;
  const encodedRows = rows.map((row, index) => {
    if (row.length !== headers.length) throw new Error(`Row ${index + 2} has ${row.length} fields; expected ${headers.length}.`);
    const encoded = JSON.stringify(Object.fromEntries(headers.map((header, offset) => [header, row[offset]])), null, 2).replace(/^/gm, "  ");
    outputLength += encoded.length + (index ? 2 : 0);
    if (outputLength > maxToolOutputLength) throw new Error("JSON output is too large. Use fewer rows or shorter column names.");
    return encoded;
  });
  return encodedRows.length ? `[\n${encodedRows.join(",\n")}\n]` : "[]";
}

export function csvCell(value: unknown) {
  const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  // Spreadsheet software may evaluate formulas even when a CSV cell is quoted.
  const safe = typeof value === "string" && /^[\s]*[=+@-]|^[\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function jsonToCsv(value: string, separator = ",") {
  const data = parseJsonSafely(value);
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.every((row) => row !== null && typeof row === "object" && !Array.isArray(row))) throw new Error("Enter a JSON object or an array of JSON objects.");
  const records = rows as Record<string, unknown>[];
  const headers = Array.from(new Set(records.flatMap(Object.keys)));
  if (headers.length * records.length > 100_000) throw new Error("This table would exceed 100,000 cells. Use fewer records or columns.");
  let outputLength = 0;
  const encodeRow = (values: unknown[]) => {
    const cells = values.map((item) => {
      const cell = csvCell(item);
      outputLength += cell.length + separator.length;
      if (outputLength > maxToolOutputLength) throw new Error("CSV output is too large. Use fewer records or columns.");
      return cell;
    });
    outputLength += 2;
    return cells.join(separator);
  };
  return [encodeRow(headers), ...records.map((row) => encodeRow(headers.map((header) => Object.hasOwn(row, header) ? row[header] : undefined)))].join("\r\n");
}

export function decodeBase64Text(value: string) {
  const encoded = value.replace(/\s/g, "");
  if (!/^[A-Za-z\d+/]*={0,2}$/.test(encoded) || encoded.length % 4 === 1) throw new Error("Invalid Base64 input.");
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(encoded), (byte) => byte.charCodeAt(0)));
  } catch {
    throw new Error("Enter valid Base64 containing UTF-8 text. Binary data is not supported by this text decoder.");
  }
}

export function replaceLiteralText(text: string, find: string, replacement: string) {
  if (!find) throw new Error("Enter nonempty text to find.");
  const parts = text.split(find);
  const resultLength = text.length + (parts.length - 1) * (replacement.length - find.length);
  if (resultLength > maxToolOutputLength) throw new Error("Replacement output is too large. Use less text or a shorter replacement.");
  return parts.join(replacement);
}

export function urlBatch(value: string) {
  assertToolInput(value);
  const [base = "https://example.com", ...lines] = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 100) throw new Error("Use at most 100 URL parameters at a time.");
  const pairs = lines.map((line) => {
    const separator = line.indexOf("=");
    if (separator <= 0) throw new Error("Enter each parameter as name=value1,value2.");
    return { key: line.slice(0, separator), values: line.slice(separator + 1).split(",").map((item) => item.trim()) };
  });
  const count = Math.max(1, ...pairs.map((pair) => pair.values.length));
  if (count > 1000) throw new Error("Generate at most 1,000 URLs at a time.");
  let totalLength = 0;
  return Array.from({ length: count }, (_, index) => {
    const url = new URL(base.startsWith("http") ? base : `https://${base}`);
    pairs.forEach((pair) => url.searchParams.set(pair.key, pair.values[index % pair.values.length]));
    const result = url.toString();
    totalLength += result.length + 1;
    if (totalLength > maxToolOutputLength) throw new Error("Generated URLs are too large. Use fewer values or a shorter URL.");
    return result;
  }).join("\n");
}

export function baseConvert(value: string) {
  const [fromLine, toLine, numberLine, ...extra] = value.split(/\r?\n/);
  const from = Number(fromLine);
  const to = Number(toLine);
  if (extra.length || !Number.isInteger(from) || !Number.isInteger(to) || from < 2 || from > 36 || to < 2 || to > 36) throw new Error("Enter an input base, output base (2–36), and integer on three lines.");
  const integer = (numberLine ?? "").trim();
  if (!/^[+-]?[a-z\d]+$/i.test(integer) || integer.length > 4096) throw new Error("Enter a valid integer of at most 4,096 digits.");
  const negative = integer.startsWith("-");
  let parsed = BigInt(0);
  for (const digit of integer.replace(/^[+-]/, "").toLowerCase()) {
    const code = "0123456789abcdefghijklmnopqrstuvwxyz".indexOf(digit);
    if (code >= from) throw new Error(`Digit ${digit} is invalid in base ${from}.`);
    parsed = parsed * BigInt(from) + BigInt(code);
  }
  return (negative ? -parsed : parsed).toString(to).toUpperCase();
}

export function runLengthCodec(value: string) {
  if (/^\d+:/.test(value)) {
    const chunks: string[] = [];
    let length = 0;
    let offset = 0;
    const pattern = new RegExp("(\\d+):([\\s\\S])", "gu");
    for (const match of Array.from(value.matchAll(pattern))) {
      if (match.index !== offset) throw new Error("Invalid run-length encoding. Expected count:character pairs.");
      const count = Number(match[1]);
      length += count * match[2].length;
      if (!Number.isSafeInteger(count) || count < 1 || length > maxToolOutputLength) throw new Error("Expanded text is too large. Maximum output is 500,000 characters.");
      chunks.push(match[2].repeat(count));
      offset += match[0].length;
    }
    if (offset !== value.length) throw new Error("Invalid run-length encoding. Expected count:character pairs.");
    return chunks.join("");
  }
  return assertToolOutput(Array.from(value.matchAll(new RegExp("([\\s\\S])\\1*", "gu")), (match) => `${Array.from(match[0]).length}:${match[1]}`).join(""));
}

export async function digestText(value: string, algorithm: "SHA-1" | "SHA-256" | "SHA-512" = "SHA-256") {
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function generatePassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...Array.from(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeJwt(value: string) {
  const parts = value.trim().split(".");
  if (parts.length !== 3 || parts.slice(0, 2).some((part) => !/^[A-Za-z\d_-]+$/.test(part))) throw new Error("Enter a JWT with three Base64URL sections.");
  const decode = (part: string) => {
    const binary = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.stringify(parseJsonSafely(new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (byte) => byte.charCodeAt(0)))), null, 2);
  };
  return `UNVERIFIED: decoding does not verify the signature, issuer, audience, or expiry. Do not use this result to authorize access.\n\nHeader\n${decode(parts[0])}\n\nPayload\n${decode(parts[1])}\n\nSignature\n${parts[2] || "missing"}`;
}

export function parseXml(value: string) {
  if (/<!DOCTYPE|<!ENTITY/i.test(value)) throw new Error("XML document types and entities are not supported.");
  const document = new DOMParser().parseFromString(value, "application/xml");
  if (document.getElementsByTagName("parsererror").length) throw new Error("Invalid XML. Check the tags, attributes, and escaped characters.");
  return document;
}

export function xpathLookup(value: string) {
  const [path, ...lines] = value.split(/\r?\n/);
  if (!/^\/(?:[A-Za-z_][\w.-]*\/)*[A-Za-z_][\w.-]*$/.test(path)) throw new Error("Use a simple absolute element path, for example /root/user/name.");
  const document = parseXml(lines.join("\n"));
  const tags = path.slice(1).split("/");
  let nodes: Element[] = document.documentElement.tagName === tags[0] ? [document.documentElement] : [];
  for (const tag of tags.slice(1)) nodes = nodes.flatMap((node) => Array.from(node.children).filter((child) => child.tagName === tag));
  return nodes.map((node) => node.textContent ?? "").join("\n") || "No matching node found.";
}

export function jsonToXml(value: string) {
  const data = parseJsonSafely(value);
  const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  const element = (key: string, item: unknown, depth: number): string => {
    if (depth > 50) throw new Error("XML conversion supports up to 50 nested levels.");
    if (!/^[A-Za-z_][\w.-]*$/.test(key)) throw new Error(`JSON key ${JSON.stringify(key)} is not a valid XML element name.`);
    const contents = Array.isArray(item) ? item.map((child) => element("item", child, depth + 1)).join("")
      : item !== null && typeof item === "object" ? Object.entries(item).map(([childKey, child]) => element(childKey, child, depth + 1)).join("")
      : escape(item === null ? "" : String(item));
    return `<${key}>${contents}</${key}>`;
  };
  return assertToolOutput(element("root", data, 0));
}

export function xmlToJson(value: string) {
  const document = parseXml(value);
  const convert = (node: Element, depth: number): unknown => {
    if (depth > 50) throw new Error("JSON conversion supports up to 50 nested levels.");
    if (!node.children.length && !node.attributes.length) return node.textContent ?? "";
    const entries: Record<string, unknown> = Object.create(null);
    if (node.attributes.length) entries["@attributes"] = Object.fromEntries(Array.from(node.attributes, (attribute) => [attribute.name, attribute.value]));
    const text = Array.from(node.childNodes).filter((child) => child.nodeType === 3 || child.nodeType === 4).map((child) => child.textContent ?? "").join("");
    if (text.trim()) entries["#text"] = text;
    for (const child of Array.from(node.children)) {
      const converted = convert(child, depth + 1);
      if (Object.hasOwn(entries, child.tagName)) {
        if (Array.isArray(entries[child.tagName])) (entries[child.tagName] as unknown[]).push(converted);
        else entries[child.tagName] = [entries[child.tagName], converted];
      } else entries[child.tagName] = converted;
    }
    return entries;
  };
  return JSON.stringify({ [document.documentElement.tagName]: convert(document.documentElement, 0) }, null, 2);
}

export function unavailableToolReason(name: string) {
  const title = name.toLowerCase();
  const liveChecks = ["ssl checker", "whois lookup", "dns lookup", "dns record viewer", "dns propagation", "ip lookup", "ip information", "url scanner", "security headers", "http headers", "ping test", "traceroute", "port scanner", "subdomain finder", "http status checker", "redirect checker", "mac address lookup", "cidr calculator"];
  if (liveChecks.some((tool) => title.includes(tool))) return "This tool has no live checking service connected. No request was sent and no security or availability result can be determined.";
  if (/md5 generator|hmac generator|jwt encode|jwt verify|md5 decrypt|hash cracker/.test(title)) return "This cryptographic operation is not implemented. No hash, signed token, or verification result has been produced.";
  if (/sql formatter|json5|base62|base85|base91|pinyin|simplified traditional|qr code generator|barcode generator/.test(title)) return "This conversion is not implemented reliably yet. Your input has been kept unchanged; no result has been generated.";
  if (/css minifier|minify css|yaml to json|json to yaml|toml to json|ini to json|yaml to xml|xml to yaml|yaml to csv|csv to yaml|xml to csv|json to toml|json to ini/.test(title)) return "This conversion needs a format-specific parser that is not available yet. Your input has been kept unchanged.";
  if (/minify html|minify xml|html minifier|xml minifier|curl to php|quoted printable|wingdings translator|base64 to image|image to base64/.test(title)) return "This conversion is not implemented reliably yet. Your input has been kept unchanged; no result has been generated.";
  if (/^(css|scss|less|sass|stylus) to (css|scss|less|sass|stylus)/.test(title)) return "This preprocessor conversion is not implemented. Use a compiler for the requested language; your source has been kept unchanged.";
  if (/apa citation generator|unit test|code summarizer|code commenter|api code|sql query|shell script|dockerfile|code snippet|readme generator|code refactor|code optimizer/.test(title)) return "This generator is not connected to a code analysis or generation engine. No result has been generated from your input.";
  return null;
}

export async function formatSource(value: string, language: string) {
  const { format } = await import("prettier/standalone");
  if (language === "javascript" || language === "typescript") {
    const estree = await import("prettier/plugins/estree");
    if (language === "typescript") {
      const typescript = await import("prettier/plugins/typescript");
      return format(value, { parser: "typescript", plugins: [typescript, estree] });
    }
    const babel = await import("prettier/plugins/babel");
    return format(value, { parser: "babel", plugins: [babel, estree] });
  }
  if (language === "css" || language === "scss" || language === "less") {
    const postcss = await import("prettier/plugins/postcss");
    return format(value, { parser: language, plugins: [postcss] });
  }
  if (language === "html" || language === "vue" || language === "angular") {
    const html = await import("prettier/plugins/html");
    return format(value, { parser: language, plugins: [html] });
  }
  if (language === "yaml") {
    const yaml = await import("prettier/plugins/yaml");
    return format(value, { parser: "yaml", plugins: [yaml] });
  }
  if (language === "graphql") {
    const graphql = await import("prettier/plugins/graphql");
    return format(value, { parser: "graphql", plugins: [graphql] });
  }
  if (language === "markdown") {
    const markdown = await import("prettier/plugins/markdown");
    return format(value, { parser: "markdown", plugins: [markdown] });
  }
  throw new Error("A parser for this language is not available. Your source has been preserved unchanged.");
}

export async function minifyJavaScript(value: string) {
  const { minify } = await import("terser");
  const result = await minify(value);
  return result.code ?? "";
}

export async function compressText(value: string, format: "gzip" | "deflate") {
  const input = new Blob([new TextEncoder().encode(value)]).stream();
  const compressed = await new Response(input.pipeThrough(new CompressionStream(format))).arrayBuffer();
  // Chunking avoids exceeding the call stack for larger results.
  const bytes = new Uint8Array(compressed);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...Array.from(bytes.subarray(offset, offset + 8192)));
  return btoa(binary);
}

export function jsonToClass(value: string, language: "typescript" | "java" | "python" | "csharp") {
  const parsed = parseJsonSafely(value);
  const object = Array.isArray(parsed) ? parsed[0] : parsed;
  if (object === null || typeof object !== "object" || Array.isArray(object)) throw new Error("Enter a JSON object or a nonempty array of objects.");
  const entries = Object.entries(object);
  const reserved = new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null _ and as async await def del elif except exec from global in is lambda nonlocal not or pass print raise with yield None True False alias ascending base bool by checked decimal delegate descending dynamic equals event explicit extern fixed foreach group implicit into join let lock nameof namespace object on operator orderby out override params partial readonly ref sbyte sealed select sizeof stackalloc string struct uint ulong unchecked unsafe ushort using var virtual where __arglist __makeref __reftype __refvalue".split(" "));
  if (language !== "typescript" && entries.some(([key]) => !/^[A-Za-z_][A-Za-z\d_]*$/.test(key) || reserved.has(key))) throw new Error("A JSON key is not a valid field name in this language. Rename it explicitly before generating a model.");
  const typeFor = (item: unknown): string => {
    if (language === "python") {
      if (item === null) return "Any";
      if (Array.isArray(item)) return "list[Any]";
      if (typeof item === "object") return "dict[str, Any]";
      return typeof item === "number" ? Number.isInteger(item) ? "int" : "float" : typeof item === "boolean" ? "bool" : "str";
    }
    if (language === "java" || language === "csharp") {
      if (item === null) return language === "java" ? "Object" : "object";
      if (Array.isArray(item)) return language === "java" ? "List<Object>" : "List<object>";
      if (typeof item === "object") return language === "java" ? "Map<String, Object>" : "Dictionary<string, object>";
      return typeof item === "number" ? "double" : typeof item === "boolean" ? language === "java" ? "boolean" : "bool" : language === "java" ? "String" : "string";
    }
    return item === null ? "null" : Array.isArray(item) ? "unknown[]" : typeof item === "object" ? "Record<string, unknown>" : typeof item;
  };
  if (language === "typescript") return `interface GeneratedModel {\n${entries.map(([key, item]) => `  ${JSON.stringify(key)}: ${typeFor(item)};`).join("\n")}\n}`;
  if (language === "java") return `import java.util.List;\nimport java.util.Map;\n\npublic class GeneratedModel {\n${entries.map(([key, item]) => `  public ${typeFor(item)} ${key};`).join("\n")}\n}`;
  if (language === "csharp") return `using System.Collections.Generic;\n\npublic class GeneratedModel\n{\n${entries.map(([key, item]) => `    public ${typeFor(item)} ${key} { get; set; }`).join("\n")}\n}`;
  return `from dataclasses import dataclass\nfrom typing import Any\n\n@dataclass\nclass GeneratedModel:\n${entries.map(([key, item]) => `    ${key}: ${typeFor(item)}`).join("\n") || "    pass"}`;
}
