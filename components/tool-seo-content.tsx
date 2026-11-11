import Link from "next/link";
import type { ReactNode } from "react";
import { SeoContentLabel } from "@/components/seo-content-label";
import { directoryTools, getCategoryId, getCategoryLabel } from "@/lib/home-tools";
import { onlineTools } from "@/lib/online-tools";
import { buildToolFaqs } from "@/lib/seo";
import { normalizeSearchText } from "@/lib/seo-keywords";
import { shouldIndexDirectoryTool, shouldIndexOnlineTool } from "@/lib/seo-quality";
import type { ToolPageContent } from "@/lib/tool-content-types";
import { getToolUserIntent } from "@/lib/tool-user-intent";
import { getToolCapability } from "@/lib/tool-capabilities";

type ToolSeoContentProps = {
  title: string;
  description: string;
  category: string;
  content: ToolPageContent;
};

type ConversionPair = {
  from: string;
  to: string;
};

function getConversionPair(title: string): ConversionPair | null {
  const match = title.match(/^(.+?) to (.+?) Converter$/i);
  if (!match) return null;
  return { from: match[1], to: match[2] };
}

function toolHref(tool: { name: string } & ({ href: string } | { slug: string })) {
  return "href" in tool ? tool.href : `/${tool.slug}`;
}

function relatedAnchorLabel(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("json formatter")) return "format JSON online";
  if (lowerName.includes("json validator")) return "validate JSON syntax";
  if (lowerName.includes("base64 encode")) return "encode Base64 text";
  if (lowerName.includes("base64 decode")) return "decode Base64 strings";
  if (lowerName.includes("url encode")) return "encode URL parameters";
  if (lowerName.includes("url decode")) return "decode URL strings";
  if (lowerName.includes("regex tester")) return "test a regular expression";
  if (lowerName.includes("regex")) return name.replace(/^Regex/i, "work with regex");
  if (lowerName.includes("remove line breaks")) return "remove line breaks";
  if (lowerName.includes("duplicate line")) return "remove duplicate lines";
  if (lowerName.includes("duplicate word")) return "find duplicate words";
  if (lowerName.includes("word counter")) return "count words online";
  if (lowerName.includes("character counter")) return "count characters online";
  if (lowerName.includes("formatter")) return `format ${name.replace(/\s*Formatter$/i, "")}`;
  if (lowerName.includes("beautifier")) return `beautify ${name.replace(/\s*Beautifier$/i, "")}`;
  if (lowerName.includes("converter")) return name.replace(/\s+Converter$/i, " converter");
  return name;
}

function uniqueRelatedLinks(title: string, category: string, categoryLabel: string) {
  const normalizedTitle = normalizeSearchText(title);
  const directoryMatches = directoryTools
    .filter(shouldIndexDirectoryTool)
    .filter((tool) => tool.category.toLowerCase() === category.toLowerCase())
    .filter((tool) => !normalizedTitle.includes(normalizeSearchText(tool.name)) && !normalizeSearchText(tool.name).includes(normalizedTitle))
    .slice(0, 6);
  const onlineMatches = onlineTools
    .filter(shouldIndexOnlineTool)
    .filter((tool) => tool.mode.toLowerCase() === category.toLowerCase())
    .filter((tool) => !normalizedTitle.includes(normalizeSearchText(tool.name)) && !normalizeSearchText(tool.name).includes(normalizedTitle))
    .slice(0, 6);

  const fallbackLinks = [
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "Base64 Encode", href: "/base64-encode" },
    { name: "Regex Tester", href: "/regex-tester" },
    { name: categoryLabel, href: `/#${getCategoryId(category)}` }
  ];

  return [...directoryMatches, ...onlineMatches, ...fallbackLinks]
    .filter((tool) => toolHref(tool).startsWith("/#") || getToolCapability(toolHref(tool)).discoverable)
    .filter((tool, index, tools) => tools.findIndex((item) => toolHref(item) === toolHref(tool)) === index)
    .slice(0, 5);
}

