import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { TOOLS, toolBySlug, type ToolSlug } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/seo";

type ToolPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolBySlug[slug as ToolSlug];
  if (!tool) return {};

  return buildToolMetadata(tool);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = toolBySlug[slug as ToolSlug];
  if (!tool) notFound();

  permanentRedirect(`/${tool.slug}`);
}
