import Link from "next/link";
import { directoryTools } from "@/lib/home-tools";
import { onlineTools } from "@/lib/online-tools";

type ToolSeoContentProps = {
  title: string;
  description: string;
  category: string;
};

const sampleLinks = directoryTools.slice(0, 18);
const onlineLinks = onlineTools.slice(0, 12);

export function ToolSeoContent({ title, description, category }: ToolSeoContentProps) {
  const examples = [
    {
      name: "Clean input",
      detail: `Paste a short ${category.toLowerCase()} sample, run ${title}, and review the result before copying it.`
    },
    {
      name: "Batch text",
      detail: "Use multiple lines when the task supports it, then download the output as a text file."
    }
  ];

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 px-4 pb-8">
      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">How to use {title}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          <li className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">Paste text, code, data, or commands into the input box.</li>
          <li className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">Click the run button to process the input in the browser MVP.</li>
          <li className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">Copy the result, clear the form, or refine the input and run it again.</li>
        </ol>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Examples</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {examples.map((example) => (
            <div key={example.name} className="rounded-md border bg-slate-50 p-4">
              <h3 className="text-sm font-black text-slate-950">{example.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{example.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">What this tool is useful for</h2>
        <div className="mt-4 overflow-hidden rounded-md border">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y">
              <tr>
                <th className="w-44 bg-slate-50 px-4 py-3 font-black text-slate-900">Category</th>
                <td className="px-4 py-3 text-slate-600">{category}</td>
              </tr>
              <tr>
                <th className="bg-slate-50 px-4 py-3 font-black text-slate-900">Best for</th>
                <td className="px-4 py-3 text-slate-600">Quick browser-side formatting, conversion, inspection, and drafting workflows.</td>
              </tr>
              <tr>
                <th className="bg-slate-50 px-4 py-3 font-black text-slate-900">Output</th>
                <td className="px-4 py-3 text-slate-600">Readable text output that can be copied, downloaded, or used as a starting point.</td>
              </tr>
              <tr>
                <th className="bg-slate-50 px-4 py-3 font-black text-slate-900">API ready</th>
                <td className="px-4 py-3 text-slate-600">The page is structured so a real processor or AI API can replace the MVP logic later.</td>
              </tr>
            </tbody>
          </table>
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
        <h2 className="text-xl font-black text-slate-950">Frequently Asked Questions</h2>
        <div className="mt-4 grid gap-3">
          <details className="rounded-md border bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-black text-slate-950">Is {title} free to use?</summary>
            <p className="mt-2 text-sm leading-6 text-slate-600">Yes. This page is available as a free browser-based MVP tool.</p>
          </details>
          <details className="rounded-md border bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-black text-slate-950">Does this page call a real AI API?</summary>
            <p className="mt-2 text-sm leading-6 text-slate-600">Not yet. The current implementation is interactive front-end logic or mock output, with a structure ready for a real API later.</p>
          </details>
          <details className="rounded-md border bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-black text-slate-950">Can I copy the result?</summary>
            <p className="mt-2 text-sm leading-6 text-slate-600">Yes. Run the tool, then use the copy button in the output panel.</p>
          </details>
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
