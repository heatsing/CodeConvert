"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-white/90 text-[12px] text-slate-600 dark:bg-slate-950/95">
      <div className="grid w-full gap-5 px-4 py-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center" aria-label="CodeConvert.net home">
            <Image
              src="/codeconvert-logo.png"
              alt="CodeConvert.net"
              width={1152}
              height={217}
              className="h-8 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-md leading-5">{t("footer.description")}</p>
        </div>

        <div>
          <h2 className="font-black text-slate-950">{t("footer.tools")}</h2>
          <nav className="mt-3 grid gap-2">
            <a href="/#popular" className="hover:text-blue-700">{t("footer.popular")}</a>
            <a href="/#language-tools" className="hover:text-blue-700">{t("footer.language")}</a>
            <a href="/#online" className="hover:text-blue-700">{t("footer.online")}</a>
          </nav>
        </div>

        <div>
          <h2 className="font-black text-slate-950">{t("footer.resources")}</h2>
          <nav className="mt-3 grid gap-2">
            <Link href="/code-converter" className="hover:text-blue-700">Code Converter</Link>
            <Link href="/code-generator" className="hover:text-blue-700">Code Generator</Link>
            <Link href="/code-checker" className="hover:text-blue-700">Code Checker</Link>
          </nav>
        </div>

        <div>
          <h2 className="font-black text-slate-950">{t("footer.company")}</h2>
          <nav className="mt-3 grid gap-2">
            <a href="mailto:hello@codetools.example" className="hover:text-blue-700">{t("footer.feedback")}</a>
            <a href="/#top" className="hover:text-blue-700">{t("footer.about")}</a>
            <a href="/#top" className="hover:text-blue-700">{t("footer.api")}</a>
          </nav>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
        <p>© {year} CodeConvert.net. {t("footer.copyright")}</p>
        <div className="flex gap-4">
          <a href="/#top" className="hover:text-blue-700">{t("footer.privacy")}</a>
          <a href="/#top" className="hover:text-blue-700">{t("footer.terms")}</a>
        </div>
      </div>
    </footer>
  );
}
