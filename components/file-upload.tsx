"use client";

import { UploadCloud } from "lucide-react";

type FileUploadProps = {
  onLoad: (content: string, fileName: string) => void;
  onError: (message: string) => void;
};

const allowedExtensions = [".txt", ".js", ".py", ".java", ".ts"];

export function FileUpload({ onLoad, onError }: FileUploadProps) {
  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      onError("Unsupported file type. Upload .txt, .js, .py, .java, or .ts files.");
      return;
    }

    try {
      const text = await file.text();
      onLoad(text, file.name);
    } catch {
      onError("Could not read that file. Please try another one.");
    }
  };

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-white px-4 py-6 text-center shadow-sm transition hover:border-violet-300 hover:bg-violet-50/40">
      <UploadCloud className="h-6 w-6 text-violet-600" />
      <span className="text-sm font-semibold text-slate-800">Upload a code file</span>
      <span className="text-xs text-slate-500">Supports .txt, .js, .py, .java, and .ts</span>
      <input
        className="sr-only"
        type="file"
        accept=".txt,.js,.py,.java,.ts"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </label>
  );
}
