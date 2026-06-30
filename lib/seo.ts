import type { Metadata } from "next";
import { createElement } from "react";
import type { DirectoryTool } from "@/lib/home-tools";
import type { OnlineTool } from "@/lib/online-tools";
import { siteUrl } from "@/lib/site";
import type { ToolConfig } from "@/lib/tools";

const brandName = "CodeTools AI";

type SeoTool = {
  name: string;
  title: string;
  description: string;
  category: string;
  url: string;
};

export function getToolDescription(tool: DirectoryTool) {
  return (
    tool.headerDescription ??
    `${tool.name} is a free online ${tool.category.toLowerCase()} tool for quick browser-based developer workflows. Paste your input, run the tool, then copy or download the result.`
  );
}

export function getLanguageConverterDescription(tool: DirectoryTool) {
  return `${tool.name} helps you turn source code from one programming language into another with a clean two-panel editor, language-aware sample output, copy, download, and file upload support.`;
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

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${title} | ${brandName}`,
      description,
      url,
      siteName: brandName,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${brandName}`,
      description
    }
  };
}

export function buildToolMetadata(tool: ToolConfig): Metadata {
  return buildMetadata({
    title: tool.title,
    description: tool.description,
    path: `/${tool.slug}`,
    keywords: [tool.name, tool.title, "online code tool", "developer tool"]
  });
}

export function buildDirectoryToolMetadata(tool: DirectoryTool): Metadata {
  const description = getToolDescription(tool);

  return buildMetadata({
    title: `${tool.name} Online`,
    description,
    path: tool.href,
    keywords: [tool.name, `${tool.category} tool`, "online developer tool", "free code tools"]
  });
}

export function buildOnlineToolMetadata(tool: OnlineTool): Metadata {
  return buildMetadata({
    title: `${tool.name} Online Tool`,
    description: tool.description,
    path: `/online-tools/${tool.slug}`,
    keywords: [tool.name, "online coding workspace", "developer tool", "code playground"]
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
