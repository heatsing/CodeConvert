import type { Metadata } from "next";
import { createElement } from "react";
import { getCategoryLabel, type DirectoryTool } from "@/lib/home-tools";
import type { OnlineTool } from "@/lib/online-tools";
import { siteUrl } from "@/lib/site";
import { getCoreToolHeader, getDirectoryToolHeader, getOnlineToolHeader } from "@/lib/tool-page-copy";
import type { ToolConfig } from "@/lib/tools";

const brandName = "CodeConvert.net";
const defaultOgImage = "/android-chrome-512x512.png";

type SeoTool = {
  name: string;
  title: string;
  description: string;
  category: string;
  url: string;
};

export function getToolDescription(tool: DirectoryTool) {
  return getDirectoryToolHeader(tool).description;
}

export function getLanguageConverterDescription(tool: DirectoryTool) {
  const pair = getConversionPair(tool.name);
  if (pair) {
    return `Convert ${pair.from} code to ${pair.to} code online for free. Paste your source code, run the converter, then copy or download clean ${pair.to} output from a fast browser workspace.`;
  }

  return `${tool.name} helps you turn source code from one programming language into another with a clean two-panel editor, sample output, copy, download, and file upload support.`;
}

function withBrand(title: string) {
  return title.includes(brandName) ? title : `${title} | ${brandName}`;
}

function getConversionPair(title: string) {
  const match = title.match(/^(.+?) to (.+?) Converter$/i);
  if (!match) return null;

  return {
    from: match[1],
    to: match[2]
  };
}

function actionPhrase(tool: DirectoryTool) {
  const name = tool.name.toLowerCase();
  if (name.includes("converter") || name.includes("convert")) return "convert text, code, data, or formats";
  if (name.includes("encode") || name.includes("encoder")) return "encode text, code, URLs, or developer data";
  if (name.includes("decode") || name.includes("decoder")) return "decode encoded strings, tokens, or developer data";
  if (name.includes("formatter") || name.includes("beautifier")) return "format and beautify code or structured text";
  if (name.includes("minifier") || name.includes("minify")) return "minify code and remove unnecessary whitespace";
  if (name.includes("generator")) return "generate useful text, code, values, or developer output";
  if (name.includes("remover") || name.includes("remove")) return "remove unwanted text, comments, characters, or formatting";
  if (name.includes("checker") || name.includes("validator") || name.includes("tester")) return "check, validate, and inspect developer input";
  if (name.includes("counter")) return "count words, characters, lines, or text patterns";
  if (name.includes("translator")) return "translate text, symbols, code, or encoded input";
  if (name.includes("lookup")) return "look up technical values and developer reference data";
  return `process ${getCategoryLabel(tool.category).toLowerCase()} input`;
}

function buildDirectoryMetaDescription(tool: DirectoryTool) {
  const pair = getConversionPair(tool.name);
  if (pair) return getLanguageConverterDescription(tool);

  return getDirectoryToolHeader(tool).description;
}

function buildDirectoryMetaTitle(tool: DirectoryTool) {
  const pair = getConversionPair(tool.name);
  if (pair) return `Free ${pair.from} to ${pair.to} Converter Online`;
  if (tool.category === "Text") return buildTextToolMetaTitle(tool);

  return /\b(tool|generator|converter|formatter|decoder|encoder|translator|checker|counter|remover|minifier|beautifier)$/i.test(tool.name)
    ? `Free ${tool.name} Online`
    : `Free ${tool.name} Online Tool`;
}

function textToolBenefit(name: string) {
  const benefits: Record<string, string> = {
    "APA Citation Generator": "Create APA References Online",
    "Character Remover": "Remove Characters from Text",
    "Duplicate Line Remover": "Remove Duplicate Lines Online",
    "Duplicate Word Finder": "Find Repeated Words Online",
    "Em Dash Remover": "Clean Up Dashes Online",
    "Find and Replace Text": "Replace Words and Phrases Online",
    "Text Splitter": "Split Text into Lines",
    "Text Joiner": "Join Lines into Text",
    "Text Escape Tool": "Escape Text Online",
    "Text Beautifier": "Clean Up Text Online",
    "Text Line Length Filter": "Filter Lines by Length",
    "Fixed Length Text Lines": "Wrap Text to Fixed Width",
    "Punctuation Converter": "Convert Punctuation Online",
    "Key Value to Code": "Convert Pairs to Code",
    "Directory Tree Generator": "Create Folder Trees Online",
    "Pinyin Converter": "Convert Chinese to Pinyin",
    "Simplified Traditional Converter": "Convert Chinese Text Online",
    "camelCase Converter": "Convert Text to camelCase",
    "PascalCase Converter": "Convert Text to PascalCase",
    "snake_case Converter": "Convert Text to snake_case",
    "kebab-case Converter": "Convert Text to kebab-case",
    "dot.case Converter": "Convert Text to dot.case",
    "Invisible Text Generator": "Create Blank Unicode Text",
    "NATO Phonetic Alphabet Translator": "Translate Words to NATO Spelling",
    "Online Notepad": "Write Notes in Your Browser",
    "Online Sentence Counter": "Count Sentences Online",
    "Phonetic Spelling Tool": "Spell Words Phonetically",
    "Pig Latin Translator": "Translate Text to Pig Latin",
    "Plain Text Converter": "Convert Rich Text to Plain Text",
    "Markdown Table Generator": "Create Markdown Tables Online",
    "Remove Line Breaks": "Clean Up Text Online",
    "Remove Text Formatting": "Clean Pasted Text Online",
    "Remove Underscores": "Replace Underscores Online",
    "Repeat Text Generator": "Repeat Text Online",
    "Reverse Text Generator": "Reverse Text Online",
    "Roman Numeral Dates": "Convert Dates to Roman Numerals",
    "Sentence Case Converter": "Convert Text to Sentence Case",
    "Sort Words Alphabetically": "Sort Words A-Z Online",
    "Title Case Converter": "Convert Text to Title Case",
    "Whitespace Remover": "Remove Extra Spaces Online",
    "Wingdings Translator": "Convert Wingdings Text Online",
    "Word Cloud Generator": "Find Top Words Online",
    "Word Frequency Counter": "Count Word Usage Online"
  };

  return benefits[name] ?? "Edit and Clean Text Online";
}

