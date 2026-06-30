"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe2, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { getCategoryId, getCategoryLabel } from "@/lib/home-tools";
import { translationLanguages, useI18n, type LanguageCode } from "@/lib/i18n";

type ThemeMode = "light" | "dark";

function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("codetools-theme");
    const initialTheme: ThemeMode = savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("codetools-theme", nextTheme);
  };

  const Icon = theme === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="grid h-8 w-8 place-items-center rounded-md text-slate-300 transition hover:bg-slate-800 hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label
      className="flex h-8 items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-2 text-[12px] font-black text-white"
      title={t("language.select")}
    >
      <Globe2 className="h-4 w-4 text-slate-400" />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        className="h-full cursor-pointer bg-transparent pr-1 font-black text-white outline-none"
        aria-label={t("language.select")}
      >
        {translationLanguages.map((item) => (
          <option key={item.code} value={item.code} title={item.label} className="text-slate-900">
            {item.code}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { t } = useI18n();
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  const navItems = [
    { label: t("nav.home"), href: "/", active: isHome },
    { label: getCategoryLabel(t("nav.text")), href: sectionHref("text") },
    { label: getCategoryLabel("Font Styles"), href: sectionHref(getCategoryId("Font Styles")) },
    { label: t("nav.encode"), href: sectionHref("encode") },
    { label: t("nav.decode"), href: sectionHref("decode") },
    { label: "Encoding", href: sectionHref("encoding") },
    { label: t("nav.convert"), href: sectionHref("convert") },
    { label: t("nav.utility"), href: sectionHref("utility") },
    { label: t("nav.format"), href: sectionHref("format") },
    { label: t("nav.security"), href: sectionHref("security") },
    { label: t("nav.network"), href: sectionHref("network") },
    { label: t("nav.regex"), href: sectionHref("regex") },
    { label: t("nav.online"), href: sectionHref("online") }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-lg">
      <div className="flex h-12 w-full items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-base font-black">
          <span className="text-orange-500">&lt;/&gt;</span>
          <span>
            <span className="text-orange-500">Code</span>Tools
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-4 pl-4 text-[11px] font-black uppercase tracking-wide xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.active ? "border-b-2 border-orange-500 py-4 text-white" : "py-4 text-slate-200 hover:text-white"}
            >
              {item.label}
            </a>
          ))}
          <a href={sectionHref("code")} className="flex items-center gap-1 py-4 text-slate-200 hover:text-white">
            {t("nav.more")}
            <ChevronDown className="h-3 w-3" />
          </a>
        </nav>

        <nav className="flex min-w-0 flex-1 gap-3 overflow-x-auto pl-1 text-[11px] font-black uppercase tracking-wide xl:hidden">
          {navItems.slice(1, 7).map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 py-4 text-slate-200 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
