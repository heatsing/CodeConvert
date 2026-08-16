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
import { shouldIndexCoreTool, shouldIndexDirectoryTool, shouldIndexOnlineTool } from "@/lib/seo-quality";
import { getToolUserIntent } from "@/lib/tool-user-intent";

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
  keywords = [],
  robots
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  robots?: Metadata["robots"];
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
    robots: robots ?? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1
      }
    },
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

function robotsForIndexablePage(indexable: boolean): Metadata["robots"] {
  if (indexable) {
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1
      }
    };
  }

  return {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true
    }
  };
}

export function buildToolMetadata(tool: ToolConfig): Metadata {
  const headerCopy = getCoreToolHeader(tool);
  return buildMetadata({
    title: headerCopy.title,
    description: buildCoreToolMetaDescription(tool),
    path: `/${tool.slug}`,
    robots: robotsForIndexablePage(shouldIndexCoreTool(tool)),
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
    robots: robotsForIndexablePage(shouldIndexDirectoryTool(tool)),
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
    robots: robotsForIndexablePage(shouldIndexOnlineTool(tool)),
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
  const lowerToolName = toolName.toLowerCase();
  if (lowerToolName.includes("json to xml")) {
    return [
      {
        question: "What is a JSON to XML Converter?",
        answer: "A JSON to XML Converter turns JSON objects and arrays into XML-style markup so developers can compare formats, prepare integration examples, or move data into XML-based workflows."
      },
      {
        question: "How do I convert JSON to XML online?",
        answer: "Paste valid JSON into the input editor, run the converter, review the XML output, then copy or download the result for testing, documentation, or handoff."
      },
      {
        question: "Can JSON arrays be converted to XML?",
        answer: "Yes. Arrays are represented as repeated XML nodes or item-style elements. Review the output naming before using it with a strict XML schema."
      },
      {
        question: "Is the JSON to XML output production ready?",
        answer: "Use the result as a fast starting point. Validate the XML structure, naming rules, and schema requirements before sending it to production systems."
      },
      {
        question: "Does this tool change the original JSON values?",
        answer: "The converter is designed to preserve values while changing the structure from JSON to XML-style markup. Always review booleans, numbers, null values, and arrays."
      },
      {
        question: "When should I use JSON to XML conversion?",
        answer: "Use it for API testing, legacy integrations, SOAP-style examples, data migration notes, and documentation where XML output is easier to share."
      }
    ];
  }

  if (lowerToolName.includes("xml to json")) {
    return [
      {
        question: "What is an XML to JSON Converter?",
        answer: "An XML to JSON Converter turns XML-style markup into readable JSON so developers can inspect nested tags, API responses, and structured data in a format that is easier to use in scripts."
      },
      {
        question: "How do I convert XML to JSON online?",
        answer: "Paste XML into the input editor, run the converter, check the generated JSON structure, then copy or download the output."
      },
      {
        question: "How are XML attributes handled in JSON?",
        answer: "Attributes are usually represented as named properties in the JSON output. Review the generated structure if your downstream code expects a specific convention."
      },
      {
        question: "Can I use this for API response cleanup?",
        answer: "Yes. It is useful for turning XML API responses into JSON-like examples for debugging, frontend work, testing, and documentation."
      },
      {
        question: "Does XML to JSON conversion validate my XML?",
        answer: "The tool helps reveal structure, but strict XML validation should still be done with schema-aware tooling when production accuracy matters."
      },
      {
        question: "Is XML to JSON conversion free?",
        answer: "Yes. The tool is available as a free browser-based workspace with copy, download, clear, and paste-friendly editing."
      }
    ];
  }

  if (lowerToolName.includes("html to markdown")) {
    return [
      {
        question: "What is an HTML to Markdown Converter?",
        answer: "An HTML to Markdown Converter changes HTML tags into Markdown syntax so content is easier to edit in README files, docs, static sites, and writing tools."
      },
      {
        question: "How do I convert HTML to Markdown?",
        answer: "Paste HTML into the input editor, run the converter, review the Markdown output, then copy or download the result."
      },
      {
        question: "Which HTML elements convert well to Markdown?",
        answer: "Headings, paragraphs, links, lists, inline code, blockquotes, and simple tables usually convert well. Complex layouts may need manual cleanup."
      },
      {
        question: "Can I use this for documentation migration?",
        answer: "Yes. It is helpful for moving HTML snippets into Markdown docs, README files, knowledge bases, and static-site content."
      },
      {
        question: "Will the output keep all styling?",
        answer: "Markdown is content-focused, so CSS classes and layout styling may be dropped. Review the result if visual fidelity is important."
      },
      {
        question: "Is the converter browser based?",
        answer: "Yes. It is designed as a fast browser workspace with input, output, copy, download, and clear controls."
      }
    ];
  }

  if (lowerToolName.includes("json formatter")) {
    return [
      {
        question: "What is a JSON Formatter?",
        answer: "A JSON Formatter turns compact or messy JSON into readable structured data with indentation, line breaks, and nesting that is easier to inspect."
      },
      {
        question: "How do I format JSON online?",
        answer: "Paste JSON into the editor, run the formatter, review the formatted output, then copy or download the cleaned JSON."
      },
      {
        question: "Can this tool help find invalid JSON?",
        answer: "It can help reveal common structure issues such as missing commas, mismatched brackets, or invalid quoting, but critical data should be validated carefully."
      },
      {
        question: "Does formatting JSON change the data?",
        answer: "Formatting is intended to change whitespace and readability, not the actual keys, values, arrays, or objects."
      },
      {
        question: "When should developers use a JSON formatter?",
        answer: "Use it for API responses, configuration files, logs, test fixtures, webhooks, and any JSON data that needs quick review."
      },
      {
        question: "Can I download the formatted JSON?",
        answer: "Yes. After formatting, you can copy the output or download it as a text file."
      }
    ];
  }

  if (lowerToolName.includes("base64 encode")) {
    return [
      {
        question: "What is a Base64 Encoder?",
        answer: "A Base64 Encoder converts readable text or small developer payloads into Base64 text for testing, examples, and transport-safe strings."
      },
      {
        question: "How do I encode text to Base64?",
        answer: "Paste text into the input editor, run Base64 Encode, then copy or download the encoded output."
      },
      {
        question: "Does Base64 encrypt my data?",
        answer: "No. Base64 is encoding, not encryption. Anyone can decode it, so do not treat Base64 output as secure or private."
      },
      {
        question: "What can I encode with Base64?",
        answer: "You can encode text, JSON snippets, URLs, configuration examples, and other small string payloads."
      },
      {
        question: "Why do developers use Base64?",
        answer: "Developers use Base64 when they need a text-safe representation for examples, tests, APIs, configuration, or systems that expect encoded strings."
      },
      {
        question: "Can I decode Base64 too?",
        answer: "Yes. Use the related Base64 Decode tool when you need to turn encoded strings back into readable text."
      }
    ];
  }

  if (lowerToolName.includes("remove line breaks")) {
    return [
      {
        question: "What is a Remove Line Breaks tool?",
        answer: "A Remove Line Breaks tool joins broken lines into cleaner paragraphs so copied PDF text, emails, exports, and pasted notes are easier to reuse."
      },
      {
        question: "How do I remove line breaks from text?",
        answer: "Paste the text with unwanted line breaks, run the tool, review the cleaned paragraph, then copy or download the result."
      },
      {
        question: "Will it remove paragraph spacing?",
        answer: "The tool focuses on joining broken lines. Review the output if your text uses blank lines to separate real paragraphs."
      },
      {
        question: "When should I use this text cleanup tool?",
        answer: "Use it for PDF extracts, email drafts, spreadsheet exports, copied web text, CMS fields, and text that has hard wraps in the wrong places."
      },
      {
        question: "Does it change my words?",
        answer: "It is designed to remove line break characters and normalize spacing while preserving the original words."
      },
      {
        question: "Can I copy the cleaned text?",
        answer: "Yes. You can copy the output directly or download it as a text file."
      }
    ];
  }

  const userIntent = getToolUserIntent(toolName, category);

  return [
    {
      question: `What is ${toolName}?`,
      answer: `${toolName} is a browser-based tool for ${userIntent.audience.toLowerCase()}. ${userIntent.situation} The page keeps the source and result close together so changes can be reviewed before the output is reused.`
    },
    {
      question: `How do I use ${toolName}?`,
      answer: `${userIntent.steps[0]} ${userIntent.steps[1]} ${userIntent.steps[2]}`
    },
    {
      question: `When should I use ${toolName}?`,
      answer: `${userIntent.useCases[0]} It is also useful for ${userIntent.useCases[1].charAt(0).toLowerCase()}${userIntent.useCases[1].slice(1)}`
    },
    {
      question: `What should I paste into ${toolName}?`,
      answer: userIntent.input
    },
    {
      question: `What should I check in the ${toolName} result?`,
      answer: userIntent.review
    },
    {
      question: `Is ${toolName} suitable for production work?`,
      answer: `${userIntent.bestFor} Use the output as a reviewed working result, then validate it in the destination editor, runtime, API, form, or publishing system.`
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
      dangerouslySetInnerHTML: { __html: JSON.stringify(item).replace(/</g, "\\u003c") }
    })
  );
}
