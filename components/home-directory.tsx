"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Flame, Search } from "lucide-react";
import { categories, directoryTools, featuredTools, frequentTools, getCategoryId, getCategoryLabel } from "@/lib/home-tools";
import { useI18n } from "@/lib/i18n";
import { developerOnlineTools, languageOnlineTools, onlineTools } from "@/lib/online-tools";
import { toolIcons } from "@/lib/tool-icons";

function shortDescription(description: string) {
  return description
    .replace(/\s+with .*/i, "")
    .replace(/\s+in .*/i, "")
    .replace(/\s+from .*/i, "")
    .replace(/\s+and inspect .*/i, "")
    .replace(/\.$/, "");
}

function languageToolDescription(name: string) {
  const language = name.replace(/\s+Online Tool$/i, "");
  return `Run ${language} code`;
}

function localizedCategoryLabel(category: string, t: (key: string) => string) {
  const labels: Record<string, string> = {
    Text: t("category.text"),
    "Font Styles": t("category.fontStyles"),
    Encoding: t("category.encoding"),
    Encode: t("nav.encode"),
    Decode: t("nav.decode"),
    Convert: t("nav.convert"),
    Utility: t("nav.utility"),
    Format: t("nav.format"),
    Beautifiers: t("category.beautifiers"),
    Security: t("nav.security"),
    Network: t("nav.network"),
    Regex: t("nav.regex"),
    Code: t("nav.code")
  };

  return labels[category] ?? getCategoryLabel(category);
}

