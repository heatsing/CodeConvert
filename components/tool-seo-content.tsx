import Link from "next/link";
import { directoryTools, getCategoryLabel } from "@/lib/home-tools";
import { onlineTools } from "@/lib/online-tools";
import { buildToolFaqs } from "@/lib/seo";

type ToolSeoContentProps = {
  title: string;
  description: string;
  category: string;
};

type ConversionPair = {
  from: string;
  to: string;
};

const onlineLinks = onlineTools.slice(0, 12);

function getConversionPair(title: string): ConversionPair | null {
  const match = title.match(/^(.+?) to (.+?) Converter$/i);
  if (!match) return null;
  return { from: match[1], to: match[2] };
}

function codeSample(language: string, example: "palindrome" | "evenOdd") {
  const normalized = language.toLowerCase();
  if (normalized.includes("python")) {
    return example === "palindrome"
      ? "def is_palindrome(text):\n    clean = text.lower()\n    return clean == clean[::-1]\n\nprint(is_palindrome('level'))"
      : "def even_or_odd(number):\n    return 'even' if number % 2 == 0 else 'odd'\n\nprint(even_or_odd(7))";
  }
  if (normalized.includes("typescript") || normalized.includes("javascript")) {
    return example === "palindrome"
      ? "function isPalindrome(text: string) {\n  const clean = text.toLowerCase();\n  return clean === clean.split('').reverse().join('');\n}\n\nconsole.log(isPalindrome('level'));"
      : "function evenOrOdd(number: number) {\n  return number % 2 === 0 ? 'even' : 'odd';\n}\n\nconsole.log(evenOrOdd(7));";
  }
  if (normalized.includes("java")) {
    return example === "palindrome"
      ? "class Main {\n  static boolean isPalindrome(String text) {\n    String clean = text.toLowerCase();\n    return clean.equals(new StringBuilder(clean).reverse().toString());\n  }\n}"
      : "class Main {\n  static String evenOrOdd(int number) {\n    return number % 2 == 0 ? \"even\" : \"odd\";\n  }\n}";
  }
  if (normalized.includes("sql")) {
    return example === "palindrome"
      ? "select word,\n       reverse(word) = word as is_palindrome\nfrom words;"
      : "select number,\n       case when number % 2 = 0 then 'even' else 'odd' end as result\nfrom values_table;";
  }
  if (normalized.includes("bash") || normalized.includes("shell")) {
    return example === "palindrome"
      ? "text=\"level\"\nreverse=$(echo \"$text\" | rev)\n[ \"$text\" = \"$reverse\" ] && echo true || echo false"
      : "number=7\nif (( number % 2 == 0 )); then echo even; else echo odd; fi";
  }
  return example === "palindrome"
    ? "function isPalindrome(text) {\n  clean = lowercase(text)\n  return clean == reverse(clean)\n}\nprint(isPalindrome('level'))"
    : "function evenOrOdd(number) {\n  if number % 2 == 0 return 'even'\n  return 'odd'\n}\nprint(evenOrOdd(7))";
}

function toolInputExample(title: string, categoryLabel: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("base64")) return "Hello from CodeConvert.net";
  if (lowerTitle.includes("json")) return '{"name":"CodeConvert","tools":["format","convert","check"]}';
  if (lowerTitle.includes("regex")) return "Email alice@example.com and ticket user-123 are in this text.";
  if (lowerTitle.includes("duplicate line")) return "apple\nbanana\napple\norange\nbanana";
  if (lowerTitle.includes("duplicate word")) return "This line has has a repeated repeated word.";
  if (lowerTitle.includes("line break")) return "This text\nhas line breaks\nthat should become one paragraph.";
  if (lowerTitle.includes("comment")) return "// Remove this comment\nconst total = price + tax;";
  if (categoryLabel === "Text Tools") return "Paste plain text here.\nAdd a second line for processing.";
  return "Paste input for this tool, then run it to generate a clean output.";
}

function toolOutputExample(title: string, categoryLabel: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("base64 encode")) return "SGVsbG8gZnJvbSBDb2RlQ29udmVydC5uZXQ=";
  if (lowerTitle.includes("json")) return "{\n  \"name\": \"CodeConvert\",\n  \"tools\": [\n    \"format\",\n    \"convert\",\n    \"check\"\n  ]\n}";
  if (lowerTitle.includes("duplicate line")) return "apple\nbanana\norange";
  if (lowerTitle.includes("duplicate word")) return "Repeated words found:\n- has: 2\n- repeated: 2";
  if (lowerTitle.includes("line break")) return "This text has line breaks that should become one paragraph.";
  if (lowerTitle.includes("comment")) return "const total = price + tax;";
  if (categoryLabel === "Text Tools") return "Clean text output appears here.";
  return "Processed output appears here after the tool runs.";
}

