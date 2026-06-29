"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeEditorBox } from "@/components/code-editor-box";
import { FAQSection } from "@/components/faq-section";
import { FileUpload } from "@/components/file-upload";
import { LanguageSelect } from "@/components/language-select";
import { OtherTools } from "@/components/other-tools";
import { OutputBox } from "@/components/output-box";
import { mockResult } from "@/lib/mock-ai";
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
  const Icon = toolIcons[tool.iconName];

  const languageSummary = useMemo(() => {
    if (tool.needsSourceLanguage && tool.needsTargetLanguage) return `${sourceLanguage} to ${targetLanguage}`;
    if (tool.needsTargetLanguage) return targetLanguage;
    return sourceLanguage;
  }, [sourceLanguage, targetLanguage, tool.needsSourceLanguage, tool.needsTargetLanguage]);

  const runTool = async () => {
    if (!input.trim()) {
      setError("Paste code or upload a file before running this tool.");
      setStatus("");
      return;
    }

    setError("");
    setStatus("");
    setLoading(true);
    try {
      const result = await mockResult({ tool, input, sourceLanguage, targetLanguage });
      setOutput(result);
      setStatus(`${tool.name} finished for ${languageSummary}.`);
    } catch {
      setError("Something went wrong while preparing the mock result.");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setStatus("Output copied to clipboard.");
      setError("");
    } catch {
      setError("Clipboard access failed. Select the output and copy it manually.");
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = tool.fileName;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Download started.");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setStatus("");
  };

  return (
    <main className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:py-10">
      <section className="rounded-lg border bg-white p-5 shadow-soft sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">Free developer tool</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{tool.title}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{tool.description}</p>
            </div>
          </div>
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 sm:min-w-72">
            {tool.needsSourceLanguage && (
              <LanguageSelect id="source-language" label="Input language" value={sourceLanguage} onChange={setSourceLanguage} />
            )}
            {tool.needsTargetLanguage && (
              <LanguageSelect id="target-language" label="Output language" value={targetLanguage} onChange={setTargetLanguage} />
            )}
          </div>
        </div>

        <div className="mt-6">
          <FileUpload
            onLoad={(content, fileName) => {
              setInput(content);
              setError("");
              setStatus(`${fileName} loaded.`);
            }}
            onError={setError}
          />
        </div>

        {(error || status) && (
          <div
            className={`mt-5 flex items-start gap-2 rounded-md border px-4 py-3 text-sm ${
              error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error || status}</span>
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <CodeEditorBox label={tool.inputLabel} placeholder={tool.inputPlaceholder} value={input} onChange={setInput} />
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
            {loading ? "Working..." : tool.actionLabel}
          </Button>
          <Button type="button" variant="outline" onClick={clearAll}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-slate-950">How to use this tool</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-3">
          {tool.howTo.map((step, index) => (
            <li key={step} className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <span className="mb-3 grid h-7 w-7 place-items-center rounded-full bg-violet-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <div id="faq">
        <FAQSection faqs={tool.faqs} />
      </div>
      <OtherTools currentSlug={tool.slug} />
    </main>
  );
}
