import type { ToolConfig, ToolSlug } from "@/lib/tools";

export type DirectoryTool = {
  name: string;
  description: string;
  category: string;
  href: string;
  iconName: ToolConfig["iconName"];
  accent: string;
};

const internalToolMap: Partial<Record<ToolSlug, string>> = {
  "code-converter": "Convert code between languages",
  "code-generator": "Generate code from prompts",
  "code-explainer": "Explain unfamiliar code",
  "comment-remover": "Remove code comments",
  "code-checker": "Find code issues",
  "code-to-pdf": "Prepare code documents"
};

export const categories = ["Popular", "Encode", "Decode", "Convert", "Utility", "Format", "Security", "Network", "Regex", "Code"] as const;

export const directoryTools: DirectoryTool[] = [
  { name: "Code Converter", description: internalToolMap["code-converter"]!, category: "Code", href: "/tools/code-converter", iconName: "code", accent: "text-blue-600 bg-blue-50" },
  { name: "Code Generator", description: internalToolMap["code-generator"]!, category: "Code", href: "/tools/code-generator", iconName: "wand", accent: "text-violet-600 bg-violet-50" },
  { name: "Code Explainer", description: internalToolMap["code-explainer"]!, category: "Code", href: "/tools/code-explainer", iconName: "message", accent: "text-cyan-600 bg-cyan-50" },
  { name: "Comment Remover", description: internalToolMap["comment-remover"]!, category: "Format", href: "/tools/comment-remover", iconName: "eraser", accent: "text-rose-600 bg-rose-50" },
  { name: "Code Checker", description: internalToolMap["code-checker"]!, category: "Code", href: "/tools/code-checker", iconName: "bug", accent: "text-amber-600 bg-amber-50" },
  { name: "Code to PDF", description: internalToolMap["code-to-pdf"]!, category: "Convert", href: "/tools/code-to-pdf", iconName: "fileText", accent: "text-emerald-600 bg-emerald-50" },
  { name: "JSON Formatter", description: "Format and validate JSON", category: "Popular", href: "/tools/code-checker", iconName: "code", accent: "text-emerald-600 bg-emerald-50" },
  { name: "Base64 Encode", description: "Encode text to Base64", category: "Encode", href: "/tools/code-generator", iconName: "wand", accent: "text-orange-600 bg-orange-50" },
  { name: "Base64 Decode", description: "Decode Base64 text", category: "Decode", href: "/tools/code-explainer", iconName: "message", accent: "text-teal-600 bg-teal-50" },
  { name: "URL Encode", description: "Encode URL strings", category: "Encode", href: "/tools/code-generator", iconName: "code", accent: "text-sky-600 bg-sky-50" },
  { name: "URL Decode", description: "Decode URL strings", category: "Decode", href: "/tools/code-explainer", iconName: "message", accent: "text-blue-600 bg-blue-50" },
  { name: "HTML Encode", description: "Escape HTML entities", category: "Encode", href: "/tools/code-converter", iconName: "code", accent: "text-yellow-600 bg-yellow-50" },
  { name: "HTML Decode", description: "Decode HTML entities", category: "Decode", href: "/tools/code-converter", iconName: "code", accent: "text-lime-600 bg-lime-50" },
  { name: "JavaScript Minifier", description: "Minify JS code", category: "Format", href: "/tools/comment-remover", iconName: "eraser", accent: "text-yellow-700 bg-yellow-50" },
  { name: "CSS Minifier", description: "Minify CSS code", category: "Format", href: "/tools/comment-remover", iconName: "eraser", accent: "text-indigo-600 bg-indigo-50" },
  { name: "Text Diff", description: "Compare two texts", category: "Utility", href: "/tools/code-checker", iconName: "bug", accent: "text-fuchsia-600 bg-fuchsia-50" },
  { name: "JWT Decode", description: "Decode JWT tokens", category: "Security", href: "/tools/code-explainer", iconName: "message", accent: "text-pink-600 bg-pink-50" },
  { name: "Hash Generator", description: "Generate hash values", category: "Security", href: "/tools/code-generator", iconName: "wand", accent: "text-slate-700 bg-slate-100" },
  { name: "Password Generator", description: "Create random passwords", category: "Security", href: "/tools/code-generator", iconName: "wand", accent: "text-amber-600 bg-amber-50" },
  { name: "QR Code Generator", description: "Create QR payload text", category: "Utility", href: "/tools/code-generator", iconName: "wand", accent: "text-slate-700 bg-slate-100" },
  { name: "CSV to JSON", description: "Convert CSV data", category: "Convert", href: "/tools/code-converter", iconName: "code", accent: "text-green-600 bg-green-50" },
  { name: "JSON to CSV", description: "Convert JSON arrays", category: "Convert", href: "/tools/code-converter", iconName: "code", accent: "text-green-600 bg-green-50" },
  { name: "Markdown to HTML", description: "Convert Markdown", category: "Convert", href: "/tools/code-converter", iconName: "code", accent: "text-blue-600 bg-blue-50" },
  { name: "HTML to Markdown", description: "Convert HTML", category: "Convert", href: "/tools/code-converter", iconName: "code", accent: "text-cyan-600 bg-cyan-50" },
  { name: "SQL Formatter", description: "Format SQL queries", category: "Format", href: "/tools/code-checker", iconName: "code", accent: "text-violet-600 bg-violet-50" },
  { name: "Python Formatter", description: "Format Python code", category: "Format", href: "/tools/code-checker", iconName: "code", accent: "text-blue-600 bg-blue-50" },
  { name: "Regex Tester", description: "Test regular expressions", category: "Regex", href: "/tools/code-checker", iconName: "bug", accent: "text-slate-700 bg-slate-100" },
  { name: "Regex Generator", description: "Draft regex patterns", category: "Regex", href: "/tools/code-generator", iconName: "wand", accent: "text-slate-700 bg-slate-100" },
  { name: "HTTP Headers", description: "Inspect header text", category: "Network", href: "/tools/code-explainer", iconName: "message", accent: "text-slate-700 bg-slate-100" },
  { name: "URL Extractor", description: "Extract URLs from text", category: "Network", href: "/tools/code-generator", iconName: "wand", accent: "text-teal-600 bg-teal-50" }
];

export const featuredTools = directoryTools.slice(6, 18);
export const frequentTools = directoryTools.slice(0, 24);