function ToolTile({ tool, compact = false }: { tool: (typeof directoryTools)[number]; compact?: boolean }) {
  const Icon = toolIcons[tool.iconName];

  return (
    <Link
      href={tool.href}
      className={`group flex items-center gap-3 rounded-md border bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md ${
        compact ? "min-h-11 px-3 py-2" : "min-h-20 px-4 py-3"
      }`}
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${tool.accent}`}>
        <Icon className="h-[15px] w-[15px]" />
      </span>
      <span className="min-w-0">
        <span className="block whitespace-normal break-words text-[13px] font-bold leading-5 text-slate-950">{tool.name}</span>
        {!compact && <span className="mt-1 block whitespace-normal break-words text-[12px] leading-5 text-slate-500">{tool.description}</span>}
      </span>
    </Link>
  );
}

export function HomeDirectory() {
  const [query, setQuery] = useState("");
  const { t } = useI18n();
  const normalizedQuery = query.trim().toLowerCase();

  const visibleGroups = useMemo(() => {
    return categories
      .filter((category) => category !== "Popular")
      .map((category) => ({
        category,
        tools: directoryTools.filter((tool) => {
          const matchesCategory = tool.category === category;
          const matchesQuery =
            !normalizedQuery ||
            tool.name.toLowerCase().includes(normalizedQuery) ||
            tool.description.toLowerCase().includes(normalizedQuery) ||
            tool.category.toLowerCase().includes(normalizedQuery);
          return matchesCategory && matchesQuery;
        })
      }))
      .filter((group) => group.tools.length > 0);
  }, [normalizedQuery]);

  const visibleOnlineTools = useMemo(() => {
    return developerOnlineTools.filter((tool) => {
      return (
        !normalizedQuery ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        tool.mode.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  const visibleLanguageTools = useMemo(() => {
    return languageOnlineTools.filter((tool) => {
      return (
        !normalizedQuery ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  const sidebarItems = [
    { label: t("home.overview"), href: "#top" },
    { label: t("home.popular"), href: "#popular" },
    { label: t("home.languageTools"), href: "#language-tools" },
    { label: t("home.onlineTools"), href: "#online" },
    ...categories
      .filter((category) => category !== "Popular")
      .map((category) => ({ label: localizedCategoryLabel(category, t), href: `#${getCategoryId(category)}` }))
  ];

  return (
    <main id="top" className="grid min-h-[calc(100vh-3rem)] w-full gap-3 bg-slate-50 px-3 py-3 text-[13px] lg:grid-cols-[170px_minmax(0,1fr)] lg:px-4">
      <aside className="hidden lg:block">
        <div className="sticky top-[4rem] max-h-[calc(100vh-5rem)] overflow-auto rounded-md border bg-white p-2 shadow-sm">
          <p className="px-2 pb-2 pt-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{t("home.sidebar")}</p>
          <nav className="grid gap-1">
            {sidebarItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded px-2 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="grid min-w-0 gap-3">
        <nav className="flex gap-2 overflow-x-auto rounded-md border bg-white p-2 shadow-sm lg:hidden">
          {sidebarItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded bg-slate-100 px-3 py-1.5 text-[12px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <section className="rounded-lg border bg-white px-5 py-6 text-center shadow-soft sm:px-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {t("home.title.prefix")} <span className="text-orange-600">{t("home.title.highlight")}</span>
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-5 text-slate-600">
            {t("home.subtitle")}
          </p>
          <div className="mx-auto mt-4 flex max-w-2xl overflow-hidden rounded-md border bg-white shadow-sm">
            <div className="grid w-10 place-items-center text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("home.search")}
              className="h-10 min-w-0 flex-1 text-[13px] outline-none"
            />
            <button className="w-16 bg-orange-600 text-white transition hover:bg-orange-700" type="button" aria-label="Search tools">
              <Search className="mx-auto h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 text-left">
            <p className="mb-2 text-[12px] font-black text-slate-600">{t("home.frequentlyUsed")}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {frequentTools.map((tool) => (
                <ToolTile key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        <section id="popular" className="grid gap-2">
          <div className="flex items-center gap-2 text-[15px] font-black text-slate-950">
            <Flame className="h-4 w-4 text-orange-600" />
            {t("home.popular")}
          </div>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {featuredTools.map((tool) => (
              <ToolTile key={tool.name} tool={tool} />
            ))}
          </div>
        </section>

        <section id="language-tools" className="rounded-lg border bg-white p-4 shadow-soft">
          <h2 className="text-[15px] font-black text-slate-950">{t("home.languageTools")}</h2>
          <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {visibleLanguageTools.map((tool) => {
              const Icon = toolIcons[tool.iconName];
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="group flex min-h-20 items-center gap-3 rounded-md border bg-white px-4 py-3 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${tool.accent}`}>
                    <Icon className="h-[15px] w-[15px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-normal break-words text-[13px] font-bold leading-5 text-slate-950 group-hover:text-blue-700">
                      {tool.name}
                    </span>
                    <span className="mt-1 block whitespace-normal break-words text-[12px] leading-5 text-slate-500">
                      {languageToolDescription(tool.name)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="online" className="rounded-lg border bg-white p-4 shadow-soft">
          <h2 className="text-[15px] font-black text-slate-950">{t("home.onlineTools")}</h2>
          <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {visibleOnlineTools.map((tool) => {
              const Icon = toolIcons[tool.iconName];
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="group flex min-h-20 gap-3 rounded-md bg-slate-50 px-3 py-2.5 transition hover:bg-white hover:shadow-md"
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${tool.accent}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-normal break-words text-[13px] font-bold leading-5 text-slate-950 group-hover:text-blue-700">{tool.name}</span>
                    <span className="mt-1 block whitespace-normal break-words text-[12px] font-medium leading-5 text-slate-500">
                      {shortDescription(tool.description)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {visibleGroups.map((group) => (
          <section key={group.category} id={getCategoryId(group.category)} className="rounded-lg border bg-white p-4 shadow-soft">
            <h2 className="text-[15px] font-black text-slate-950">{localizedCategoryLabel(group.category, t)}</h2>
            <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
              {group.tools.map((tool) => (
                <ToolTile key={tool.name} tool={tool} />
              ))}
            </div>
          </section>
        ))}

      </div>
    </main>
  );
}
