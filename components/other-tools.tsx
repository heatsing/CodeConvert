import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toolIcons } from "@/lib/tool-icons";
import { languageLinkTools, TOOLS, type ToolSlug } from "@/lib/tools";

export function OtherTools({ currentSlug }: { currentSlug: ToolSlug }) {
  const tools = TOOLS.filter((tool) => tool.slug !== currentSlug);

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-slate-950">Try our other free tools</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = toolIcons[tool.iconName];
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex items-center justify-between rounded-md border bg-slate-50 p-4 text-sm font-semibold text-slate-800 transition hover:border-violet-300 hover:bg-white hover:shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-violet-600" />
                  {tool.name}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-slate-950">Ready-to-use language links</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {languageLinkTools.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md border bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
