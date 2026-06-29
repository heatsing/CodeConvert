"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Braces, ChevronDown, LogIn, Search, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toolIcons } from "@/lib/tool-icons";
import { TOOLS } from "@/lib/tools";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
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
            {["Home", "Encode", "Decode", "Convert", "Utility", "Format", "Security", "Network", "Regex", "Online"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "/" : item === "Online" ? "#online" : `#${item.toLowerCase()}`}
                className={item === "Home" ? "border-b-2 border-orange-500 py-4 text-white" : "py-4 text-slate-200 hover:text-white"}
              >
                {item}
              </a>
            ))}
            <a href="#code" className="flex items-center gap-1 py-4 text-slate-200 hover:text-white">
              More
              <ChevronDown className="h-3 w-3" />
            </a>
          </nav>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <Sun className="h-4 w-4 text-slate-300" />
            <div className="flex h-8 w-48 items-center gap-2 rounded-md bg-white px-3 text-slate-500">
              <Search className="h-4 w-4" />
              <span className="text-[12px]">Search tools...</span>
            </div>
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
                Free Tools
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
                        href={`/tools/${tool.slug}`}
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
            FAQ
          </a>
          <a href="mailto:hello@codetools.example" className="hidden text-sm font-semibold text-slate-700 hover:text-violet-700 sm:inline">
            Contact
          </a>
          <Button type="button" variant="outline" size="sm">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </nav>
      </div>
    </header>
  );
}