function configuredRelatedLinks(slugs: string[]) {
  const links: Array<(typeof directoryTools)[number] | (typeof onlineTools)[number]> = [];

  for (const slug of slugs) {
    if (!getToolCapability(slug).discoverable) continue;
    const href = `/${slug.replace(/^\/|\/$/g, "")}`;
    const directoryTool = directoryTools.find((tool) => tool.href === href);
    if (directoryTool) {
      links.push(directoryTool);
      continue;
    }
    const onlineTool = onlineTools.find((tool) => `/${tool.slug}` === href);
    if (onlineTool) links.push(onlineTool);
  }

  return links;
}

function whatHeading(title: string) {
  return `What is ${title}?`;
}

function howHeading(title: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("json to xml")) return "How to Convert JSON to XML?";
  if (lowerTitle.includes("xml to json")) return "How to Convert XML to JSON?";
  if (lowerTitle.includes("html to markdown")) return "How to Convert HTML to Markdown?";
  if (lowerTitle.includes("json formatter")) return "How to Format JSON?";
  if (lowerTitle.includes("base64 to json")) return "How to Decode Base64 to JSON?";
  if (lowerTitle.includes("base64 decode") || lowerTitle.includes("base64 to text")) return "How to Decode Base64 Text?";
  if (lowerTitle.includes("base64")) return copySafeHowHeading(title);
  if (lowerTitle.includes("remove line breaks")) return "How to Remove Line Breaks?";
  return copySafeHowHeading(title);
}

function copySafeHowHeading(title: string) {
  return `How to Use ${title}?`;
}

