"use client";

import type { ToolConfig } from "@/lib/tools";
import { useI18n } from "@/lib/i18n";

export function FAQSection({ faqs }: { faqs: ToolConfig["faqs"] }) {
  const { t } = useI18n();

  return (
    <section className="rounded-lg border bg-white p-6 shadow-soft">
      <h2 className="text-xl font-bold text-slate-950">{t("tool.faqTitle")}</h2>
      <div className="mt-5 grid gap-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="group rounded-md border bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-bold text-slate-900">{faq.question}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