function CodePanel({ label, code }: { label: string; code: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-black text-slate-950">{label}</p>
      <pre className="code-scrollbar max-h-72 overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100 shadow-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ToolSeoContent({ title, description, category }: ToolSeoContentProps) {
  const categoryLabel = getCategoryLabel(category);
  const conversionPair = getConversionPair(title);
  const relatedLinks = directoryTools
    .filter((tool) => tool.category.toLowerCase() === category.toLowerCase() && tool.name !== title)
    .slice(0, 18);
  const fallbackLinks = directoryTools.filter((tool) => tool.name !== title).slice(0, 18);
  const sampleLinks = relatedLinks.length >= 6 ? relatedLinks : fallbackLinks;
  const faqs = buildToolFaqs(title, categoryLabel);
  const inputExample = conversionPair ? codeSample(conversionPair.from, "palindrome") : toolInputExample(title, categoryLabel);
  const outputExample = conversionPair ? codeSample(conversionPair.to, "palindrome") : toolOutputExample(title, categoryLabel);
  const secondInputExample = conversionPair ? codeSample(conversionPair.from, "evenOdd") : toolInputExample(title, categoryLabel);
  const secondOutputExample = conversionPair ? codeSample(conversionPair.to, "evenOdd") : toolOutputExample(title, categoryLabel);

  const useIntro = conversionPair
    ? `This free online converter helps you convert ${conversionPair.from} code to ${conversionPair.to} in a focused browser workspace.`
    : `This free online ${categoryLabel.toLowerCase()} tool helps you process pasted input and produce a clean result in a focused browser workspace.`;

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10">
      <article className="rounded-lg border bg-white p-6 shadow-soft sm:p-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
          <div>
            <h2 className="text-xl font-black text-slate-950">How to use this tool?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {useIntro} {description}
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
              <li>Type, paste, or upload the input you want to process.</li>
              <li>{conversionPair ? `Choose ${conversionPair.from} as the source and ${conversionPair.to} as the target language.` : "Review the selected tool settings and sample input."}</li>
              <li>Click the main action button and review the result in the output panel.</li>
              <li>Copy the result, download it as a text file, or clear the editor and run another input.</li>
            </ol>
          </div>
          <div className="hidden rounded-lg border bg-gradient-to-br from-blue-50 via-white to-violet-50 p-5 text-center lg:block">
            <p className="text-sm font-black text-slate-600">{conversionPair?.from ?? categoryLabel}</p>
            <div className="my-5 text-3xl font-black text-blue-700">to</div>
            <p className="text-sm font-black text-slate-600">{conversionPair?.to ?? "Output"}</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">Examples</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {conversionPair
              ? `The examples below show common ${conversionPair.from} to ${conversionPair.to} conversion patterns. Generated code should always be reviewed before production use.`
              : `The examples below show the kind of input and output you can expect when using ${title}.`}
          </p>

          <div className="mt-5 space-y-8">
            <div>
              <h3 className="text-base font-black text-slate-950">Example 1 - Simple function</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {conversionPair ? "A small function converted into the target language style." : "A short input processed into a cleaner output."}
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_80px_1fr] lg:items-center">
                <CodePanel label={conversionPair?.from ?? "Input"} code={inputExample} />
                <div className="hidden text-center text-2xl font-black text-blue-600 lg:block">to</div>
                <CodePanel label={conversionPair?.to ?? "Output"} code={outputExample} />
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-950">Example 2 - Practical check</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {conversionPair ? "A conditional example that highlights syntax and typing differences." : "A second sample that shows repeatable processing behavior."}
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_80px_1fr] lg:items-center">
                <CodePanel label={conversionPair?.from ?? "Input"} code={secondInputExample} />
                <div className="hidden text-center text-2xl font-black text-blue-600 lg:block">to</div>
                <CodePanel label={conversionPair?.to ?? "Output"} code={secondOutputExample} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">
            {conversionPair ? `Key differences between ${conversionPair.from} and ${conversionPair.to}` : `What ${title} helps with`}
          </h2>
          <div className="mt-4 overflow-hidden rounded-md border">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr>
                  <th className="px-4 py-3 font-black">Characteristic</th>
                  <th className="px-4 py-3 font-black">{conversionPair?.from ?? "Input"}</th>
                  <th className="px-4 py-3 font-black">{conversionPair?.to ?? "Output"}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Syntax</td>
                  <td className="px-4 py-3 text-slate-600">{conversionPair ? `${conversionPair.from} code may use language-specific syntax, libraries, and runtime conventions.` : "Raw input may be messy, duplicated, encoded, minified, or hard to scan."}</td>
                  <td className="px-4 py-3 text-slate-600">{conversionPair ? `${conversionPair.to} output should be checked for idiomatic syntax and equivalent behavior.` : "The result is normalized into a clearer text output that is easier to copy or save."}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Workflow</td>
                  <td className="px-4 py-3 text-slate-600">Paste a focused snippet, sample data, or text block into the editor.</td>
                  <td className="px-4 py-3 text-slate-600">Review the output, then copy, download, or refine the input and run it again.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Review</td>
                  <td className="px-4 py-3 text-slate-600">Inputs can include edge cases, comments, unusual spacing, or project-specific names.</td>
                  <td className="px-4 py-3 text-slate-600">Outputs should be validated before using them in a production codebase or document.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Best use</td>
                  <td className="px-4 py-3 text-slate-600">Small examples, quick checks, text cleanup, code snippets, and developer utilities.</td>
                  <td className="px-4 py-3 text-slate-600">A fast starting point for manual review, refactoring, documentation, or sharing.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg bg-sky-50 p-5 sm:p-6">
          <h2 className="text-xl font-black text-slate-950">Frequently Asked Questions</h2>
          <div className="mt-4 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-md bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-black text-slate-950">{faq.question}</summary>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">Try our other free tools</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {sampleLinks.slice(0, 12).map((tool) => (
              <Link key={tool.name} href={tool.href} className="rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                {tool.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">Online developer workspaces</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {onlineLinks.map((tool) => (
              <Link key={tool.slug} href={`/online-tools/${tool.slug}`} className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-700">
                {tool.name}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
