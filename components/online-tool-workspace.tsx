"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Download, Loader2, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { OnlineTool } from "@/lib/online-tools";
import { getOnlineToolHeader } from "@/lib/tool-page-copy";
import { toolIcons } from "@/lib/tool-icons";
import { canRunOnlineTool, runOnlineTool } from "@/lib/online-tool-runner";

export function OnlineToolWorkspace({ tool }: { tool: OnlineTool }) {
  const [input, setInput] = useState(tool.sample);
  const [sampleText, setSampleText] = useState("Alice and Bob use alice@example.com. Ticket user-123 is open.");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const runVersion = useRef(0);
  const running = useRef(false);
  const inputId = useId();
  const testTextId = useId();
  const outputId = useId();
  const { t } = useI18n();
  const Icon = toolIcons[tool.iconName];
  const headerCopy = getOnlineToolHeader(tool);
  const available = canRunOnlineTool(tool);

  useEffect(() => () => { runVersion.current += 1; }, []);

  const invalidateResult = () => {
    runVersion.current += 1;
    running.current = false;
    setLoading(false);
    setOutput("");
    setError("");
    setStatus("");
  };

  const helperLabel = useMemo(() => {
    if (tool.mode === "regex") return t("online.testText");
    if (tool.mode === "api") return t("online.request");
    if (tool.mode === "redis") return t("online.commands");
    if (tool.mode === "database") return t("online.queryOrSchema");
    return t("online.input");
  }, [tool.mode, t]);

  const run = async () => {
    if (running.current || !available) return;
    const version = ++runVersion.current;
    running.current = true;
    setLoading(true);
    setError("");
    setStatus("");
    setOutput("");
    try {
      const result = await runOnlineTool(tool, input, sampleText);
      if (version === runVersion.current) {
        setOutput(result);
        setStatus(t("online.completed"));
      }
    } catch (err) {
      if (version === runVersion.current) setError(err instanceof Error ? err.message : t("online.processError"));
    } finally {
      if (version === runVersion.current) {
        running.current = false;
        setLoading(false);
      }
    }
  };

  const copy = async () => {
    if (!output) return;
    const version = runVersion.current;
    try {
      await navigator.clipboard.writeText(output);
      if (version === runVersion.current) {
        setError("");
        setStatus(t("tool.copied"));
      }
    } catch {
      if (version === runVersion.current) setError(t("tool.clipboardError"));
    }
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${tool.slug}-output.txt`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(t("tool.downloadStarted"));
  };

  const clear = () => {
    invalidateResult();
    setInput("");
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

        {!available && (
          <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Execution is not available for this workspace. You can edit the sample, but this page does not run code, send requests, or connect to a database.
          </p>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="grid gap-3">
            <label htmlFor={inputId} className="text-sm font-black text-slate-900">{helperLabel}</label>
            <textarea
              id={inputId}
              value={input}
              onChange={(event) => { invalidateResult(); setInput(event.target.value); }}
              placeholder={tool.placeholder}
              className="code-scrollbar min-h-[320px] resize-y rounded-md border bg-slate-50 p-4 font-mono text-sm leading-6 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              spellCheck={false}
            />
            {tool.mode === "regex" && (
              <>
                <label htmlFor={testTextId} className="text-sm font-black text-slate-900">{t("online.textToSearch")}</label>
                <textarea
                  id={testTextId}
                  value={sampleText}
                  onChange={(event) => { invalidateResult(); setSampleText(event.target.value); }}
                  className="min-h-24 resize-y rounded-md border bg-white p-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </>
            )}
          </div>

          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span id={outputId} className="text-sm font-black text-slate-900">{t("online.output")}</span>
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
            <pre tabIndex={0} role="region" aria-labelledby={outputId} className="code-scrollbar min-h-[320px] overflow-auto whitespace-pre-wrap rounded-md border bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100">
              {output || <span className="text-slate-400">{available ? t("online.outputPlaceholder") : "Execution is unavailable for this workspace."}</span>}
            </pre>
            {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
            {status && <p role="status" className="text-sm text-emerald-700">{status}</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="gradient" onClick={run} disabled={loading || !available}>
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
