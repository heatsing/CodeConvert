"use client";

import { UploadCloud } from "lucide-react";
import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { readTextFile } from "@/lib/text-file";

type FileUploadProps = {
  onLoad: (content: string, fileName: string) => void;
  onError: (message: string) => void;
  resetVersion?: number;
};

const allowedExtensions = [".txt", ".js", ".py", ".java", ".ts"];
export function FileUpload({ onLoad, onError, resetVersion }: FileUploadProps) {
  const { t } = useI18n();
  const readVersion = useRef(0);

  useEffect(() => {
    readVersion.current += 1;
    return () => { readVersion.current += 1; };
  }, [resetVersion]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const version = ++readVersion.current;
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      onError(t("tool.unsupportedFile"));
      return;
    }

    try {
      const text = await readTextFile(file);
      if (version === readVersion.current) onLoad(text, file.name);
    } catch (error) {
      if (version === readVersion.current) onError(error instanceof Error ? error.message : t("tool.fileReadError"));
    }
  };

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-white px-4 py-6 text-center shadow-sm transition hover:border-violet-300 hover:bg-violet-50/40 focus-within:ring-2 focus-within:ring-violet-500">
      <UploadCloud className="h-6 w-6 text-violet-600" />
      <span className="text-sm font-semibold text-slate-800">{t("tool.uploadTitle")}</span>
      <span className="text-xs text-slate-500">{t("tool.uploadHelp")}</span>
      <input
        className="sr-only"
        type="file"
        accept=".txt,.js,.py,.java,.ts"
        aria-label={t("tool.uploadTitle")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          void handleFile(file);
        }}
      />
    </label>
  );
}
