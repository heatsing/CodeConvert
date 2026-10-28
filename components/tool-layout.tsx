"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeEditorBox } from "@/components/code-editor-box";
import { FileUpload } from "@/components/file-upload";
import { LanguageSelect } from "@/components/language-select";
import { OutputBox } from "@/components/output-box";
import { useI18n } from "@/lib/i18n";
import { runLocalTool } from "@/lib/mock-ai";
import { getCoreToolHeader } from "@/lib/tool-page-copy";
import { toolIcons } from "@/lib/tool-icons";
import type { ToolConfig } from "@/lib/tools";

type ToolLayoutProps = {
  tool: ToolConfig;
};

export function ToolLayout({ tool }: ToolLayoutProps) {
  const [sourceLanguage, setSourceLanguage] = useState("JavaScript");
  const [targetLanguage, setTargetLanguage] = useState("Python");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputVersion, setInputVersion] = useState(0);
  const runVersion = useRef(0);
  const running = useRef(false);
  const { t } = useI18n();
  const Icon = toolIcons[tool.iconName];
  const headerCopy = getCoreToolHeader(tool);
  const capabilityNotice = {
    "code-converter": "This tool prepares a migration worksheet; it does not automatically translate code.",
    "code-generator": "Generates a starter template only. It does not implement your prompt or call an AI service.",
    "code-explainer": "This is a local keyword-based structure summary, not a verified explanation of program behavior.",
    "comment-remover": "Safe comment removal supports JavaScript and TypeScript. String literals and line numbers are preserved.",
    "code-checker": "Local heuristic checks only. This is not a compiler, security audit, or proof that the code is correct.",
    "code-to-pdf": "This workspace produces a text document (.txt), not a PDF file."
  }[tool.slug];

  useEffect(() => () => { runVersion.current += 1; }, []);

  const invalidateResult = () => {
    runVersion.current += 1;
    running.current = false;
    setLoading(false);
    setOutput("");
    setError("");
    setStatus("");
  };

  const updateInput = (value: string) => {
    invalidateResult();
    setInputVersion((version) => version + 1);
    setInput(value);
  };

  const languageSummary = useMemo(() => {
    if (tool.needsSourceLanguage && tool.needsTargetLanguage) return `${sourceLanguage} to ${targetLanguage}`;
    if (tool.needsTargetLanguage) return targetLanguage;
    return sourceLanguage;
  }, [sourceLanguage, targetLanguage, tool.needsSourceLanguage, tool.needsTargetLanguage]);

  const runTool = async () => {
    if (running.current) return;
    if (!input.trim()) {
      setError(t("tool.emptyInput"));
      setStatus("");
      return;
    }

    setError("");
    setStatus("");
    setOutput("");
    setLoading(true);
    running.current = true;
    const version = ++runVersion.current;
    try {
      const result = await runLocalTool({ tool, input, sourceLanguage, targetLanguage });
      if (version !== runVersion.current) return;
      setOutput(result);
      setStatus(`${tool.name} ${t("tool.finished")} ${languageSummary}.`);
    } catch (error) {
      if (version === runVersion.current) setError(error instanceof Error ? error.message : t("tool.mockError"));
    } finally {
      if (version === runVersion.current) {
        running.current = false;
        setLoading(false);
      }
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    const version = runVersion.current;
    try {
      await navigator.clipboard.writeText(output);
      if (version !== runVersion.current) return;
      setStatus(t("tool.copied"));
      setError("");
    } catch {
      if (version === runVersion.current) setError(t("tool.clipboardError"));
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = tool.fileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(t("tool.downloadStarted"));
  };

  const clearAll = () => {
    updateInput("");
  };

  return (
    <>
      <section className="rounded-lg border bg-white p-5 shadow-soft sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">{headerCopy.eyebrow}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{headerCopy.title}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{headerCopy.description}</p>
            </div>
          </div>
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 sm:min-w-72">
            {tool.needsSourceLanguage && (
              <LanguageSelect id="source-language" label={t("tool.inputLanguage")} value={sourceLanguage} languages={tool.slug === "comment-remover" ? ["JavaScript", "TypeScript"] : undefined} onChange={(value) => { invalidateResult(); setSourceLanguage(value); }} />
            )}
            {tool.needsTargetLanguage && (
              <LanguageSelect id="target-language" label={t("tool.outputLanguage")} value={targetLanguage} languages={tool.slug === "code-generator" ? ["JavaScript", "TypeScript", "Python", "Java", "Go", "SQL"] : undefined} onChange={(value) => { invalidateResult(); setTargetLanguage(value); }} />
            )}
          </div>
        </div>

        <p className="mt-5 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{capabilityNotice}</p>

        <div className="mt-6">
          <FileUpload
            resetVersion={inputVersion}
            onLoad={(content, fileName) => {
              updateInput(content);
              setStatus(`${fileName} ${t("tool.fileLoaded")}`);
            }}
            onError={setError}
          />
        </div>

        {(error || status) && (
          <div
            role={error ? "alert" : "status"}
            className={`mt-5 flex items-start gap-2 rounded-md border px-4 py-3 text-sm ${
              error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error || status}</span>
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <CodeEditorBox label={tool.inputLabel} placeholder={tool.inputPlaceholder} value={input} onChange={updateInput} />
          <OutputBox
            label={tool.outputLabel}
            placeholder={tool.outputPlaceholder}
            value={output}
            fileName={tool.fileName}
            onCopy={copyOutput}
            onDownload={downloadOutput}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="button" variant="gradient" onClick={runTool} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? t("tool.working") : tool.actionLabel}
          </Button>
          <Button type="button" variant="outline" onClick={clearAll}>
            <Trash2 className="h-4 w-4" />
            {t("tool.clear")}
          </Button>
        </div>
      </section>

    </>
  );
}
