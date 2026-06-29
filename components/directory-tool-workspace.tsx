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
  if (name.includes("json")) return '{"name":"CodeTools","items":[1,2,3]}';
  if (name.includes("url")) return "https://example.com/search?q=code tools";
  if (name.includes("base64")) return "CodeTools AI";
  if (name.includes("html")) return "<section>Hello & welcome</section>";
  if (name.includes("csv")) return "id,name\n1,Alice\n2,Bob";
  if (name.includes("hex")) return "Hello";
  if (name.includes("binary")) return "Hello";
  if (name.includes("password")) return "CorrectHorseBatteryStaple!";
  if (name.includes("regex")) return "\\w+@\\w+\\.com";
  if (name.includes("ping")) return "example.com";
  return `Paste input for ${tool.name}`;
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
