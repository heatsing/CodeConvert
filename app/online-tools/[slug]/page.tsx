import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnlineToolWorkspace } from "@/components/online-tool-workspace";
import { onlineToolBySlug, onlineTools } from "@/lib/online-tools";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildJsonLdScripts,
  buildOnlineToolMetadata,
  buildSoftwareApplicationJsonLd,
  buildToolFaqs
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";

type OnlineToolPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return onlineTools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: OnlineToolPageProps): Metadata {
  const tool = onlineToolBySlug[params.slug];
  if (!tool) return {};

  return buildOnlineToolMetadata(tool);
}

export default function OnlineToolPage({ params }: OnlineToolPageProps) {
  const tool = onlineToolBySlug[params.slug];
  if (!tool) notFound();
  const url = `${siteUrl}/online-tools/${tool.slug}`;

  return (
    <>
      {buildJsonLdScripts([
        buildFaqJsonLd(buildToolFaqs(tool.name, "Online developer")),
        buildSoftwareApplicationJsonLd({
          name: tool.name,
          title: `${tool.name} Online Tool`,
          description: tool.description,
          category: "Online developer",
          url
        }),
        buildBreadcrumbJsonLd([
          { name: "CodeTools AI", url: siteUrl },
          { name: "Online Developer Tools", url: `${siteUrl}/#online` },
          { name: tool.name, url }
        ])
      ])}
      <OnlineToolWorkspace tool={tool} />
    </>
  );
}
