"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe2, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { getCategoryId } from "@/lib/home-tools";
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
      className="grid h-8 w-8 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label
      className="flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-2 text-[12px] font-black text-slate-900 shadow-sm"
      title={t("language.select")}
    >
      <Globe2 className="h-4 w-4 text-slate-500" />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        className="h-full cursor-pointer bg-transparent pr-1 font-black text-slate-900 outline-none"
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
    { label: t("category.text"), href: sectionHref("text") },
    { label: t("category.fontStyles"), href: sectionHref(getCategoryId("Font Styles")) },
    { label: t("nav.encode"), href: sectionHref("encode") },
    { label: t("nav.decode"), href: sectionHref("decode") },
    { label: t("category.encoding"), href: sectionHref("encoding") },
    { label: t("nav.convert"), href: sectionHref("convert") },
    { label: t("nav.utility"), href: sectionHref("utility") },
    { label: t("nav.format"), href: sectionHref("format") },
    { label: t("nav.security"), href: sectionHref("security") },
    { label: t("nav.network"), href: sectionHref("network") },
    { label: t("nav.regex"), href: sectionHref("regex") },
    { label: t("nav.online"), href: sectionHref("online") }
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white text-slate-950 shadow-sm">
      <div className="flex h-14 w-full items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="CodeConvert.net home">
          <Image
            src="/codeconvert-logo.png"
            alt="CodeConvert.net"
            width={1152}
            height={217}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden flex-1 items-center gap-4 pl-4 text-[11px] font-black uppercase tracking-wide xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.active ? "border-b-2 border-orange-500 py-5 text-slate-950" : "py-5 text-slate-700 hover:text-blue-700"}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <nav className="flex min-w-0 flex-1 gap-3 overflow-x-auto pl-1 text-[11px] font-black uppercase tracking-wide xl:hidden">
          {navItems.slice(1, 7).map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 py-5 text-slate-700 hover:text-blue-700">
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
