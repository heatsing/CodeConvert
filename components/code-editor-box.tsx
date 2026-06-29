"use client";

import { useI18n } from "@/lib/i18n";

type CodeEditorBoxProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function CodeEditorBox({ label, placeholder, value, onChange }: CodeEditorBoxProps) {
  const { t } = useI18n();

  return (
    <div className="grid min-h-[360px] gap-3 rounded-lg border bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">{label}</h2>
        <span className="text-xs font-medium text-slate-500">
          {value.length} {t("tool.chars")}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="code-scrollbar min-h-[290px] resize-y rounded-md border bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
      />
    </div>
  );
}