function CodePanel({ label, code }: { label: ReactNode; code: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-black text-slate-950">{label}</p>
      <pre className="code-scrollbar max-h-72 overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100 shadow-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ToolSeoContent({ title, description, category, content }: ToolSeoContentProps) {
  const capability = getToolCapability(content.slug);
  if (capability.status !== "verified") {
    return (
      <section className="mx-auto max-w-[1200px] px-4 pb-10">
        <div className="rounded-lg border bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-slate-950">Current capability</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">{capability.reason}</p>
          {capability.status === "limited" && <p className="mt-3 text-sm leading-6 text-slate-700">{content.intro}</p>}
          <Link href="/" className="mt-4 inline-block font-semibold text-blue-700 underline">Browse verified tools</Link>
        </div>
      </section>
    );
  }
  const categoryLabel = getCategoryLabel(category);
  const conversionPair = getConversionPair(title);
  const relatedLinks = directoryTools
    .filter(shouldIndexDirectoryTool)
    .filter((tool) => tool.category.toLowerCase() === category.toLowerCase() && tool.name !== title)
    .slice(0, 18);
  const relatedOnlineLinks = onlineTools
    .filter(shouldIndexOnlineTool)
    .filter((tool) => tool.mode.toLowerCase() === category.toLowerCase() && tool.name !== title)
    .slice(0, 18);
  const configuredLinks = configuredRelatedLinks(content.relatedTools);
  const sampleLinks = configuredLinks.length > 0 ? configuredLinks : relatedLinks.length > 0 ? relatedLinks : relatedOnlineLinks;
  const faqs = content.faq.length > 0 ? content.faq : buildToolFaqs(title, categoryLabel);
  const userIntent = getToolUserIntent(title, category);
  const seoLinks = [...configuredLinks, ...uniqueRelatedLinks(title, category, categoryLabel)]
    .filter((tool, index, tools) => tools.findIndex((item) => toolHref(item) === toolHref(tool)) === index)
    .slice(0, 5);
  const relatedHeading = categoryLabel.toLowerCase().endsWith("tools") ? categoryLabel.toLowerCase() : `${categoryLabel.toLowerCase()} tools`;
  const currentWhatHeading = whatHeading(title);
  const currentHowHeading = howHeading(title);
  const input = content.input || userIntent.input;
  const outcome = content.outcome || userIntent.outcome;
  const review = content.review || userIntent.review;
  const bestFor = content.bestFor || userIntent.bestFor;
  const steps = content.steps || userIntent.steps;
  const useCases = content.useCases || userIntent.useCases;

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10">
      <article className="rounded-lg border bg-white p-6 shadow-soft sm:p-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
          <div>
            <h2 className="text-xl font-black text-slate-950">{currentWhatHeading}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {content.intro} {description}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Start with <strong>{input}</strong> A useful result is <strong>{outcome.charAt(0).toLowerCase()}
              {outcome.slice(1)}</strong> For the next step in the same workflow, open{" "}
              {seoLinks.slice(0, 3).map((tool, index) => (
                <span key={toolHref(tool)}>
                  {index > 0 ? (index === seoLinks.slice(0, 3).length - 1 ? ", or " : ", ") : ""}
                  <Link href={toolHref(tool)} className="font-bold text-blue-700 underline-offset-4 hover:underline">
                    {relatedAnchorLabel(tool.name)}
                  </Link>
                </span>
              ))}
              .
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              <strong>Before you use the output:</strong> {review}
            </p>
            <h2 className="mt-5 text-lg font-black text-slate-950">{currentHowHeading}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="hidden rounded-lg border bg-gradient-to-br from-blue-50 via-white to-violet-50 p-5 text-center lg:block">
            <p className="text-sm font-black text-slate-600">{conversionPair?.from ?? categoryLabel}</p>
            <div className="my-5 text-3xl font-black text-blue-700"><SeoContentLabel label="to" /></div>
            <p className="text-sm font-black text-slate-600">{conversionPair?.to ?? <SeoContentLabel label="output" />}</p>
          </div>
        </section>

        {content.examples.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-black text-slate-950"><SeoContentLabel label="examples" /></h2>
            <div className="mt-5 space-y-8">
              {content.examples.map((example) => (
                <div key={example.title}>
                  <h3 className="text-base font-black text-slate-950">{example.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{example.description}</p>
                  {example.mode && <p className="mt-2 text-sm font-semibold text-slate-700">Setting: {example.mode}</p>}
                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_80px_1fr] lg:items-center">
                    <CodePanel label={<SeoContentLabel label="input" />} code={example.input} />
                    <div className="hidden text-center text-2xl font-black text-blue-600 lg:block"><SeoContentLabel label="to" /></div>
                    <CodePanel label={<SeoContentLabel label="output" />} code={example.output} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">Common Use Cases</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase} className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {useCase}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">
            What to Check Before You Use the Result
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            The output from <strong>{title}</strong> is most useful when you compare it with the original input and test it
            where it will actually be used. The table separates the source state, expected result, and review responsibility.
            If the next task changes, continue with{" "}
            {seoLinks.slice(0, 4).map((tool, index) => (
              <span key={`context-${toolHref(tool)}`}>
                {index > 0 ? (index === seoLinks.slice(0, 4).length - 1 ? ", or " : ", ") : ""}
                <Link href={toolHref(tool)} className="font-bold text-blue-700 underline-offset-4 hover:underline">
                  {relatedAnchorLabel(tool.name)}
                </Link>
              </span>
            ))}
            .
          </p>
          <div className="mt-4 overflow-hidden rounded-md border">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr>
                  <th className="px-4 py-3 font-black">Stage</th>
                  <th className="px-4 py-3 font-black">What you have</th>
                  <th className="px-4 py-3 font-black">What good looks like</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Input</td>
                  <td className="px-4 py-3 text-slate-600">{input}</td>
                  <td className="px-4 py-3 text-slate-600">{content.tips[0]}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Result</td>
                  <td className="px-4 py-3 text-slate-600">{outcome}</td>
                  <td className="px-4 py-3 text-slate-600">{content.tips[1]}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Review</td>
                  <td className="px-4 py-3 text-slate-600">Keep the original available for a side-by-side comparison.</td>
                  <td className="px-4 py-3 text-slate-600">{content.tips[2]}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Best fit</td>
                  <td className="px-4 py-3 text-slate-600">{bestFor}</td>
                  <td className="px-4 py-3 text-slate-600">{content.tips[3]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg bg-sky-50 p-5 sm:p-6">
          <h2 className="text-xl font-black text-slate-950"><SeoContentLabel label="faq" /></h2>
          <div className="mt-4 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-md bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-black text-slate-950">{faq.question}</summary>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {sampleLinks.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-black text-slate-950"><SeoContentLabel label="tryMore" /> {relatedHeading}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Continue with a related <strong>{relatedHeading}</strong> when the next step uses the same input or helps verify
              the result. These links stay within the current task group.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {sampleLinks.slice(0, 12).map((tool) => (
                <Link key={tool.name} href={"href" in tool ? tool.href : `/${tool.slug}`} className="rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                  {relatedAnchorLabel(tool.name)}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
