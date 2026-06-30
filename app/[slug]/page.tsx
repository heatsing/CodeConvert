import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryToolWorkspace } from "@/components/directory-tool-workspace";
import { ToolLayout } from "@/components/tool-layout";
import { directoryToolBySlug, directoryTools, directoryToolSlug, getCategoryId, getCategoryLabel } from "@/lib/home-tools";
import { languageConverterBySlug, languageConverterTools } from "@/lib/language-converters";
import {
  buildBreadcrumbJsonLd,
  buildDirectoryToolMetadata,
  buildFaqJsonLd,
  buildJsonLdScripts,
  buildSoftwareApplicationJsonLd,
  buildToolFaqs,
  buildToolMetadata,
  getLanguageConverterDescription,
  getToolDescription
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { toolBySlug, type ToolSlug } from "@/lib/tools";

type RootToolPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return [...directoryTools.map((tool) => ({ slug: directoryToolSlug(tool.name) })), ...languageConverterTools.map((tool) => ({ slug: tool.href.slice(1) }))];
}

function getTool(slug: string) {
  const normalizedSlug = slug.toLowerCase();
  return directoryToolBySlug[normalizedSlug] ?? languageConverterBySlug[normalizedSlug];
}

export function generateMetadata({ params }: RootToolPageProps): Metadata {
  const normalizedSlug = params.slug.toLowerCase();
  const coreTool = toolBySlug[normalizedSlug as ToolSlug];
  if (coreTool) {
    return buildToolMetadata(coreTool);
  }

  const tool = getTool(normalizedSlug);
  if (!tool) return {};
  return buildDirectoryToolMetadata(tool);
}

export default function RootToolPage({ params }: RootToolPageProps) {
  const normalizedSlug = params.slug.toLowerCase();
  const coreTool = toolBySlug[normalizedSlug as ToolSlug];
  if (coreTool) {
    const url = `${siteUrl}/${coreTool.slug}`;

    return (
      <>
        {buildJsonLdScripts([
          buildFaqJsonLd(coreTool.faqs),
          buildSoftwareApplicationJsonLd({
            name: coreTool.name,
            title: coreTool.title,
            description: coreTool.description,
            category: "Code",
            url
          }),
          buildBreadcrumbJsonLd([
            { name: "CodeConvert.net", url: siteUrl },
            { name: coreTool.name, url }
          ])
        ])}
        <ToolLayout tool={coreTool} />
      </>
    );
  }

  const tool = getTool(normalizedSlug);
  if (!tool) notFound();
  const description = languageConverterBySlug[normalizedSlug] ? getLanguageConverterDescription(tool) : getToolDescription(tool);
  const categoryLabel = getCategoryLabel(tool.category);
  const faqs = buildToolFaqs(tool.name, categoryLabel);
  const url = `${siteUrl}${tool.href}`;

  return (
    <>
      {buildJsonLdScripts([
        buildFaqJsonLd(faqs),
        buildSoftwareApplicationJsonLd({
          name: tool.name,
          title: `${tool.name} Online`,
          description,
          category: categoryLabel,
          url
        }),
        buildBreadcrumbJsonLd([
          { name: "CodeConvert.net", url: siteUrl },
          { name: categoryLabel, url: `${siteUrl}/#${getCategoryId(tool.category)}` },
          { name: tool.name, url }
        ])
      ])}
      <DirectoryToolWorkspace tool={tool} />
    </>
  );
}
