import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryToolWorkspace } from "@/components/directory-tool-workspace";
import { OnlineToolWorkspace } from "@/components/online-tool-workspace";
import { ToolLayout } from "@/components/tool-layout";
import { directoryToolBySlug, directoryTools, directoryToolSlug, getCategoryId, getCategoryLabel } from "@/lib/home-tools";
import { languageConverterBySlug, languageConverterTools } from "@/lib/language-converters";
import { onlineToolBySlug, onlineTools } from "@/lib/online-tools";
import {
  buildBreadcrumbJsonLd,
  buildDirectoryToolMetadata,
  buildFaqJsonLd,
  buildJsonLdScripts,
  buildOnlineToolMetadata,
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
  return [
    ...directoryTools.map((tool) => ({ slug: directoryToolSlug(tool.name) })),
    ...languageConverterTools.map((tool) => ({ slug: tool.href.slice(1) })),
    ...onlineTools.map((tool) => ({ slug: tool.slug }))
  ];
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

  const onlineTool = onlineToolBySlug[normalizedSlug];
  if (onlineTool) {
    return buildOnlineToolMetadata(onlineTool);
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
  if (!tool) {
    const onlineTool = onlineToolBySlug[normalizedSlug];
    if (!onlineTool) notFound();
    const url = `${siteUrl}/${onlineTool.slug}`;

    return (
      <>
        {buildJsonLdScripts([
          buildFaqJsonLd(buildToolFaqs(onlineTool.name, "Developer")),
          buildSoftwareApplicationJsonLd({
            name: onlineTool.name,
            title: `${onlineTool.name} Online Tool`,
            description: onlineTool.description,
            category: "Developer",
            url
          }),
          buildBreadcrumbJsonLd([
            { name: "CodeConvert.net", url: siteUrl },
            { name: "Developer Tools", url: `${siteUrl}/#online` },
            { name: onlineTool.name, url }
          ])
        ])}
        <OnlineToolWorkspace tool={onlineTool} />
      </>
    );
  }
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
