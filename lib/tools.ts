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
    answer: "Not in this MVP. The interface is wired for future API calls, but the current result is generated locally with mock output."
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
    name: "Code Converter",
    title: "AI Code Converter",
    description: "Convert snippets between popular programming languages with a clean, fast coding workspace.",
    inputLabel: "Source code",
    outputLabel: "Converted code",
    inputPlaceholder: "Paste the code you want to convert...",
    outputPlaceholder: "Converted code will appear here.",
    actionLabel: "Convert",
    iconName: "code",
    needsTargetLanguage: true,
    needsSourceLanguage: true,
    fileName: "converted-code.txt",
    howTo: ["Choose the source and target languages.", "Paste code or upload a supported text file.", "Run the converter, then copy or download the result."],
    faqs: sharedFaqs
  },
  {
    slug: "code-generator",
    name: "Code Generator",
    title: "AI Code Generator",
    description: "Describe what you need and generate starter code in your preferred language.",
    inputLabel: "Prompt",
    outputLabel: "Generated code",
    inputPlaceholder: "Describe the function, component, script, or query you want...",
    outputPlaceholder: "Generated code will appear here.",
    actionLabel: "Generate",
    iconName: "wand",
    needsTargetLanguage: true,
    needsSourceLanguage: false,
    fileName: "generated-code.txt",
    howTo: ["Pick the language you want to generate.", "Describe the behavior, inputs, and expected output.", "Run the generator and refine the prompt as needed."],
    faqs: sharedFaqs
  },
  {
    slug: "code-explainer",
    name: "Code Explainer",
    title: "AI Code Explainer",
    description: "Turn unfamiliar code into a readable explanation with key behavior and edge cases highlighted.",
    inputLabel: "Code to explain",
    outputLabel: "Explanation",
    inputPlaceholder: "Paste code that you want explained...",
    outputPlaceholder: "Explanation will appear here.",
    actionLabel: "Explain",
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
    title: "AI Comment Remover",
    description: "Remove comments from code while keeping the rest of the snippet easy to review.",
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
    name: "Code Checker",
    title: "AI Code Checker",
    description: "Check code for possible bugs, readability issues, and practical improvement ideas.",
    inputLabel: "Code to check",
    outputLabel: "Review notes",
    inputPlaceholder: "Paste code you want checked...",
    outputPlaceholder: "Code review notes will appear here.",
    actionLabel: "Check Code",
    iconName: "bug",
    needsTargetLanguage: false,
    needsSourceLanguage: true,
    fileName: "code-check-report.txt",
    howTo: ["Select the language of the code.", "Paste or upload the code you want reviewed.", "Run the checker and inspect the notes."],
    faqs: sharedFaqs
  },
  {
    slug: "code-to-pdf",
    name: "Code to PDF",
    title: "Code to PDF Converter",
    description: "Prepare code for export with a tidy, document-style text output that can later become a PDF workflow.",
    inputLabel: "Code",
    outputLabel: "Document preview",
    inputPlaceholder: "Paste code to prepare for export...",
    outputPlaceholder: "Printable text preview will appear here.",
    actionLabel: "Prepare PDF",
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
