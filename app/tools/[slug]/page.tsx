import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { TOOLS } from "@/lib/tools";
import { getToolRoute } from "@/lib/tool-route-inventory";
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
  const tool = getToolRoute(slug)?.coreTool;
  if (!tool) return {};

  return buildToolMetadata(tool);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolRoute(slug)?.coreTool;
  if (!tool) notFound();

  permanentRedirect(`/${tool.slug}`);
}
