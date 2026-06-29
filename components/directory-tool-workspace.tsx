"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Loader2, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolSeoContent } from "@/components/tool-seo-content";
import type { DirectoryTool } from "@/lib/home-tools";
import { useI18n } from "@/lib/i18n";
import { toolIcons } from "@/lib/tool-icons";

function sampleFor(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
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
  if (name.includes("json") && name.includes("format")) {
    return JSON.stringify(JSON.parse(value), null, 2);
  }
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
