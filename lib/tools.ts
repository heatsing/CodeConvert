export type ToolSlug =
  | "code-converter"
  | "code-generator"
  | "code-explainer"
  | "comment-remover"
  | "code-checker"
  | "code-to-pdf";

export type ToolConfig = {
  slug: ToolSlug;
  name: string;
  title: string;
  description: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  outputPlaceholder: string;
  actionLabel: string;
  iconName: "code" | "wand" | "message" | "eraser" | "bug" | "fileText";
  needsTargetLanguage: boolean;
  needsSourceLanguage: boolean;
  fileName: string;
  howTo: string[];
  faqs: { question: string; answer: string }[];
};

const sharedFaqs = [
  {
    question: "Does this tool send code to an AI service?",
    answer: "No. The current tool processes input locally in your browser and does not send it to an AI service."
  },
  {
    question: "Can I upload source files?",
    answer: "Yes. You can upload .txt, .js, .py, .java, or .ts files and the file text will be inserted into the editor."
  },
  {
    question: "Can I copy or download the result?",
    answer: "Yes. Use Copy to place the output on your clipboard or Download to save a .txt file."
  }
];

export const TOOLS: ToolConfig[] = [
  {
    slug: "code-converter",
    name: "Migration Worksheet",
    title: "Code Migration Worksheet",
    description: "Prepare your source code and a checklist for a manual language migration. The worksheet does not translate or execute code.",
    inputLabel: "Source code",
    outputLabel: "Migration worksheet",
    inputPlaceholder: "Paste source code to include in your migration worksheet...",
    outputPlaceholder: "Your source code and a manual migration checklist will appear here.",
    actionLabel: "Create Worksheet",
    iconName: "code",
    needsTargetLanguage: true,
    needsSourceLanguage: true,
    fileName: "migration-worksheet.txt",
    howTo: ["Choose the current language and the language you plan to migrate to.", "Paste the source code to include in the worksheet.", "Create and save the worksheet, then implement and test the translation yourself."],
    faqs: [{ question: "Does this worksheet translate my code?", answer: "No. It keeps your source in a text worksheet and adds a generic migration checklist. You must implement and test the destination code yourself." }, ...sharedFaqs]
  },
  {
    slug: "code-generator",
    name: "Starter Template Builder",
    title: "Starter Code Template Builder",
    description: "Create a fixed starter template in one of six supported languages. Your label names the example; requested behavior is not implemented.",
    inputLabel: "Template label",
    outputLabel: "Starter template",
    inputPlaceholder: "Enter a short label, for example order handler...",
    outputPlaceholder: "A fixed starter template will appear here for you to implement.",
    actionLabel: "Create Template",
    iconName: "wand",
    needsTargetLanguage: true,
    needsSourceLanguage: false,
    fileName: "starter-template.txt",
    howTo: ["Choose JavaScript, TypeScript, Python, Java, Go, or SQL.", "Enter a short label used for the template name or comment.", "Create the fixed template, then add your own implementation and tests."],
    faqs: [{ question: "Will this builder implement a request written in plain English?", answer: "No. Each language has a fixed starter template. A label changes names or comments, but does not generate the requested logic or call an AI model." }, ...sharedFaqs]
  },
  {
    slug: "code-explainer",
    name: "Code Keyword Summary",
    title: "Code Keyword Summary",
    description: "Count lines and keyword-like markers in a snippet. This local summary does not determine program behavior or verify correctness.",
    inputLabel: "Code to explain",
    outputLabel: "Keyword summary",
    inputPlaceholder: "Paste code to count lines and keyword-like markers...",
    outputPlaceholder: "A keyword-based structure summary will appear here.",
    actionLabel: "Summarize Keywords",
    iconName: "message",
    needsTargetLanguage: false,
    needsSourceLanguage: true,
    fileName: "code-explanation.txt",
    howTo: ["Select the language of the pasted code.", "Paste code or upload a supported file.", "Run the explainer and review the summary."],
    faqs: sharedFaqs
  },
  {
    slug: "comment-remover",
    name: "Comment Remover",
    title: "JavaScript and TypeScript Comment Remover",
    description: "Remove parsed comments from JavaScript or TypeScript while preserving string literals, token boundaries, and line numbers.",
    inputLabel: "Code with comments",
    outputLabel: "Clean code",
    inputPlaceholder: "Paste code that contains comments...",
    outputPlaceholder: "Code without comments will appear here.",
    actionLabel: "Remove Comments",
    iconName: "eraser",
    needsTargetLanguage: false,
    needsSourceLanguage: true,
    fileName: "code-without-comments.txt",
    howTo: ["Select the language used by your snippet.", "Paste code or upload a file.", "Remove comments, then copy or download the cleaned code."],
    faqs: sharedFaqs
  },
  {
    slug: "code-checker",
    name: "Code Heuristic Check",
    title: "Code Heuristic Check",
    description: "Flag keyword patterns, long lines, and delimiter counts for manual review. This heuristic check does not compile code or certify it as secure.",
    inputLabel: "Code to check",
    outputLabel: "Review notes",
    inputPlaceholder: "Paste code you want checked...",
    outputPlaceholder: "Code review notes will appear here.",
    actionLabel: "Run Heuristic Check",
    iconName: "bug",
    needsTargetLanguage: false,
    needsSourceLanguage: true,
    fileName: "code-check-report.txt",
    howTo: ["Select the language of the code.", "Paste or upload the code you want reviewed.", "Run the checker and inspect the notes."],
    faqs: sharedFaqs
  },
  {
    slug: "code-to-pdf",
    name: "Code Text Export",
    title: "Code Text Document Export",
    description: "Add a language label to your source code and download a plain text document (.txt). PDF generation is not available.",
    inputLabel: "Code",
    outputLabel: "Document preview",
    inputPlaceholder: "Paste code to prepare for export...",
    outputPlaceholder: "Printable text preview will appear here.",
    actionLabel: "Prepare Text Document",
    iconName: "fileText",
    needsTargetLanguage: false,
    needsSourceLanguage: true,
    fileName: "code-document.txt",
    howTo: ["Select the source language.", "Paste code or upload a supported text file.", "Prepare the document text, then download the output."],
    faqs: sharedFaqs
  }
];

export const toolBySlug = Object.fromEntries(TOOLS.map((tool) => [tool.slug, tool])) as Record<ToolSlug, ToolConfig>;

export const languageLinkTools = [
  { href: "/javascript-to-python-converter", label: "JavaScript to Python" },
  { href: "/python-to-javascript-converter", label: "Python to JavaScript" },
  { href: "/java-to-typescript-converter", label: "Java to TypeScript" },
  { href: "/sql-to-python-converter", label: "SQL to Python" },
  { href: "/csharp-to-go-converter", label: "C# to Go" },
  { href: "/ruby-to-php-converter", label: "Ruby to PHP" },
  { href: "/bash-to-powershell-converter", label: "Bash to PowerShell" },
  { href: "/swift-to-kotlin-converter", label: "Swift to Kotlin" }
];
