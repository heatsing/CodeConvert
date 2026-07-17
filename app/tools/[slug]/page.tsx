import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { TOOLS, toolBySlug, type ToolSlug } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/seo";

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

  return buildToolMetadata(tool);
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = toolBySlug[params.slug as ToolSlug];
  if (!tool) notFound();

  permanentRedirect(`/${tool.slug}`);
}
