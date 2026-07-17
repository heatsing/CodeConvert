import type { Metadata } from "next";
import { createElement } from "react";
import { getCategoryLabel, type DirectoryTool } from "@/lib/home-tools";
import type { OnlineTool } from "@/lib/online-tools";
import { intentKeywords, keywordVariants, uniqueKeywords } from "@/lib/seo-keywords";
import { siteAvailableLanguages, siteIconUrl, siteLogoUrl, siteOpenGraphAlternateLocales, siteOpenGraphLocale, siteUrl } from "@/lib/site";
import {
  getCoreToolHeader,
  getCoreToolMetaDescription,
  getDirectoryToolHeader,
  getDirectoryToolMetaDescription,
  getOnlineToolHeader,
  getOnlineToolMetaDescription
} from "@/lib/tool-page-copy";
import type { ToolConfig } from "@/lib/tools";

const brandName = "CodeConvert.net";
const titleBrandName = "CodeConvert";
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
  return title.includes(titleBrandName) ? title : `${title} - ${titleBrandName}`;
}

function getConversionPair(title: string) {
  const match = title.match(/^(.+?) to (.+?) Converter$/i);
  if (!match) return null;

  return {
    from: match[1],
    to: match[2]
  };
}

function buildDirectoryMetaDescription(tool: DirectoryTool) {
  return getDirectoryToolMetaDescription(tool);
}

function buildCoreToolMetaDescription(tool: ToolConfig) {
  return getCoreToolMetaDescription(tool);
}

function buildOnlineMetaDescription(tool: OnlineTool) {
  return getOnlineToolMetaDescription(tool);
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
      canonical: url,
      languages: {
        "x-default": url,
        en: url
      }
    },
    openGraph: {
      title: brandedTitle,
      description,
      url,
      siteName: brandName,
      type: "website",
      locale: siteOpenGraphLocale,
      alternateLocale: siteOpenGraphAlternateLocales,
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
    keywords: uniqueKeywords([
      ...keywordVariants(tool.name),
      ...intentKeywords(tool.name, "Code", getCategoryLabel("Code")),
      tool.title,
      "free online code tool",
      "developer tool",
      "copy output",
      "download output"
    ])
  });
}

export function buildDirectoryToolMetadata(tool: DirectoryTool): Metadata {
  const title = getDirectoryToolHeader(tool).title;
  const description = buildDirectoryMetaDescription(tool);

  return buildMetadata({
    title,
    description,
    path: tool.href,
    keywords: uniqueKeywords([
      ...keywordVariants(tool.name),
      ...intentKeywords(tool.name, tool.category, getCategoryLabel(tool.category)),
      `${getCategoryLabel(tool.category)} tool`,
      `${getCategoryLabel(tool.category)} online`,
      "free online tool",
      "online developer tool",
      "copy output",
      "download output"
    ])
  });
}

export function buildOnlineToolMetadata(tool: OnlineTool): Metadata {
  const headerCopy = getOnlineToolHeader(tool);
  return buildMetadata({
    title: headerCopy.title,
    description: buildOnlineMetaDescription(tool),
    path: `/${tool.slug}`,
    keywords: uniqueKeywords([
      ...keywordVariants(tool.name),
      ...intentKeywords(tool.name, "Code", getCategoryLabel("Code")),
      "online coding workspace",
      "developer tool",
      "code playground",
      "free online tool",
      "browser code runner",
      "developer productivity tool"
    ])
  });
}

export function buildToolFaqs(toolName: string, category: string) {
  const normalizedCategory = category.toLowerCase();
  const lowerToolName = toolName.toLowerCase();
  const task = lowerToolName.includes("formatter") || lowerToolName.includes("beautifier")
    ? "clean indentation, improve readability, and prepare formatted output"
    : lowerToolName.includes("encode")
      ? "convert readable input into an encoded string"
      : lowerToolName.includes("decode")
        ? "turn encoded input back into readable output"
        : lowerToolName.includes("regex")
          ? "test, refine, or understand regular expression patterns"
          : lowerToolName.includes("counter")
            ? "measure text length, counts, and structure"
            : lowerToolName.includes("remove")
              ? "remove unwanted characters, formatting, comments, or repeated content"
              : lowerToolName.includes("converter") || lowerToolName.includes("convert")
                ? "convert input from one format, style, or language to another"
                : "process pasted input and produce cleaner output";
  const inputType = normalizedCategory.includes("text")
    ? "text, drafts, lists, paragraphs, or copied content"
    : normalizedCategory.includes("code")
      ? "source code, snippets, JSON, SQL, or developer data"
      : normalizedCategory.includes("regex")
        ? "patterns, flags, and sample text"
        : normalizedCategory.includes("network")
          ? "URLs, domains, IP addresses, headers, or query strings"
          : normalizedCategory.includes("security")
            ? "tokens, hashes, passwords, headers, or security-related text"
            : normalizedCategory.includes("format")
              ? "code, markup, configuration, or structured data"
              : "text, code, data, URLs, or structured input";

  return [
    {
      question: `What is ${toolName}?`,
      answer: `${toolName} is a free online ${category.toLowerCase()} tool built to ${task} in a browser workspace with side-by-side input and output.`
    },
    {
      question: `How do I use ${toolName}?`,
      answer: `Paste or upload ${inputType}, run ${toolName}, review the generated result, then copy the output or download it as a text file.`
    },
    {
      question: `When should I use ${toolName}?`,
      answer: `Use ${toolName} for quick cleanup, formatting, conversion, validation, documentation, and review tasks where you need a copy-ready result without installing another app.`
    },
    {
      question: `Does ${toolName} store my input?`,
      answer: "The current workflow is designed without accounts, databases, or saved user history. Review sensitive code or text before pasting it into any online tool."
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
    availableLanguage: siteAvailableLanguages,
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

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: siteLogoUrl,
      width: 1152,
      height: 217
    },
    image: siteIconUrl
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
