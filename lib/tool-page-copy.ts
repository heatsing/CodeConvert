import { getCategoryLabel, type DirectoryTool } from "@/lib/home-tools";
import type { OnlineTool } from "@/lib/online-tools";
import type { ToolConfig } from "@/lib/tools";

export type ToolHeaderCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

function getConversionPair(title: string) {
  const match = title.match(/^(.+?) to (.+?) Converter$/i);
  if (!match) return null;

  return {
    from: match[1],
    to: match[2]
  };
}

function cleanToolName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

function lowerFirst(value: string) {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
}

function trimSentence(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const clipped = normalized.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 110 ? lastSpace : maxLength - 1).replace(/[,.]\s*$/, "")}.`;
}

function verbForName(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("encode")) return "encode";
  if (lowerName.includes("decode")) return "decode";
  if (lowerName.includes("format") || lowerName.includes("beautifier")) return "format and beautify";
  if (lowerName.includes("minifier") || lowerName.includes("minify")) return "minify";
  if (lowerName.includes("validator") || lowerName.includes("checker") || lowerName.includes("tester")) return "check and validate";
  if (lowerName.includes("generator")) return "generate";
  if (lowerName.includes("translator")) return "translate";
  if (lowerName.includes("remover") || lowerName.includes("remove")) return "remove";
  if (lowerName.includes("counter")) return "count";
  if (lowerName.includes("viewer")) return "view";
  if (lowerName.includes("converter") || lowerName.includes("convert")) return "convert";
  if (lowerName.includes("sort")) return "sort";
  return "process";
}

function metaActionForName(name: string, category: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("base64")) return "encode, decode, or convert Base64 text and developer data";
  if (lowerName.includes("url")) return "encode, decode, format, or inspect URL text and parameters";
  if (lowerName.includes("jwt")) return "create, decode, inspect, or validate JWT-style token text";
  if (lowerName.includes("json")) return "format, validate, convert, or inspect JSON data";
  if (lowerName.includes("xml")) return "format, validate, convert, or inspect XML markup";
  if (lowerName.includes("yaml")) return "format, validate, convert, or inspect YAML data";
  if (lowerName.includes("html")) return "format, encode, decode, minify, or inspect HTML markup";
  if (lowerName.includes("css") || lowerName.includes("scss") || lowerName.includes("less")) return "format, beautify, minify, or validate stylesheet code";
  if (lowerName.includes("javascript") || lowerName.includes("typescript")) return "format, validate, convert, or clean JavaScript and TypeScript code";
  if (lowerName.includes("regex")) return "test, generate, explain, or transform regular expressions";
  if (lowerName.includes("hash") || lowerName.includes("md5") || lowerName.includes("sha")) return "generate, inspect, or verify hash values";
  if (lowerName.includes("password")) return "generate or inspect password text for safer workflows";
  if (lowerName.includes("dns") || lowerName.includes("ip") || lowerName.includes("whois") || lowerName.includes("domain")) return "inspect network, DNS, IP, or domain data";
  if (lowerName.includes("formatter") || lowerName.includes("beautifier")) return "format and beautify code or structured data";
  if (lowerName.includes("minifier") || lowerName.includes("minify")) return "minify code and remove extra whitespace";
  if (lowerName.includes("encode") || lowerName.includes("encoder")) return "encode text, URLs, code, or developer data";
  if (lowerName.includes("decode") || lowerName.includes("decoder")) return "decode encoded strings, tokens, or developer data";
  if (lowerName.includes("converter") || lowerName.includes("convert")) return "convert text, code, data, or formats";
  if (lowerName.includes("generator")) return "generate useful developer output";
  if (lowerName.includes("validator") || lowerName.includes("checker") || lowerName.includes("tester")) return "check, validate, and inspect developer input";
  if (lowerName.includes("remover") || lowerName.includes("remove")) return "remove unwanted text, code, formatting, or characters";
  if (lowerName.includes("counter")) return "count and analyze text or developer input";
  if (lowerName.includes("translator")) return "translate text, symbols, code, or encoded data";
  return `process ${getCategoryLabel(category).toLowerCase()} input`;
}

function textTitle(tool: DirectoryTool) {
  const titles: Record<string, string> = {
    "APA Citation Generator": "Generate APA Citations from Text",
    "Character Remover": "Remove Specific Letters and Characters from Text",
    "Duplicate Line Remover": "Remove Duplicate Lines from Text",
    "Duplicate Word Finder": "Find Duplicate Words in Text",
    "Em Dash Remover": "Replace Em Dashes in Text",
    "Find and Replace Text": "Find and Replace Words or Phrases in Text",
    "Invisible Text Generator": "Generate Invisible Unicode Text",
    "NATO Phonetic Alphabet Translator": "Translate Text into NATO Phonetic Spelling",
    "Online Notepad": "Write and Clean Notes Online",
    "Online Sentence Counter": "Count Sentences in Text",
    "Phonetic Spelling Tool": "Turn Words into Phonetic Spelling",
    "Pig Latin Translator": "Translate Text into Pig Latin",
    "Plain Text Converter": "Convert Rich Text to Plain Text",
    "Remove Line Breaks": "Remove Line Breaks from Text",
    "Remove Text Formatting": "Remove Formatting from Pasted Text",
    "Remove Underscores": "Remove Underscores from Text",
    "Repeat Text Generator": "Repeat Text Multiple Times",
    "Reverse Text Generator": "Reverse Text Online",
    "Roman Numeral Dates": "Convert Dates to Roman Numerals",
    "Sentence Case Converter": "Convert Text to Sentence Case",
    "Sort Words Alphabetically": "Sort Words Alphabetically Online",
    "Title Case Converter": "Convert Text to Title Case",
    "Whitespace Remover": "Remove Extra Whitespace from Text",
    "Wingdings Translator": "Translate Wingdings and Symbol Text",
    "Word Counter": "Count Words in Text",
    "Character Counter": "Count Characters in Text",
    "Word Cloud Generator": "Generate Word Frequency Output",
    "Word Frequency Counter": "Count Word Frequency in Text"
  };

  return titles[tool.name] ?? `${tool.name} Online`;
}

function textDescription(tool: DirectoryTool) {
  if (tool.name === "Character Remover") {
    return "Transform your text by removing unwanted characters with precision and ease. Whether you are cleaning data for a presentation, preparing content for a database, or standardizing information across your organization, this character removal tool helps you get exactly the result you need.";
  }

  const action = verbForName(tool.name);
  const purpose = tool.description.replace(/\.$/, "").toLowerCase();
  return `Transform pasted text with a focused ${tool.name} workspace built to ${action} content quickly and accurately. Use it to ${purpose}, clean up copied material, prepare structured data, or standardize text before sharing, publishing, or importing it into another system.`;
}

function fontTitle(tool: DirectoryTool) {
  return `${tool.name} for Social Profiles and Posts`;
}

function fontDescription(tool: DirectoryTool) {
  return `Transform ordinary text into styled Unicode characters with ${tool.name}. Create decorative text for bios, captions, usernames, messages, and short posts, then copy the result directly from the browser.`;
}

function directoryTitle(tool: DirectoryTool) {
  const pair = getConversionPair(tool.name);
  if (pair) return `Convert ${pair.from} Code to ${pair.to} Online`;
  if (tool.category === "Text") return textTitle(tool);
  if (tool.category === "Font Styles") return fontTitle(tool);

  const lowerName = tool.name.toLowerCase();
  if (lowerName.includes("code to image")) return "Create Shareable Code Images Online";
  if (lowerName.includes("binary code translator")) return "Translate Binary Code to Text Online";
  if (lowerName.includes("formatter")) return `Format ${tool.name.replace(/\s*Formatter$/i, "")} Online`;
  if (lowerName.includes("beautifier")) return `Beautify ${tool.name.replace(/\s*Beautifier$/i, "")} Online`;
  if (lowerName.includes("encode and decode") || lowerName.includes("encoder/decoder")) return `${tool.name} Online`;
  if (lowerName.includes("encode")) return `${tool.name} Online`;
  if (lowerName.includes("decode")) return `${tool.name} Online`;
  if (lowerName.includes("validator")) return `Validate ${tool.name.replace(/\s*Validator$/i, "")} Online`;
  if (lowerName.includes("generator")) return `${tool.name} Online`;
  if (lowerName.includes("converter")) return `${tool.name} Online`;
  if (lowerName.includes("translator")) return `${tool.name} Online`;

  return `Use ${tool.name} Online`;
}

function directoryDescription(tool: DirectoryTool) {
  if (tool.category === "Text") return textDescription(tool);
  if (tool.category === "Font Styles") return fontDescription(tool);

  const pair = getConversionPair(tool.name);
  if (pair) {
    return `Convert ${pair.from} code to ${pair.to} code in a clean browser workspace. Paste or upload your source code, run the converter, review the generated ${pair.to} output, then copy or download the result for your next development step.`;
  }

  const lowerName = tool.name.toLowerCase();
  if (lowerName.includes("code to image")) {
    return "Turn pasted code into a clean, shareable image-style preview for documentation, tutorials, social posts, and team notes. Adjust your snippet in the editor, generate the preview, then copy or download the output for easy sharing.";
  }

  if (tool.headerDescription) return tool.headerDescription;

  const action = verbForName(tool.name);
  const category = getCategoryLabel(tool.category).toLowerCase();
  return `Use ${tool.name} to ${action} ${category} input in a fast online workspace. Paste text, code, URLs, tokens, or structured data, run the tool instantly, then copy or download a clean result without installing extra software.`;
}

export function getDirectoryToolHeader(tool: DirectoryTool): ToolHeaderCopy {
  return {
    eyebrow: getCategoryLabel(tool.category),
    title: directoryTitle(tool),
    description: directoryDescription(tool)
  };
}

function onlineTitle(tool: OnlineTool) {
  const lowerName = tool.name.toLowerCase();
  if (lowerName.includes("code to image")) return "Create Shareable Code Images Online";
  if (tool.mode === "regex") return `${tool.name} for Testing and Visualizing Patterns`;
  if (tool.mode === "api") return `${tool.name} for API Requests and Mock Responses`;
  if (tool.mode === "redis") return `${tool.name} Command Testing Workspace`;
  if (tool.mode === "database") return `${tool.name} Database Design Workspace`;
  if (tool.mode === "ascii") return `${tool.name} Diagram Text Generator`;
  if (tool.mode === "visual") return `${tool.name} Visual Preview Tool`;
  if (tool.mode === "docs") return `${tool.name} Documentation Drafting Tool`;
  if (tool.mode === "json") return `${tool.name} JSON Formatting Workspace`;
  return `${tool.name} Online Coding Workspace`;
}

function onlineDescription(tool: OnlineTool) {
  const lowerName = tool.name.toLowerCase();
  if (lowerName.includes("code to image")) {
    return "Turn pasted code into a clean, shareable image-style preview for documentation, tutorials, social posts, and team notes. Paste your snippet, generate a polished code card preview, then copy or download the output for easy sharing.";
  }

  const modeCopy: Record<string, string> = {
    regex: "Build, test, and explain regular expressions against sample text before using them in production code.",
    api: "Draft API requests, inspect mock responses, and document endpoint behavior in one focused browser workspace.",
    redis: "Practice Redis-style commands and review simulated responses before moving commands into a real terminal.",
    database: "Sketch schemas, queries, and table ideas, then preview a readable mock database result.",
    ascii: "Convert structured notes into readable ASCII-style diagrams for docs, issues, and technical planning.",
    visual: "Convert plain input into a structured visual preview that is easier to explain, review, and share.",
    docs: "Turn notes, prompts, or repository content into a readable draft that you can refine and reuse.",
    json: "Format, validate, and inspect JSON-like data in a clean two-panel browser workspace.",
    code: "Write or paste code snippets, run the simulated workspace, and review output without leaving the browser."
  };

  return `${modeCopy[tool.mode] ?? modeCopy.code} ${tool.name} keeps input and output side by side so you can iterate quickly, copy useful results, and download the final text when you are done.`;
}

export function getOnlineToolHeader(tool: OnlineTool): ToolHeaderCopy {
  return {
    eyebrow: "Developer Tools",
    title: onlineTitle(tool),
    description: onlineDescription(tool)
  };
}

export function getCoreToolHeader(tool: ToolConfig): ToolHeaderCopy {
  const titles: Record<string, string> = {
    "code-converter": "Convert Code Between Programming Languages Online",
    "code-generator": "Generate Useful Code from Plain English Prompts",
    "code-explainer": "Explain Code in Clear, Practical Language",
    "comment-remover": "Remove Comments from Code Without Changing the Logic",
    "code-checker": "Check Code for Bugs, Readability, and Practical Issues",
    "code-to-pdf": "Prepare Code for Clean PDF-Style Documents"
  };

  const descriptions: Record<string, string> = {
    "code-converter": "Convert source code from one programming language to another in a clean two-panel workspace. Paste or upload your snippet, choose the source and target languages, then copy or download the generated output for review.",
    "code-generator": "Describe what you want to build and generate starter code in your chosen language. Use the result for prototypes, examples, tests, and implementation notes before connecting the workflow to a real AI API.",
    "code-explainer": "Paste unfamiliar code and turn it into a readable explanation of the main behavior, inputs, outputs, and likely edge cases. Use it to review snippets faster and understand logic before editing.",
    "comment-remover": "Remove inline and block comments from code while keeping the original structure easy to review. Clean pasted snippets for examples, documentation, or compact sharing without manually editing every line.",
    "code-checker": "Review code for practical issues, syntax concerns, readability problems, and improvement ideas. Paste or upload a snippet, run the checker, then use the output as a focused debugging checklist.",
    "code-to-pdf": "Prepare source code as tidy document-style text that can be copied, downloaded, or used in a future PDF export workflow. Keep formatting readable for reports, handoffs, and code review notes."
  };

  return {
    eyebrow: "Free Code Tool",
    title: titles[tool.slug] ?? tool.title,
    description: descriptions[tool.slug] ?? `${cleanToolName(tool.name)} helps you ${lowerFirst(tool.description)}. Paste your input, run the tool, then copy or download the result from a clean browser workspace.`
  };
}

export function getCoreToolMetaDescription(tool: ToolConfig) {
  const descriptions: Record<string, string> = {
    "code-converter": "Free code converter online. Convert code between programming languages, upload files, then copy or download clean output in your browser.",
    "code-generator": "Free code generator online. Turn prompts into starter code for popular languages, then copy or download editable output. No signup required.",
    "code-explainer": "Free code explainer online. Paste code to get a clear explanation of behavior, inputs, outputs, and edge cases in a fast browser workspace.",
    "comment-remover": "Free comment remover online. Remove inline and block comments from code, keep structure readable, then copy or download the cleaned result.",
    "code-checker": "Free code checker online. Inspect snippets for bugs, syntax issues, readability problems, and improvement ideas before editing or sharing.",
    "code-to-pdf": "Free code to PDF prep tool online. Format source code as clean document-style text for reports, handoffs, downloads, and future PDF export."
  };

  return descriptions[tool.slug] ?? trimSentence(`Free ${tool.name} online. ${tool.description} Paste input, run the tool, then copy or download the result.`);
}

export function getDirectoryToolMetaDescription(tool: DirectoryTool) {
  const pair = getConversionPair(tool.name);
  if (pair) {
    return trimSentence(`Free ${pair.from} to ${pair.to} converter online. Paste ${pair.from} code, run the converter, then copy or download clean ${pair.to} output.`);
  }

  if (tool.category === "Text") {
    return trimSentence(`Free ${tool.name} online. ${textTitle(tool).toLowerCase()}, clean pasted text instantly, then copy or download the result. No signup required.`);
  }

  if (tool.category === "Font Styles") {
    return trimSentence(`Free ${tool.name} online. Convert normal text into Unicode font styles for bios, captions, usernames, and posts, then copy the result.`);
  }

  const action = metaActionForName(tool.name, tool.category);
  return trimSentence(`Free ${tool.name} online. Use this ${getCategoryLabel(tool.category).toLowerCase()} tool to ${action}, then copy or download the result. No signup required.`);
}

export function getOnlineToolMetaDescription(tool: OnlineTool) {
  if (tool.name.toLowerCase().includes("code to image")) {
    return "Free Code to Image tool online. Create shareable code image previews for docs, tutorials, and social posts, then copy or download the result.";
  }

  const modeCopy: Record<string, string> = {
    regex: "test regular expressions against sample text",
    api: "draft API requests and inspect mock responses",
    redis: "practice Redis commands with simulated output",
    database: "sketch schemas, queries, and mock database results",
    ascii: "create ASCII-style diagrams from structured notes",
    visual: "turn plain input into readable visual preview output",
    docs: "draft documentation, wiki notes, and project summaries",
    json: "format, validate, and inspect JSON data",
    code: "write, run, and review code snippets in a browser workspace"
  };

  return trimSentence(`Free ${tool.name} online. Use this developer tool to ${modeCopy[tool.mode] ?? modeCopy.code}, then copy or download the result. No signup required.`);
}
