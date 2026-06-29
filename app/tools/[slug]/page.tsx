import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TOOLS, toolBySlug, type ToolSlug } from "@/lib/tools";
import { siteUrl } from "@/lib/site";

type ToolPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: ToolPageProps): Metadata {
  const tool = toolBySlug[params.slug as ToolSlug];
  if (!tool) return {};

  const url = `${siteUrl}/${tool.slug}`;

  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${tool.title} | CodeTools AI`,
      description: tool.description,
      url,
      siteName: "CodeTools AI",
      type: "website"
    }
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = toolBySlug[params.slug as ToolSlug];
  if (!tool) notFound();

  redirect(`/${tool.slug}`);
}
