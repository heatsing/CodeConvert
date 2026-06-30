import Link from "next/link";
import { directoryTools, getCategoryLabel } from "@/lib/home-tools";
import { onlineTools } from "@/lib/online-tools";
import { buildToolFaqs } from "@/lib/seo";

type ToolSeoContentProps = {
  title: string;
  description: string;
  category: string;
};

const onlineLinks = onlineTools.slice(0, 12);

export function ToolSeoContent({ title, description, category }: ToolSeoContentProps) {
  const categoryLabel = getCategoryLabel(category);
  const relatedLinks = directoryTools
    .filter((tool) => tool.category.toLowerCase() === category.toLowerCase() && tool.name !== title)
    .slice(0, 18);
  const fallbackLinks = directoryTools.filter((tool) => tool.name !== title).slice(0, 18);
  const sampleLinks = relatedLinks.length >= 6 ? relatedLinks : fallbackLinks;
  const faqs = buildToolFaqs(title, categoryLabel);
  const examples = [
    {
      name: "Quick cleanup",
      detail: `Paste a small ${categoryLabel.toLowerCase()} sample, run ${title}, and compare the output before using it in your project.`
    },
    {
      name: "Repeatable edits",
      detail: "Use the same workspace for multi-line text, code snippets, configuration data, or small developer notes."
    }
  ];

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 px-4 pb-8">
      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">{title} online</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Use this page when you need a focused browser workspace without opening a full IDE. The tool keeps the input and output side by side, supports quick copy and download actions, and is structured so a production API can be connected later.
        </p>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">How to use {title}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          <li className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">Paste text, code, data, or commands into the input editor.</li>
          <li className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">Run the tool and review the formatted result in the output panel.</li>
          <li className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">Copy the result, download it as text, clear the form, or run another pass.</li>
        </ol>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Common uses</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {examples.map((example) => (
            <div key={example.name} className="rounded-md border bg-slate-50 p-4">
              <h3 className="text-sm font-black text-slate-950">{example.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{example.detail}</p>
            </div>
          ))}
          <div className="rounded-md border bg-slate-50 p-4">
            <h3 className="text-sm font-black text-slate-950">Lightweight review</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Check the transformed output before committing changes, sharing snippets, or pasting results into another workflow.</p>
          </div>
          <div className="rounded-md border bg-slate-50 p-4">
            <h3 className="text-sm font-black text-slate-950">Fast handoff</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Download the output as a text file when you need to keep a small converted, cleaned, or generated result.</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Tool details</h2>
        <div className="mt-4 overflow-hidden rounded-md border">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y">
              <tr>
                <th className="w-44 bg-slate-50 px-4 py-3 font-black text-slate-900">Category</th>
                <td className="px-4 py-3 text-slate-600">{categoryLabel}</td>
              </tr>
              <tr>
                <th className="bg-slate-50 px-4 py-3 font-black text-slate-900">Best for</th>
                <td className="px-4 py-3 text-slate-600">Small, repeatable formatting, conversion, checking, and text processing tasks.</td>
              </tr>
              <tr>
                <th className="bg-slate-50 px-4 py-3 font-black text-slate-900">Output</th>
                <td className="px-4 py-3 text-slate-600">Plain text output that can be copied, downloaded, or used as a clean starting point.</td>
              </tr>
              <tr>
                <th className="bg-slate-50 px-4 py-3 font-black text-slate-900">Privacy model</th>
                <td className="px-4 py-3 text-slate-600">No login, payment, database, or saved history is required for this MVP experience.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Frequently Asked Questions</h2>
        <div className="mt-4 grid gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-md border bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-black text-slate-950">{faq.question}</summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Try related tools</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {sampleLinks.map((tool) => (
            <Link key={tool.name} href={tool.href} className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-700">
              {tool.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Online developer workspaces</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {onlineLinks.map((tool) => (
            <Link key={tool.slug} href={`/online-tools/${tool.slug}`} className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-700">
              {tool.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
