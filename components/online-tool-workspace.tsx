"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Download, Loader2, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { OnlineTool } from "@/lib/online-tools";
import { getOnlineToolHeader } from "@/lib/tool-page-copy";
import { toolIcons } from "@/lib/tool-icons";

function runOnlineTool(tool: OnlineTool, input: string, sampleText: string) {
  const source = input.trim() || tool.sample;

  if (tool.mode === "json") {
    const parsed = JSON.parse(source);
    return JSON.stringify(parsed, null, 2);
  }

  if (tool.mode === "regex") {
    const literal = source.trim().match(/^\/(.+)\/([dgimsuvy]*)$/);
    const regex = literal ? new RegExp(literal[1], literal[2].includes("g") ? literal[2] : `${literal[2]}g`) : new RegExp(source, "g");
    const matches = Array.from(sampleText.matchAll(regex), (match) => match[0]);
    return matches.length
      ? `Pattern: ${regex.toString()}\nMatches (${matches.length})\n${matches.map((match, index) => `${index + 1}. ${match}`).join("\n")}`
      : `Pattern: ${regex.toString()}\nNo matches found in the test text.`;
  }

  if (tool.mode === "api") {
    return `HTTP/1.1 200 OK\ncontent-type: application/json\n\n${JSON.stringify(
      {
        ok: true,
        tool: tool.name,
        request: source,
        data: [{ id: 1, name: "Sample resource" }]
      },
      null,
      2
    )}`;
  }

  if (tool.mode === "redis") {
    return source
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const command = line.trim().toUpperCase();
        if (command.startsWith("SET ")) return `${line}\nOK`;
        if (command.startsWith("GET ")) return `${line}\n"hello"`;
        if (command === "PING") return "PING\nPONG";
        return `${line}\nQUEUED`;
      })
      .join("\n\n");
  }

  if (tool.mode === "database") {
    return `Database result preview\n\nInput\n${source}\n\nResult\n| id | name       | status |\n| 1  | demo_row   | active |\n| 2  | sample_row | draft  |`;
  }

  if (tool.mode === "ascii") {
    const parts = source.split("->").map((part) => part.trim()).filter(Boolean);
    return parts.length > 1 ? parts.map((part) => `[ ${part} ]`).join(" ---> ") : `[ ${source} ]`;
  }

  if (tool.mode === "visual") {
    return `Visual structure preview\n\n${source}\n\nSteps\n1. Parse the input.\n2. Build a readable visual representation.\n3. Prepare the structure for a shareable diagram or image.`;
  }

  if (tool.mode === "docs") {
    return `Generated draft\n\nTitle: ${tool.name} Output\n\n${source}\n\n- Summary prepared from your input.\n- Review the draft for project-specific details.\n- Copy or download the result when ready.`;
  }

  return `Execution preview for ${tool.name}\n\nInput\n${source}\n\nOutput\nProgram finished successfully.\nstdout: Hello from the sample runtime.`;
}

export function OnlineToolWorkspace({ tool }: { tool: OnlineTool }) {
  const [input, setInput] = useState(tool.sample);
  const [sampleText, setSampleText] = useState("Alice and Bob use alice@example.com. Ticket user-123 is open.");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();
  const Icon = toolIcons[tool.iconName];
  const headerCopy = getOnlineToolHeader(tool);

  const helperLabel = useMemo(() => {
    if (tool.mode === "regex") return t("online.testText");
    if (tool.mode === "api") return t("online.request");
    if (tool.mode === "redis") return t("online.commands");
    if (tool.mode === "database") return t("online.queryOrSchema");
    return t("online.input");
  }, [tool.mode, t]);

  const run = async () => {
    setLoading(true);
    setError("");
    setOutput("");
    await new Promise((resolve) => setTimeout(resolve, 350));
    try {
      setOutput(runOnlineTool(tool, input, sampleText));
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
    anchor.download = `${tool.slug}-output.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

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
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">{headerCopy.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{headerCopy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{headerCopy.description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="grid gap-3">
            <label className="text-sm font-black text-slate-900">{helperLabel}</label>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={tool.placeholder}
              className="code-scrollbar min-h-[320px] resize-y rounded-md border bg-slate-50 p-4 font-mono text-sm leading-6 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              spellCheck={false}
            />
            {tool.mode === "regex" && (
              <>
                <label className="text-sm font-black text-slate-900">{t("online.textToSearch")}</label>
                <textarea
                  value={sampleText}
                  onChange={(event) => setSampleText(event.target.value)}
                  className="min-h-24 resize-y rounded-md border bg-white p-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </>
            )}
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
          <Button type="button" variant="outline" onClick={clear}>
            <Trash2 className="h-4 w-4" />
            {t("online.clear")}
          </Button>
        </div>
        </section>
      </main>
  );
}
