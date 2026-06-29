"use client";

import { LANGUAGES } from "@/lib/languages";

type LanguageSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function LanguageSelect({ id, label, value, onChange }: LanguageSelectProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700" htmlFor={id}>
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      >
        {LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </label>
  );
}
