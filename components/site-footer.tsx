"use client";

import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t bg-white px-4 py-5 text-center text-[13px] leading-7 text-slate-950">
      <div>
        <span>{t("footer.copyrightLine")}</span>
        <span> | {t("footer.lastUpdated")} | {t("footer.conceptBy")} </span>
        <a href="/" className="underline underline-offset-2 hover:text-blue-700">
          CodeConvert.net
        </a>
      </div>
      <div>
        <a href="/privacy-policy" className="underline underline-offset-2 hover:text-blue-700">
          {t("footer.privacyPolicy")}
        </a>
        <span> | </span>
        <a href="/terms-of-service" className="underline underline-offset-2 hover:text-blue-700">
          {t("footer.termsOfService")}
        </a>
        <span> | </span>
        <a href="/sitemap.xml" className="underline underline-offset-2 hover:text-blue-700">
          {t("footer.siteMap")}
        </a>
      </div>
    </footer>
  );
}
