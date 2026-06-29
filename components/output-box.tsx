"use client";

import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type OutputBoxProps = {
  label: string;
  placeholder: string;
  value: string;
  fileName: string;
  onCopy: () => void;
  onDownload: () => void;
};

export function OutputBox({ label, placeholder, value, onCopy, onDownload }: OutputBoxProps) {
  const { t } = useI18n();

  return (
    <div className="grid min-h-[360px] gap-3 rounded-lg border bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900">{label}</h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCopy} disabled={!value}>
            <Copy className="h-4 w-4" />
            {t("tool.copy")}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onDownload} disabled={!value}>
            <Download className="h-4 w-4" />
            {t("tool.download")}
          </Button>
        </div>
      </div>
      <pre className="code-scrollbar min-h-[290px] overflow-auto whitespace-pre-wrap rounded-md border bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100">
        {value || <span className="text-slate-400">{placeholder}</span>}
      </pre>
    </div>
  );
}
