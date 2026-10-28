"use client";

import { useI18n } from "@/lib/i18n";

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  const { language } = useI18n();
  const chinese = language === "CN" || language === "TW";
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold">{chinese ? "页面暂时无法加载" : "This page could not load"}</h1>
      <p role="alert" className="my-4">{chinese ? "请重试，或返回工具目录。" : "Try again, or return to the tools directory."}</p>
      <button type="button" onClick={retry} className="mr-4 rounded border px-4 py-2">{chinese ? "重试" : "Try again"}</button>
      <a href="/" className="underline">{chinese ? "全部工具" : "All tools"}</a>
    </main>
  );
}