function textToolAction(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("remove")) return "remove unwanted characters, breaks, formatting, or spacing";
  if (lowerName.includes("counter") || lowerName.includes("frequency")) return "count and analyze text";
  if (lowerName.includes("sort")) return "sort words and lines into a cleaner order";
  if (lowerName.includes("case")) return "change text casing for titles, sentences, names, and labels";
  if (lowerName.includes("translator") || lowerName.includes("converter")) return "convert text into a cleaner or more useful format";
  if (lowerName.includes("generator")) return "generate ready-to-copy text output";
  if (lowerName.includes("replace")) return "find and replace text matches";
  if (lowerName.includes("split")) return "split long text into smaller parts";
  if (lowerName.includes("join")) return "join lines into cleaner text";
  return "clean, edit, rewrite, or format pasted text";
}

function buildTextToolMetaTitle(tool: DirectoryTool) {
  return `${tool.name} | ${textToolBenefit(tool.name)}`;
}

function buildTextToolMetaDescription(tool: DirectoryTool) {
  const action = textToolAction(tool.name);
  return `Use this free ${tool.name} to ${action} online. Paste your text, run the tool instantly, then copy or download the cleaned result.`;
}

function buildCoreToolMetaDescription(tool: ToolConfig) {
  return getCoreToolHeader(tool).description;
}

function buildOnlineMetaDescription(tool: OnlineTool) {
  return getOnlineToolHeader(tool).description;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = []
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteUrl}${path}`;
  const brandedTitle = withBrand(title);
  const imageUrl = `${siteUrl}${defaultOgImage}`;

  return {
    title: {
      absolute: brandedTitle
    },
    description,
    keywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: brandedTitle,
      description,
      url,
      siteName: brandName,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: brandName
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [imageUrl]
    }
  };
}

export function buildToolMetadata(tool: ToolConfig): Metadata {
  const headerCopy = getCoreToolHeader(tool);
  return buildMetadata({
    title: headerCopy.title,
    description: buildCoreToolMetaDescription(tool),
    path: `/${tool.slug}`,
    keywords: [tool.name, tool.title, "free online code tool", "developer tool", "copy output", "download output"]
  });
}

export function buildDirectoryToolMetadata(tool: DirectoryTool): Metadata {
  const title = getDirectoryToolHeader(tool).title;
  const description = buildDirectoryMetaDescription(tool);

  return buildMetadata({
    title,
    description,
    path: tool.href,
    keywords: [
      tool.name,
      `${getCategoryLabel(tool.category)} tool`,
      "free online tool",
      "online developer tool",
      "copy output",
      "download output"
    ]
  });
}

export function buildOnlineToolMetadata(tool: OnlineTool): Metadata {
  const headerCopy = getOnlineToolHeader(tool);
  return buildMetadata({
    title: headerCopy.title,
    description: buildOnlineMetaDescription(tool),
    path: `/${tool.slug}`,
    keywords: [tool.name, "online coding workspace", "developer tool", "code playground", "free online tool"]
  });
}

export function buildToolFaqs(toolName: string, category: string) {
  return [
    {
      question: `What is ${toolName}?`,
      answer: `${toolName} is a free online ${category.toLowerCase()} tool for processing pasted text, code, data, or developer input in a fast browser workspace.`
    },
    {
      question: `How do I use ${toolName}?`,
      answer: "Paste or upload your input, run the tool, review the output, then copy or download the result as a text file."
    },
    {
      question: `Is ${toolName} free?`,
      answer: "Yes. The tool is available for free and does not require login for the MVP workflow."
    },
    {
      question: `Does ${toolName} store my input?`,
      answer: "The current MVP runs in the browser UI and is designed without accounts, databases, or saved user history."
    }
  ];
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function buildSoftwareApplicationJsonLd(tool: SeoTool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: tool.url,
    description: tool.description,
    featureList: [
      `${tool.name} input editor`,
      "Copy output",
      "Download output as text",
      "Clear input and output",
      "Responsive web layout"
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildJsonLdScripts(items: unknown[]) {
  return items.map((item, index) =>
    createElement("script", {
      key: index,
      type: "application/ld+json",
      dangerouslySetInnerHTML: { __html: JSON.stringify(item) }
    })
  );
}
