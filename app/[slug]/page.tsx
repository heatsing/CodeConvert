import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryToolWorkspace } from "@/components/directory-tool-workspace";
import { OnlineToolWorkspace } from "@/components/online-tool-workspace";
import { OtherTools } from "@/components/other-tools";
import { ToolLayout } from "@/components/tool-layout";
import { ToolSeoContent } from "@/components/tool-seo-content";
import { getCategoryId, getCategoryLabel } from "@/lib/home-tools";
import { languageConverterBySlug } from "@/lib/language-converters";
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
import { getCoreToolHeader, getDirectoryToolHeader, getOnlineToolHeader } from "@/lib/tool-page-copy";
import { getToolPageContent } from "@/lib/tool-content";
import { getToolRoute, toolRoutes } from "@/lib/tool-route-inventory";
import { toolBySlug, type ToolSlug } from "@/lib/tools";

type RootToolPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return toolRoutes.map((route) => ({ slug: route.slug }));
}

function getTool(slug: string) {
  return getToolRoute(slug)?.directoryTool;
}

export function generateMetadata({ params }: RootToolPageProps): Metadata {
  const normalizedSlug = params.slug.toLowerCase();
  const coreTool = toolBySlug[normalizedSlug as ToolSlug];
  if (coreTool) {
    return buildToolMetadata(coreTool);
  }

  const onlineTool = getToolRoute(normalizedSlug)?.onlineTool;
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
    const headerCopy = getCoreToolHeader(coreTool);
    const content = getToolPageContent(coreTool.slug, headerCopy.title, headerCopy.description, "Code");

    return (
      <>
        {buildJsonLdScripts([
          buildFaqJsonLd(content.faq.length > 0 ? content.faq : coreTool.faqs),
          buildSoftwareApplicationJsonLd({
            name: coreTool.name,
            title: headerCopy.title,
            description: headerCopy.description,
            category: "Code",
            url
          }),
          buildBreadcrumbJsonLd([
            { name: "CodeConvert.net", url: siteUrl },
            { name: coreTool.name, url }
          ])
        ])}
        <main className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:py-10">
          <ToolLayout tool={coreTool} />
          <ToolSeoContent title={headerCopy.title} description={headerCopy.description} category="Code" content={content} />
          <OtherTools currentSlug={coreTool.slug} />
        </main>
      </>
    );
  }

  const tool = getTool(normalizedSlug);
  if (!tool) {
    const onlineTool = getToolRoute(normalizedSlug)?.onlineTool;
    if (!onlineTool) notFound();
    const url = `${siteUrl}/${onlineTool.slug}`;
    const headerCopy = getOnlineToolHeader(onlineTool);
    const content = getToolPageContent(onlineTool.slug, headerCopy.title, headerCopy.description, "Developer");

    return (
      <>
        {buildJsonLdScripts([
          buildFaqJsonLd(content.faq.length > 0 ? content.faq : buildToolFaqs(onlineTool.name, "Developer")),
          buildSoftwareApplicationJsonLd({
            name: onlineTool.name,
            title: headerCopy.title,
            description: headerCopy.description,
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
        <ToolSeoContent title={headerCopy.title} description={headerCopy.description} category={onlineTool.mode} content={content} />
      </>
    );
  }
  const description = languageConverterBySlug[normalizedSlug] ? getLanguageConverterDescription(tool) : getToolDescription(tool);
  const categoryLabel = getCategoryLabel(tool.category);
  const url = `${siteUrl}${tool.href}`;
  const headerCopy = getDirectoryToolHeader(tool);
  const content = getToolPageContent(normalizedSlug, headerCopy.title, headerCopy.description, categoryLabel);
  const faqs = content.faq.length > 0 ? content.faq : buildToolFaqs(tool.name, categoryLabel);

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
      <ToolSeoContent title={headerCopy.title} description={headerCopy.description} category={tool.category} content={content} />
    </>
  );
}
