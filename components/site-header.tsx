"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Braces, ChevronDown, Globe2, LogIn, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { translationLanguages, useI18n, type LanguageCode } from "@/lib/i18n";
import { toolIcons } from "@/lib/tool-icons";
import { TOOLS } from "@/lib/tools";

type ThemeMode = "light" | "dark";

function ThemeToggle({ dark = false }: { dark?: boolean }) {
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
      className={`grid h-8 w-8 place-items-center rounded-md transition ${
        dark ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <label
      className={`flex h-8 items-center gap-2 rounded-md border px-2 text-[12px] font-black ${
        dark ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-800"
      }`}
      title={t("language.select")}
    >
      <Globe2 className="h-4 w-4 text-slate-400" />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        className={`h-full cursor-pointer bg-transparent pr-1 font-black outline-none ${dark ? "text-white" : "text-slate-800"}`}
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

  if (isHome) {
    const navItems = [
      { label: t("nav.home"), href: "/", active: true },
      { label: t("nav.encode"), href: "#encode" },
      { label: t("nav.decode"), href: "#decode" },
      { label: t("nav.convert"), href: "#convert" },
      { label: t("nav.utility"), href: "#utility" },
      { label: t("nav.format"), href: "#format" },
      { label: t("nav.security"), href: "#security" },
      { label: t("nav.network"), href: "#network" },
      { label: t("nav.regex"), href: "#regex" },
      { label: t("nav.online"), href: "#online" }
    ];

    return (
      <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-lg">
        <div className="flex h-12 w-full items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-2 text-base font-black">
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
            <a href="#code" className="flex items-center gap-1 py-4 text-slate-200 hover:text-white">
              {t("nav.more")}
              <ChevronDown className="h-3 w-3" />
            </a>
          </nav>
          <div className="ml-auto mr-5 hidden items-center gap-3 md:flex">
            <LanguageSwitcher dark />
            <ThemeToggle dark />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-black text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            <Braces className="h-5 w-5" />
          </span>
          CodeTools AI
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button type="button" variant="ghost" className="px-2 sm:px-3">
                {t("nav.freeTools")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                className="z-50 grid w-64 gap-1 rounded-lg border bg-white p-2 shadow-soft"
              >
                {TOOLS.map((tool) => {
                  const Icon = toolIcons[tool.iconName];
                  return (
                    <DropdownMenu.Item key={tool.slug} asChild>
                      <Link
                        href={`/${tool.slug}`}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-100"
                      >
                        <Icon className="h-4 w-4 text-violet-600" />
                        {tool.name}
                      </Link>
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <a href="#faq" className="hidden text-sm font-semibold text-slate-700 hover:text-violet-700 sm:inline">
            {t("nav.faq")}
          </a>
          <a href="mailto:hello@codetools.example" className="hidden text-sm font-semibold text-slate-700 hover:text-violet-700 sm:inline">
            {t("nav.contact")}
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
          <Button type="button" variant="outline" size="sm">
            <LogIn className="h-4 w-4" />
            {t("nav.login")}
          </Button>
        </nav>
      </div>
    </header>
  );
}
